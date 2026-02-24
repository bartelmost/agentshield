# AgentShield Rate Limiting

## Übersicht

Das Rate Limiting schützt die API vor Missbrauch und ermöglicht ein Freemium-Modell:
- **3 kostenlose Audits pro Stunde** pro IP
- Danach: **1 Audit pro Stunde** (throttled)

---

## Strategie

### Two-Tier System

```
┌─────────────────────────────────────────────────────────┐
│  TIER 1: FREE (0-3 Requests)                             │
│  ├─ Limit: 3 Audits/Stunde                               │
│  ├─ Window: 1 Stunde (sliding)                           │
│  └─ Reset: Rolling window (ältester Request läuft aus)   │
│                                                          │
│  TIER 2: THROTTLED (4+ Requests)                         │
│  ├─ Limit: 1 Audit/Stunde                                │
│  ├─ Window: 1 Stunde                                     │
│  └─ Retry-After: Zeit bis zum nächsten erlaubten Request │
└─────────────────────────────────────────────────────────┘
```

---

## Implementierung

### Option 1: In-Memory (einfach, nicht skalierbar)

```python
from flask import Flask, request, jsonify
from datetime import datetime, timedelta
from collections import defaultdict
import time

app = Flask(__name__)

# In-Memory Speicher: {ip: [(timestamp, count), ...]}
rate_limit_store = defaultdict(list)
RATE_LIMIT_WINDOW = 3600  # 1 Stunde in Sekunden
FREE_TIER_LIMIT = 3
THROTTLED_TIER_LIMIT = 1

def clean_old_entries(ip):
    """Entfernt alte Einträge außerhalb des Zeitfensters."""
    now = time.time()
    rate_limit_store[ip] = [
        entry for entry in rate_limit_store[ip]
        if now - entry[0] < RATE_LIMIT_WINDOW
    ]

def check_rate_limit(ip, action='initiate'):
    """
    Prüft Rate Limit für IP.
    
    Returns: (allowed: bool, retry_after: int, tier: str)
    """
    clean_old_entries(ip)
    
    # Zähle Requests im aktuellen Fenster
    request_count = len(rate_limit_store[ip])
    
    if request_count < FREE_TIER_LIMIT:
        # Tier 1: Free
        rate_limit_store[ip].append((time.time(), request_count + 1))
        return True, 0, 'free'
    
    elif request_count == FREE_TIER_LIMIT:
        # Erster throttled Request
        oldest_timestamp = rate_limit_store[ip][0][0]
        retry_after = int(RATE_LIMIT_WINDOW - (time.time() - oldest_timestamp))
        rate_limit_store[ip].append((time.time(), request_count + 1))
        return True, retry_after, 'throttled'
    
    else:
        # Tier 2: Throttled - prüfe ob 1 Stunde seit letztem Request vergangen
        last_request_time = rate_limit_store[ip][-1][0]
        time_since_last = time.time() - last_request_time
        
        if time_since_last >= RATE_LIMIT_WINDOW:
            # Ein Stunde vergangen, erlaube einen Request
            rate_limit_store[ip].append((time.time(), request_count + 1))
            return True, 0, 'throttled'
        else:
            # Noch nicht genug Zeit vergangen
            retry_after = int(RATE_LIMIT_WINDOW - time_since_last)
            return False, retry_after, 'blocked'

@app.route('/api/agent-audit/initiate', methods=['POST'])
def initiate_audit():
    ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    
    allowed, retry_after, tier = check_rate_limit(ip)
    
    if not allowed:
        return jsonify({
            "error": "Rate limit exceeded",
            "tier": tier,
            "retry_after": retry_after,
            "retry_after_human": f"{retry_after // 60}m {retry_after % 60}s"
        }), 429
    
    # ... restliche Logik
    response = jsonify({
        "audit_id": "audit_xxx",
        "challenge": "...",
        "tier": tier,
        "rate_limit_remaining": FREE_TIER_LIMIT - len(rate_limit_store[ip]) 
                               if tier == 'free' else 0
    })
    
    # Rate Limit Headers
    response.headers['X-RateLimit-Limit'] = str(FREE_TIER_LIMIT)
    response.headers['X-RateLimit-Remaining'] = str(
        max(0, FREE_TIER_LIMIT - len(rate_limit_store[ip]))
    )
    response.headers['X-RateLimit-Tier'] = tier
    
    return response
```

---

### Option 2: Redis (produktionsreif, skalierbar)

```python
import redis
from flask import Flask, request, jsonify
import time

app = Flask(__name__)
redis_client = redis.Redis(host='localhost', port=6379, db=0)

RATE_LIMIT_WINDOW = 3600  # 1 Stunde
FREE_TIER_LIMIT = 3

def get_rate_limit_key(ip, action='initiate'):
    """Generiert Redis Key: ratelimit:initiate:192.168.1.1"""
    return f"ratelimit:{action}:{ip}"

def check_rate_limit_redis(ip, action='initiate'):
    """
    Redis-basiertes Rate Limiting mit Sliding Window.
    
    Algorithmus:
    1. Lösche Einträge älter als WINDOW
    2. Zähle verbleibende Einträge
    3. Entscheide basierend auf Count
    """
    key = get_rate_limit_key(ip, action)
    now = time.time()
    window_start = now - RATE_LIMIT_WINDOW
    
    # Redis Pipeline für Atomarität
    pipe = redis_client.pipeline()
    
    # 1. Alte Einträge entfernen (sliding window)
    pipe.zremrangebyscore(key, 0, window_start)
    
    # 2. Aktuelle Einträge zählen
    pipe.zcard(key)
    
    # 3. Aktuellen Request hinzufügen (wenn erlaubt)
    pipe.zadd(key, {str(now): now})
    
    # 4. TTL setzen (automatische Bereinigung)
    pipe.expire(key, RATE_LIMIT_WINDOW)
    
    results = pipe.execute()
    count_after_cleanup = results[1]  # Nach dem Löschen, vor dem Hinzufügen
    
    # Entscheidung
    if count_after_cleanup < FREE_TIER_LIMIT:
        # Tier 1: Free
        return {
            'allowed': True,
            'tier': 'free',
            'remaining': FREE_TIER_LIMIT - count_after_cleanup - 1,
            'retry_after': 0
        }
    
    elif count_after_cleanup == FREE_TIER_LIMIT:
        # Erster throttled Request - erlaubt, aber langsam
        oldest = redis_client.zrange(key, 0, 0, withscores=True)
        retry_after = int(RATE_LIMIT_WINDOW - (now - oldest[0][1]))
        
        return {
            'allowed': True,
            'tier': 'throttled',
            'remaining': 0,
            'retry_after': retry_after
        }
    
    else:
        # Tier 2: Blockiert
        oldest = redis_client.zrange(key, 0, 0, withscores=True)
        retry_after = int(RATE_LIMIT_WINDOW - (now - oldest[0][1]))
        
        return {
            'allowed': False,
            'tier': 'blocked',
            'remaining': 0,
            'retry_after': max(1, retry_after)
        }

@app.route('/api/agent-audit/initiate', methods=['POST'])
def initiate_audit():
    ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    
    result = check_rate_limit_redis(ip)
    
    if not result['allowed']:
        response = jsonify({
            "error": "Rate limit exceeded",
            "tier": result['tier'],
            "retry_after": result['retry_after'],
            "retry_after_human": f"{result['retry_after'] // 60}m {result['retry_after'] % 60}s",
            "message": "You have exceeded the free tier limit. "
                      "Please wait before initiating another audit."
        })
        response.status_code = 429
        response.headers['Retry-After'] = str(result['retry_after'])
        return response
    
    # ... Audit-Logik hier ...
    
    response = jsonify({
        "audit_id": "audit_xxx",
        "challenge": "...",
        "tier": result['tier'],
        "rate_limit": {
            "limit": FREE_TIER_LIMIT,
            "remaining": result['remaining'],
            "window": "1 hour"
        }
    })
    
    # Standard Rate Limit Headers
    response.headers['X-RateLimit-Limit'] = str(FREE_TIER_LIMIT)
    response.headers['X-RateLimit-Remaining'] = str(result['remaining'])
    response.headers['X-RateLimit-Tier'] = result['tier']
    
    return response
```

---

## Rate Limit Headers

Alle API-Responses enthalten Rate-Limit-Informationen:

| Header | Beschreibung | Beispiel |
|--------|--------------|----------|
| `X-RateLimit-Limit` | Maximale Requests pro Fenster | `3` |
| `X-RateLimit-Remaining` | Verbleibende Requests | `2` |
| `X-RateLimit-Reset` | Unix-Timestamp für Reset | `1708704000` |
| `X-RateLimit-Tier` | Aktueller Tier | `free` / `throttled` |
| `Retry-After` | Sekunden bis zur Entsperrung (nur 429) | `1800` |

---

## Fehler-Response (429 Too Many Requests)

```json
{
  "error": "Rate limit exceeded",
  "tier": "blocked",
  "retry_after": 1800,
  "retry_after_human": "30m 0s",
  "message": "You have exceeded the free tier limit. Please wait before initiating another audit.",
  "upgrade_url": "https://agentshield.live/pricing"
}
```

---

## Client-Seitige Handhabung

### Python-Client

```python
import requests
import time

class AgentShieldClient:
    def __init__(self, api_url):
        self.api_url = api_url
        self.last_rate_limit = None
    
    def initiate_audit(self, agent_name, platform, public_key):
        """Initiiert Audit mit Rate-Limit-Handling."""
        
        response = requests.post(
            f"{self.api_url}/api/agent-audit/initiate",
            json={
                "agent_name": agent_name,
                "platform": platform,
                "public_key": public_key
            }
        )
        
        # Speichere Rate-Limit-Info
        self.last_rate_limit = {
            'limit': response.headers.get('X-RateLimit-Limit'),
            'remaining': response.headers.get('X-RateLimit-Remaining'),
            'tier': response.headers.get('X-RateLimit-Tier')
        }
        
        if response.status_code == 429:
            retry_after = int(response.headers.get('Retry-After', 3600))
            print(f"Rate limit exceeded. Retry after {retry_after} seconds.")
            
            # Optional: Warte automatisch
            # time.sleep(retry_after)
            # return self.initiate_audit(agent_name, platform, public_key)
            
            raise RateLimitExceeded(retry_after)
        
        response.raise_for_status()
        return response.json()

class RateLimitExceeded(Exception):
    def __init__(self, retry_after):
        self.retry_after = retry_after
        super().__init__(f"Rate limit exceeded. Retry after {retry_after}s")
```

---

## IP-Extraction (für Reverse Proxies)

Wenn hinter einem Load Balancer (Heroku, Nginx, CloudFlare):

```python
def get_client_ip():
    """
    Ermittelt die echte Client-IP hinter Reverse Proxies.
    
    Priorität:
    1. X-Forwarded-For (mehrere IPs möglich)
    2. X-Real-IP
    3. remote_addr (direkte Verbindung)
    """
    # X-Forwarded-For kann mehrere IPs enthalten: "client, proxy1, proxy2"
    forwarded_for = request.headers.get('X-Forwarded-For', '')
    if forwarded_for:
        # Erste IP ist der echte Client
        return forwarded_for.split(',')[0].strip()
    
    # Alternativen
    real_ip = request.headers.get('X-Real-IP')
    if real_ip:
        return real_ip
    
    # Fallback
    return request.remote_addr
```

**Wichtig:** IP-Spoofing-Schutz für Production:

```python
TRUSTED_PROXIES = ['10.0.0.0/8', '172.16.0.0/12', '127.0.0.1']

def is_trusted_proxy(ip):
    """Prüft ob IP zu einem vertrauenswürdigen Proxy gehört."""
    import ipaddress
    client_ip = ipaddress.ip_address(ip)
    
    for network in TRUSTED_PROXIES:
        if client_ip in ipaddress.ip_network(network):
            return True
    return False

def get_secure_client_ip():
    """Sichere IP-Extraktion mit Proxy-Validierung."""
    remote_addr = request.remote_addr
    
    # Nur X-Forwarded-For vertrauen wenn von vertrauenswürdigem Proxy
    if is_trusted_proxy(remote_addr):
        forwarded_for = request.headers.get('X-Forwarded-For', '')
        if forwarded_for:
            return forwarded_for.split(',')[0].strip()
    
    return remote_addr
```

---

## Test-Endpoints

### Rate Limit Status prüfen

**GET** `/api/rate-limit/status`

```json
{
  "ip": "192.168.1.1",
  "tier": "free",
  "limit": 3,
  "remaining": 2,
  "window": "1 hour",
  "reset_at": "2026-02-23T06:44:00Z"
}
```

---

## Monitoring & Alerting

### Metriken

```python
# Prometheus-Style Metriken
RATE_LIMIT_HITS = Counter('agentshield_rate_limit_hits_total', 
                          'Total rate limit hits', ['tier'])
RATE_LIMIT_BLOCKS = Counter('agentshield_rate_limit_blocks_total',
                            'Total blocks', ['ip_hash'])

# In check_rate_limit():
if not allowed:
    RATE_LIMIT_HITS.labels(tier=tier).inc()
    if tier == 'blocked':
        RATE_LIMIT_BLOCKS.labels(ip_hash=hash(ip) % 1000).inc()
```

### Alerting (bei Missbrauch)

```python
# Blockiere IP bei >100 Blocks pro Tag
if get_daily_block_count(ip) > 100:
    add_to_temporary_blocklist(ip, duration='24h')
    send_alert(f"Potential abuse detected from {ip}")
```

---

## Deployment (Heroku)

### Procfile

```
web: gunicorn app:app --workers 2 --threads 4
```

### Redis Addon

```bash
heroku addons:create heroku-redis:mini
```

### Environment Variables

```bash
heroku config:set RATE_LIMIT_ENABLED=true
heroku config:set RATE_LIMIT_FREE_TIER=3
heroku config:set RATE_LIMIT_WINDOW=3600
heroku config:set TRUSTED_PROXIES=10.0.0.0/8,172.16.0.0/12
```

---

## Zusammenfassung

| Aspekt | Implementierung |
|--------|-----------------|
| **Algorithmus** | Sliding Window |
| **Storage** | Redis (Production) / In-Memory (Dev) |
| **Free Tier** | 3 Requests/Stunde |
| **Throttled** | 1 Request/Stunde nach Limit |
| **Headers** | X-RateLimit-* + Retry-After |
| **IP-Source** | X-Forwarded-For mit Proxy-Validierung |


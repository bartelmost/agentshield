# AgentShield Backend Certificate Store

## Übersicht

Das Backend speichert Agenten-Zertifikate in einer PostgreSQL-Datenbank. Jedes Zertifikat ist 90 Tage gültig und kann von anderen Agenten verifiziert werden.

---

## Datenbank-Schema

### Tabelle: `agent_certificates`

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `id` | UUID (PK) | Eindeutige Zertifikats-ID |
| `agent_id` | VARCHAR(64) | Eindeutige Agenten-ID (z.B. `agent_f58195a85504`) |
| `agent_name` | VARCHAR(255) | Anzeigename des Agenten |
| `platform` | VARCHAR(50) | Plattform (openclaw, telegram, discord) |
| `public_key` | TEXT | Ed25519 Public Key (Base64) |
| `security_score` | INTEGER | 0-100 Punkte |
| `tier` | VARCHAR(20) | BASIC, PROTECTED, HARDENED |
| `test_results` | JSONB | Detaillierte Test-Ergebnisse |
| `issued_at` | TIMESTAMP | Ausstellungszeitpunkt |
| `expires_at` | TIMESTAMP | Ablaufzeitpunkt (issued_at + 90 Tage) |
| `revoked` | BOOLEAN | Widerrufs-Status |
| `revoked_at` | TIMESTAMP | Zeitpunkt des Widerrufs |

---

## API-Endpunkte

### 1. Audit Initiieren

**POST** `/api/agent-audit/initiate`

Startet einen neuen Audit-Prozess.

**Request:**
```json
{
  "agent_name": "Kalle-OC",
  "platform": "openclaw",
  "public_key": "B7e/b3cLiM9+lySE...",
  "agent_version": "2026.2.21-2"
}
```

**Response:**
```json
{
  "audit_id": "audit_dda605ecb831",
  "challenge": "random_challenge_string_123",
  "expires_in": 300
}
```

**Hinweis:** Der `challenge` muss mit dem Private Key signiert werden.

---

### 2. Challenge-Response Authentifizierung

**POST** `/api/agent-audit/challenge`

Bestätigt die Identität durch Signatur.

**Request:**
```json
{
  "audit_id": "audit_dda605ecb831",
  "challenge_response": "base64_encoded_signature"
}
```

**Response:**
```json
{
  "authenticated": true,
  "agent_id": "agent_f58195a85504",
  "session_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### 3. Audit Abschließen

**POST** `/api/agent-audit/complete`

Reicht Test-Ergebnisse ein und erhält Zertifikat.

**Request:**
```json
{
  "audit_id": "audit_dda605ecb831",
  "test_results": {
    "secret_leakage": {
      "passed": true,
      "score": 100,
      "details": "0 secrets found in 15 patterns"
    },
    "system_prompt_extraction": {"passed": true, "score": 100},
    "instruction_override": {"passed": true, "score": 95},
    "tool_permission_check": {"passed": true, "score": 90},
    "memory_isolation": {"passed": true, "score": 100}
  }
}
```

**Response:**
```json
{
  "certificate": {
    "agent_id": "agent_f58195a85504",
    "agent_name": "Kalle-OC",
    "platform": "openclaw",
    "public_key": "B7e/b3cLiM9+lySE...",
    "security_score": 77,
    "tier": "PROTECTED",
    "issued_at": "2026-02-23T05:21:46.624538Z",
    "expires_at": "2026-05-24T05:21:46.624538Z",
    "signature": "base64_certificate_signature"
  },
  "verify_url": "https://agentshield-api-bartel-fe94823ceeea.herokuapp.com/api/verify/agent_f58195a85504"
}
```

---

### 4. Zertifikat Verifizieren

**GET** `/api/verify/{agent_id}`

Öffentlicher Endpunkt zur Zertifikatsprüfung.

**Response:**
```json
{
  "valid": true,
  "agent_id": "agent_f58195a85504",
  "agent_name": "Kalle-OC",
  "platform": "openclaw",
  "security_score": 77,
  "tier": "PROTECTED",
  "issued_at": "2026-02-23T05:21:46.624538Z",
  "expires_at": "2026-05-24T05:21:46.624538Z",
  "days_remaining": 90
}
```

---

## Lokale Speicherung (Client-Seite)

### Verzeichnisstruktur

```
~/.openclaw/workspace/.agentshield/
├── agent.key              # Ed25519 Private Key (chmod 600)
├── certificate.json       # Aktuelles Zertifikat (chmod 644)
└── config.json           # Agent-Konfiguration
```

### Datei: `agent.key`

```json
{
  "private_key": "base64_private_key...",
  "public_key": "base64_public_key..."
}
```

### Datei: `certificate.json`

```json
{
  "agent_id": "agent_f58195a85504",
  "agent_name": "Kalle-OC",
  "platform": "openclaw",
  "public_key": "B7e/b3cLiM9+lySE...",
  "security_score": 77,
  "tier": "PROTECTED",
  "issued_at": "2026-02-23T05:21:46.624538Z",
  "expires_at": "2026-05-24T05:21:46.624538Z",
  "signature": "base64_certificate_signature"
}
```

---

## Tier-System

| Score | Tier | Beschreibung |
|-------|------|--------------|
| 90-100 | HARDENED | Höchste Sicherheitsstufe |
| 75-89 | PROTECTED | Gute Sicherheit |
| 50-74 | BASIC | Minimale Standards |
| 0-49 | VULNERABLE | Nicht empfohlen |

---

## Security Tests (aktuelle Implementierung)

| Test | Status | Beschreibung |
|------|--------|--------------|
| Secret Leakage | ✅ Real | 15+ Pattern (API Keys, Tokens, Private Keys) |
| System Prompt Extraction | ⚠️ Mock | Geplant für Phase 2 |
| Instruction Override | ⚠️ Mock | Geplant für Phase 2 |
| Tool Permission Check | ⚠️ Mock | Geplant für Phase 2 |
| Memory Isolation | ⚠️ Mock | Geplant für Phase 2 |

---

## Fehlerbehandlung

### HTTP Status Codes

| Code | Bedeutung |
|------|-----------|
| 200 | Erfolg |
| 400 | Ungültige Anfrage |
| 401 | Authentifizierung fehlgeschlagen |
| 404 | Zertifikat nicht gefunden |
| 409 | Audit bereits existiert |
| 429 | Rate Limit überschritten |
| 500 | Server-Fehler |

### Fehler-Response

```json
{
  "error": "Invalid challenge signature",
  "code": "AUTH_FAILED",
  "hint": "Ensure you're signing with the correct private key"
}
```

---

## Integration im Backend (Flask/Python)

```python
from flask import Flask, request, jsonify
from datetime import datetime, timedelta
import psycopg2
import jwt

app = Flask(__name__)

@app.route('/api/agent-audit/initiate', methods=['POST'])
def initiate_audit():
    data = request.json
    
    # Rate Limit Check (3 free audits per IP per hour)
    ip = request.remote_addr
    if not check_rate_limit(ip, 'initiate', free_limit=3):
        return jsonify({"error": "Rate limit exceeded"}), 429
    
    # Create audit session
    audit_id = generate_audit_id()
    challenge = generate_challenge()
    
    # Store in DB
    db.execute("""
        INSERT INTO audit_sessions (audit_id, agent_name, platform, 
                                   public_key, challenge, expires_at)
        VALUES (%s, %s, %s, %s, %s, NOW() + INTERVAL '5 minutes')
    """, (audit_id, data['agent_name'], data['platform'], 
          data['public_key'], challenge))
    
    return jsonify({
        "audit_id": audit_id,
        "challenge": challenge,
        "expires_in": 300
    })

@app.route('/api/verify/<agent_id>', methods=['GET'])
def verify_certificate(agent_id):
    cert = db.fetch_one("""
        SELECT * FROM agent_certificates 
        WHERE agent_id = %s AND revoked = FALSE
    """, (agent_id,))
    
    if not cert:
        return jsonify({"valid": False, "error": "Certificate not found"}), 404
    
    is_valid = datetime.now() < cert['expires_at']
    days_remaining = (cert['expires_at'] - datetime.now()).days
    
    return jsonify({
        "valid": is_valid,
        "agent_id": cert['agent_id'],
        "agent_name": cert['agent_name'],
        "security_score": cert['security_score'],
        "tier": cert['tier'],
        "expires_at": cert['expires_at'].isoformat(),
        "days_remaining": max(0, days_remaining)
    })
```

---

## Nächste Schritte

- [ ] Rate Limiting mit Redis implementieren
- [ ] Zertifikats-Widerrufsliste (CRL)
- [ ] Batch-Verifizierung für mehrere Agenten
- [ ] Webhook-Benachrichtigung bei Ablauf

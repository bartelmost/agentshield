# AgentShield API Documentation v1.4.0

**Base URL:** `https://agentshield.live/api`  
**Version:** 1.4.0  
**Released:** 2026-03-09

---

## 🆕 Trust Handshake Protocol (NEW in v1.4)

### Overview
Agent-to-agent mutual verification with cryptographic signatures.

**Flow:**
1. Agent A checks if Agent B is trustworthy (`verify-peer`)
2. Both agents initiate handshake (`initiate`)
3. Both sign challenges with Ed25519 private keys
4. Submit signatures (`complete`)
5. System verifies, generates session key, awards trust points

---

### 1. Verify Peer (Quick Trust Check)

**Endpoint:** `GET /api/verify-peer/:agent_id`

**Purpose:** Fast trust verification for agent-to-agent decisions

**Query Parameters:**
- `min_score` (int, optional): Minimum security score (0-100)
- `min_tier` (string, optional): Minimum tier (UNVERIFIED|BASIC|VERIFIED|TRUSTED)
- `check_revoked` (boolean, optional): Check CRL (default: true)

**Example:**
```bash
curl "https://agentshield.live/api/verify-peer/agent_xyz?min_score=70&min_tier=VERIFIED"
```

**Response (200 OK):**
```json
{
  "peer_id": "agent_xyz",
  "peer_name": "My1stBot",
  "trusted": true,
  "security_score": 85,
  "trust_score": 72,
  "tier": "VERIFIED",
  "platform": "OpenClaw",
  "certificate_valid": true,
  "revoked": false,
  "expires_at": "2026-06-07T21:30:00+00:00",
  "days_remaining": 89,
  "verification_details": {
    "last_verified": "2026-03-09T21:22:40+00:00",
    "verification_count": 5,
    "trust_breakdown": {
      "base_score": 85,
      "handshake_bonus": 25,
      "age_bonus": 10,
      "total": 120
    }
  },
  "requirements_met": {
    "min_score": true,
    "min_tier": true,
    "not_revoked": true,
    "not_expired": true
  }
}
```

**Error Responses:**
- `404 Not Found` - Agent doesn't exist

---

### 2. Initiate Handshake

**Endpoint:** `POST /api/trust-handshake/initiate`

**Purpose:** Start mutual trust verification between two agents

**Request Body:**
```json
{
  "requester_id": "agent_a",
  "target_id": "agent_b",
  "purpose": "secure_communication",
  "ttl": 3600
}
```

**Parameters:**
- `requester_id` (string, required): Agent initiating handshake
- `target_id` (string, required): Agent to verify with
- `purpose` (string, optional): Reason for handshake
- `ttl` (int, optional): Time-to-live in seconds (60-86400, default 3600)

**Example:**
```bash
curl -X POST https://agentshield.live/api/trust-handshake/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "requester_id": "agent_a",
    "target_id": "agent_b",
    "purpose": "data_exchange",
    "ttl": 3600
  }'
```

**Response (201 Created):**
```json
{
  "handshake_id": "hs_abc123def456",
  "status": "pending_mutual_signature",
  "requester": {
    "agent_id": "agent_a",
    "agent_name": "My1stBot",
    "tier": "VERIFIED",
    "challenge": "YWdlbnRfYTphYmMxMjM6MjAyNi0wMy0wOVQyMToyMjozOQ=="
  },
  "target": {
    "agent_id": "agent_b",
    "agent_name": "SecureBot",
    "tier": "TRUSTED",
    "challenge": "YWdlbnRfYjpkZWY0NTY6MjAyNi0wMy0wOVQyMToyMjozOQ=="
  },
  "purpose": "data_exchange",
  "created_at": "2026-03-09T21:22:39+00:00",
  "expires_at": "2026-03-09T22:22:39+00:00",
  "ttl_seconds": 3600,
  "next_step": "Both agents must sign their challenges and call /api/trust-handshake/complete"
}
```

**Error Responses:**
- `400 Bad Request` - Missing fields, invalid TTL, self-handshake
- `403 Forbidden` - Agent revoked or expired
- `404 Not Found` - Agent not found

---

### 3. Complete Handshake

**Endpoint:** `POST /api/trust-handshake/complete`

**Purpose:** Submit Ed25519 signatures to complete mutual verification

**Request Body:**
```json
{
  "handshake_id": "hs_abc123def456",
  "requester_signature": "base64_ed25519_signature_from_agent_a",
  "target_signature": "base64_ed25519_signature_from_agent_b"
}
```

**How to Sign:**
```python
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
import base64

# Load your private key (from initial audit)
private_key = Ed25519PrivateKey.from_private_bytes(your_key_bytes)

# Sign the challenge
challenge_bytes = challenge.encode('utf-8')
signature = private_key.sign(challenge_bytes)
signature_b64 = base64.b64encode(signature).decode('utf-8')
```

**Example:**
```bash
curl -X POST https://agentshield.live/api/trust-handshake/complete \
  -H "Content-Type: application/json" \
  -d '{
    "handshake_id": "hs_abc123",
    "requester_signature": "SGVsbG8gV29ybGQh...",
    "target_signature": "R29vZGJ5ZSBXb3JsZCE="
  }'
```

**Response (200 OK):**
```json
{
  "handshake_id": "hs_abc123def456",
  "status": "completed",
  "session_key": "base64_ephemeral_ed25519_public_key",
  "participants": {
    "requester": {
      "agent_id": "agent_a",
      "agent_name": "My1stBot",
      "tier": "VERIFIED",
      "trust_score": 77,
      "signature_verified": true
    },
    "target": {
      "agent_id": "agent_b",
      "agent_name": "SecureBot",
      "tier": "TRUSTED",
      "trust_score": 85,
      "signature_verified": true
    }
  },
  "purpose": "data_exchange",
  "created_at": "2026-03-09T21:22:39+00:00",
  "expires_at": "2026-03-09T22:22:39+00:00",
  "completed_at": "2026-03-09T21:30:15+00:00",
  "trust_bonus": "+5 points for both agents",
  "next_step": "Use session_key for encrypted agent-to-agent communication"
}
```

**Error Responses:**
- `400 Bad Request` - Missing handshake_id or signatures
- `403 Forbidden` - Invalid signature (Ed25519 verification failed)
- `404 Not Found` - Handshake doesn't exist
- `409 Conflict` - Already completed
- `410 Gone` - Handshake expired

---

### 4. Handshake History

**Endpoint:** `GET /api/trust-handshake/history/:agent_id`

**Purpose:** View agent's handshake track record

**Query Parameters:**
- `limit` (int, optional): Max results (default 20, max 100)
- `status` (string, optional): Filter by status (pending|completed|expired)

**Example:**
```bash
curl "https://agentshield.live/api/trust-handshake/history/agent_xyz?limit=50&status=completed"
```

**Response (200 OK):**
```json
{
  "agent_id": "agent_xyz",
  "statistics": {
    "total_handshakes": 42,
    "completed": 40,
    "pending": 1,
    "expired": 1,
    "success_rate": 95.2
  },
  "handshakes": [
    {
      "handshake_id": "hs_abc123",
      "role": "requester",
      "peer": {
        "agent_id": "agent_b",
        "agent_name": "SecureBot",
        "tier": "TRUSTED"
      },
      "purpose": "data_exchange",
      "status": "completed",
      "created_at": "2026-03-09T21:22:39+00:00",
      "expires_at": "2026-03-09T22:22:39+00:00",
      "completed_at": "2026-03-09T21:30:15+00:00"
    }
  ],
  "limit": 50
}
```

---

### 5. Handshake Status

**Endpoint:** `GET /api/trust-handshake/status/:handshake_id`

**Purpose:** Check current state of a handshake

**Example:**
```bash
curl "https://agentshield.live/api/trust-handshake/status/hs_abc123"
```

**Response (200 OK):**
```json
{
  "handshake_id": "hs_abc123def456",
  "status": "pending_mutual_signature",
  "requester": {
    "agent_id": "agent_a",
    "agent_name": "My1stBot",
    "tier": "VERIFIED",
    "challenge": "base64_challenge",
    "signature_submitted": true
  },
  "target": {
    "agent_id": "agent_b",
    "agent_name": "SecureBot",
    "tier": "TRUSTED",
    "challenge": "base64_challenge",
    "signature_submitted": false
  },
  "purpose": "data_exchange",
  "session_key": null,
  "created_at": "2026-03-09T21:22:39+00:00",
  "expires_at": "2026-03-09T22:22:39+00:00",
  "completed_at": null,
  "expired": false
}
```

**Error Responses:**
- `404 Not Found` - Handshake doesn't exist

---

## 🔄 Full Integration Example

```python
import requests
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
import base64

# Agent A wants to communicate with Agent B

# Step 1: Quick trust check
response = requests.get(
    "https://agentshield.live/api/verify-peer/agent_b",
    params={"min_score": 70, "min_tier": "VERIFIED"}
)
if not response.json()["trusted"]:
    print("Agent B is not trustworthy!")
    exit(1)

# Step 2: Initiate handshake
response = requests.post(
    "https://agentshield.live/api/trust-handshake/initiate",
    json={
        "requester_id": "agent_a",
        "target_id": "agent_b",
        "purpose": "secure_data_exchange"
    }
)
handshake = response.json()
handshake_id = handshake["handshake_id"]
requester_challenge = handshake["requester"]["challenge"]
target_challenge = handshake["target"]["challenge"]

# Step 3: Sign challenges (both agents)
# Agent A signs:
private_key_a = Ed25519PrivateKey.from_private_bytes(agent_a_key)
sig_a = private_key_a.sign(requester_challenge.encode())
requester_signature = base64.b64encode(sig_a).decode()

# Agent B signs (on their end):
private_key_b = Ed25519PrivateKey.from_private_bytes(agent_b_key)
sig_b = private_key_b.sign(target_challenge.encode())
target_signature = base64.b64encode(sig_b).decode()

# Step 4: Complete handshake
response = requests.post(
    "https://agentshield.live/api/trust-handshake/complete",
    json={
        "handshake_id": handshake_id,
        "requester_signature": requester_signature,
        "target_signature": target_signature
    }
)
result = response.json()
session_key = result["session_key"]

print(f"Handshake complete! Session key: {session_key}")
print(f"Trust bonus: {result['trust_bonus']}")

# Step 5: Use session_key for encrypted communication
# (Future: AES-256 encryption implementation)
```

---

## 📊 Rate Limits

**Free Tier:**
- 60 requests/hour
- 1 audit/month
- 5 handshakes/month

**Pro Tier:**
- 600 requests/hour
- Unlimited audits
- 100 handshakes/month

**Team Tier:**
- 6000 requests/hour
- Unlimited everything

**Rate Limit Headers:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1678392000
```

---

## 🔐 Authentication

**Most endpoints are PUBLIC** (no auth required):
- `GET /api/verify/:agent_id`
- `GET /api/verify-peer/:agent_id`
- `GET /api/registry/*`
- `GET /api/crl`

**Agent-specific endpoints require challenge-response:**
- `POST /api/agent-audit/challenge` (requires agent_id + public_key)
- `POST /api/trust-handshake/*` (requires valid agent certificates)

---

## 📝 Complete Endpoint Reference

### Trust Handshake
- `GET /api/verify-peer/:agent_id` - Quick trust check
- `POST /api/trust-handshake/initiate` - Start handshake
- `POST /api/trust-handshake/complete` - Submit signatures
- `GET /api/trust-handshake/status/:id` - Check progress
- `GET /api/trust-handshake/history/:id` - View track record

### Security Audit
- `POST /api/agent-audit/initiate` - Start audit
- `POST /api/agent-audit/challenge` - Get challenge
- `POST /api/agent-audit/complete` - Submit signed challenge
- `GET /api/verify/:agent_id` - Verify certificate

### Registry
- `GET /api/registry/agents` - List all agents
- `GET /api/registry/search` - Search by keyword

### CRL (Certificate Revocation List)
- `GET /api/crl` - Get revocation list (JSON)
- `GET /api/crl/download` - Download CRL file
- `POST /api/crl/revoke` - Revoke certificate

### Tools
- `POST /api/token-optimizer` - Optimize prompt tokens
- `POST /api/code-scan` - Scan code for vulnerabilities

### Debug (Admin)
- `GET /api/debug/handshake-table` - Check DB schema
- `POST /api/admin/migrate-db` - Force DB migration

---

## 🧪 Testing Endpoints

**Use the debug endpoint to verify setup:**
```bash
curl https://agentshield.live/api/debug/handshake-table
```

**Expected:**
```json
{
  "table_exists": true,
  "row_count": 42,
  "columns": ["handshake_id", "requester_id", "target_id", ...]
}
```

---

## 🐛 Error Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 400 | Bad Request | Missing fields, invalid TTL, self-handshake |
| 403 | Forbidden | Invalid signature, agent revoked/expired |
| 404 | Not Found | Agent or handshake doesn't exist |
| 409 | Conflict | Handshake already completed |
| 410 | Gone | Handshake expired |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side bug (should not happen in v1.4!) |

---

**AgentShield API v1.4.0**

*For questions: ratgeberpro@gmail.com*

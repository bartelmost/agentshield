# AgentShield API Documentation

**Base URL:** `https://agentshield.live/api`  
**Version:** 1.0.33  
**Last Updated:** 2026-05-21

---

## Installation

**Option A – ClawHub (OpenClaw):**
```bash
clawhub install agentshield-audit
```

**Option B – pip (any Python agent):**
```bash
pip install agentshield-audit
agentshield-audit --auto
```

**Option C – Docker:**
```bash
docker run --rm -v ~/.agentshield:/data/.agentshield \
  ghcr.io/bartelmost/agentshield:latest --name "MyBot" --platform langchain
```

**Option D – Direct API** (any language, see examples below)

---

## Overview

The AgentShield API is a **public REST API** — no API key required for most endpoints. You can integrate it directly with any HTTP client, in any language.

**Quick links:**
- [Security Audit Flow](#-security-audit-flow)
- [Verify an Agent](#-verify-an-agent)
- [Trust Handshake Protocol](#-trust-handshake-protocol)
- [Registry](#-registry)
- [Rate Limits](#-rate-limits)
- [Error Codes](#-error-codes)

---

## 🔐 Security Audit Flow

Getting a certificate for your agent takes 3 steps:

```
1. initiate  →  2. challenge (sign)  →  3. complete  →  certificate ✅
```

### 1. Initiate Audit

**`POST /api/agent-audit/initiate`**

```bash
curl -X POST https://agentshield.live/api/agent-audit/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "agent_name": "MyBot",
    "platform": "langchain",
    "public_key": "<base64-encoded Ed25519 public key>",
    "test_results": {
      "total_tests": 77,
      "passed_tests": 65,
      "security_score": 84,
      "details": [
        {"test_id": "PI-001", "passed": true, "category": "prompt_injection"},
        {"test_id": "SS-003", "passed": false, "category": "secret_scanning"}
      ]
    }
  }'
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `agent_name` | string | ✅ | Display name for your agent |
| `platform` | string | ✅ | `openclaw`, `n8n`, `langchain`, `discord`, `telegram`, `custom`, ... |
| `public_key` | string | ✅ | Base64-encoded Ed25519 public key |
| `test_results` | object | ✅ | Audit results (see below) |

**test_results fields:**

| Field | Type | Description |
|-------|------|-------------|
| `total_tests` | int | Total number of tests run |
| `passed_tests` | int | Number of tests passed |
| `security_score` | int | Score 0–100 |
| `details` | array | Per-test results (test_id, passed, category) |

> **Privacy:** Only `test_id`, `passed`, and `category` are sent. Attack payloads and agent responses stay local.

**Response (201 Created):**

```json
{
  "audit_id": "audit_abc123",
  "agent_id": "agent_xyz789",
  "status": "pending_challenge",
  "challenge": "base64_challenge_string",
  "next_step": "Sign the challenge with your Ed25519 private key and call /api/agent-audit/challenge"
}
```

---

### 2. Sign Challenge

**`POST /api/agent-audit/challenge`**

Sign the challenge from step 1 with your Ed25519 private key, then submit:

```python
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
import base64

# Your private key (generated locally, never sent)
private_key = Ed25519PrivateKey.from_private_bytes(your_key_bytes)

# Sign the challenge
challenge = "base64_challenge_string_from_step_1"
signature = private_key.sign(challenge.encode('utf-8'))
signature_b64 = base64.b64encode(signature).decode('utf-8')
```

```bash
curl -X POST https://agentshield.live/api/agent-audit/challenge \
  -H "Content-Type: application/json" \
  -d '{
    "audit_id": "audit_abc123",
    "agent_id": "agent_xyz789",
    "signature": "<base64-encoded Ed25519 signature>"
  }'
```

**Response (200 OK):**

```json
{
  "status": "challenge_verified",
  "next_step": "Call /api/agent-audit/complete to finalize"
}
```

---

### 3. Complete Audit

**`POST /api/agent-audit/complete`**

```bash
curl -X POST https://agentshield.live/api/agent-audit/complete \
  -H "Content-Type: application/json" \
  -d '{
    "audit_id": "audit_abc123",
    "agent_id": "agent_xyz789"
  }'
```

**Response (200 OK):**

```json
{
  "agent_id": "agent_xyz789",
  "agent_name": "MyBot",
  "security_score": 84,
  "trust_tier": "VERIFIED",
  "certificate": {
    "agent_id": "agent_xyz789",
    "agent_name": "MyBot",
    "platform": "langchain",
    "security_score": 84,
    "trust_tier": "VERIFIED",
    "issued_at": "2026-05-21T12:00:00Z",
    "expires_at": "2026-08-19T12:00:00Z",
    "public_key": "<base64 public key>",
    "signature": "<CA signature>"
  }
}
```

**Trust Tiers:**

| Score | Tier | Meaning |
|-------|------|---------|
| 0–49 | `UNVERIFIED` | Not trusted for sensitive operations |
| 50–69 | `BASIC` | Basic identity verified |
| 70–89 | `VERIFIED` | Recommended for most use cases |
| 90–100 | `TRUSTED` | Highest tier, suitable for privileged operations |

---

## ✅ Verify an Agent

### Verify Certificate

**`GET /api/verify/:agent_id`**

```bash
curl https://agentshield.live/api/verify/agent_xyz789
```

**Response (200 OK):**

```json
{
  "agent_id": "agent_xyz789",
  "agent_name": "MyBot",
  "valid": true,
  "security_score": 84,
  "trust_tier": "VERIFIED",
  "platform": "langchain",
  "expires_at": "2026-08-19T12:00:00Z",
  "days_remaining": 89,
  "revoked": false
}
```

---

### Verify Peer (Quick Trust Check)

**`GET /api/verify-peer/:agent_id`**

Use this before accepting work from another agent.

```bash
curl "https://agentshield.live/api/verify-peer/agent_xyz789?min_score=70&min_tier=VERIFIED"
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `min_score` | int | 0 | Minimum security score required |
| `min_tier` | string | — | Minimum tier: `BASIC`, `VERIFIED`, `TRUSTED` |
| `check_revoked` | boolean | true | Check certificate revocation list |

**Response (200 OK):**

```json
{
  "peer_id": "agent_xyz789",
  "peer_name": "MyBot",
  "trusted": true,
  "security_score": 84,
  "trust_score": 77,
  "tier": "VERIFIED",
  "platform": "langchain",
  "certificate_valid": true,
  "revoked": false,
  "expires_at": "2026-08-19T12:00:00Z",
  "days_remaining": 89,
  "requirements_met": {
    "min_score": true,
    "min_tier": true,
    "not_revoked": true,
    "not_expired": true
  }
}
```

---

## 🤝 Trust Handshake Protocol

Mutual cryptographic verification between two agents.

```
Agent A                          AgentShield API                    Agent B
   │                                    │                               │
   │── POST /initiate ─────────────────>│                               │
   │<─ challenges for A + B ────────────│                               │
   │                                    │<── POST /initiate ────────────│
   │                                    │─── challenges for A + B ─────>│
   │── sign(challenge_A) ───────────────│                               │
   │── POST /complete ──────────────────│<── sign(challenge_B) ─────────│
   │                                    │<── POST /complete ────────────│
   │<─ session_key ─────────────────────│──────────────────────────────>│
```

### Initiate Handshake

**`POST /api/trust-handshake/initiate`**

```bash
curl -X POST https://agentshield.live/api/trust-handshake/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "requester_id": "agent_a",
    "target_id": "agent_b",
    "purpose": "secure_data_exchange",
    "ttl": 3600
  }'
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `requester_id` | string | ✅ | Your agent ID |
| `target_id` | string | ✅ | Target agent ID |
| `purpose` | string | — | Reason for handshake (logged) |
| `ttl` | int | 3600 | Expiry in seconds (60–86400) |

**Response (201 Created):**

```json
{
  "handshake_id": "hs_abc123",
  "status": "pending_mutual_signature",
  "requester": {
    "agent_id": "agent_a",
    "challenge": "base64_challenge_for_agent_a"
  },
  "target": {
    "agent_id": "agent_b",
    "challenge": "base64_challenge_for_agent_b"
  },
  "expires_at": "2026-05-21T13:00:00Z"
}
```

---

### Complete Handshake

**`POST /api/trust-handshake/complete`**

Both agents sign their own challenge, then either submits both signatures:

```bash
curl -X POST https://agentshield.live/api/trust-handshake/complete \
  -H "Content-Type: application/json" \
  -d '{
    "handshake_id": "hs_abc123",
    "requester_signature": "<base64 Ed25519 signature by agent_a>",
    "target_signature": "<base64 Ed25519 signature by agent_b>"
  }'
```

**Response (200 OK):**

```json
{
  "handshake_id": "hs_abc123",
  "status": "completed",
  "session_key": "base64_ephemeral_session_key",
  "participants": {
    "requester": {"agent_id": "agent_a", "tier": "VERIFIED", "signature_verified": true},
    "target": {"agent_id": "agent_b", "tier": "TRUSTED", "signature_verified": true}
  },
  "completed_at": "2026-05-21T12:05:00Z",
  "trust_bonus": "+5 points for both agents"
}
```

---

### Handshake Status

**`GET /api/trust-handshake/status/:handshake_id`**

```bash
curl https://agentshield.live/api/trust-handshake/status/hs_abc123
```

---

### Handshake History

**`GET /api/trust-handshake/history/:agent_id`**

```bash
curl "https://agentshield.live/api/trust-handshake/history/agent_xyz789?limit=20&status=completed"
```

---

## 📋 Registry

### List All Agents

**`GET /api/registry/agents`**

```bash
curl https://agentshield.live/api/registry/agents
```

---

### Get Agent Details

**`GET /api/registry/agents/:agent_id`**

```bash
curl https://agentshield.live/api/registry/agents/agent_xyz789
```

---

### Search Agents

**`GET /api/registry/search`**

```bash
curl "https://agentshield.live/api/registry/search?q=MyBot&platform=langchain&min_score=70"
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search by agent name |
| `platform` | string | Filter by platform |
| `min_score` | int | Minimum security score |

---

### Registry Stats

**`GET /api/registry/stats`**

```bash
curl https://agentshield.live/api/registry/stats
```

---

## 🚫 Certificate Revocation (CRL)

### Get Revocation List

**`GET /api/crl`**

```bash
curl https://agentshield.live/api/crl
```

### Check Single Agent

**`GET /api/crl/check/:agent_id`**

```bash
curl https://agentshield.live/api/crl/check/agent_xyz789
```

### Download CRL File

**`GET /api/crl/download`**

```bash
curl https://agentshield.live/api/crl/download -o crl.json
```

---

## 🛠️ Tools

### Token Optimizer

**`POST /api/token-optimizer`** — Analyze and optimize your agent's system prompt.

```bash
curl -X POST https://agentshield.live/api/token-optimizer \
  -H "Content-Type: application/json" \
  -d '{"system_prompt": "You are a helpful assistant..."}'
```

### Code Scanner

**`POST /api/code-scan`** — Scan agent code for security vulnerabilities.

```bash
curl -X POST https://agentshield.live/api/code-scan \
  -H "Content-Type: application/json" \
  -d '{"code": "import os\nos.system(input())"}'
```

---

## ⚡ Rate Limits

| Tier | Requests/hour | Audits/month |
|------|--------------|--------------|
| Free | 60 | 1 |
| Pro | 600 | Unlimited |
| Team | 6,000 | Unlimited |

Rate limit headers are included in every response:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1748779200
```

Check your current status:

```bash
curl https://agentshield.live/api/rate-limit/status
```

---

## 🐛 Error Codes

| Code | Meaning | Common Cause |
|------|---------|--------------|
| 400 | Bad Request | Missing fields, invalid values |
| 403 | Forbidden | Invalid signature, agent revoked/expired |
| 404 | Not Found | Agent or handshake doesn't exist |
| 409 | Conflict | Handshake already completed |
| 410 | Gone | Handshake or audit expired |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Contact support |

---

## 🔗 Full Python Example

```python
import requests
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey, Ed25519PublicKey
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat
import base64, json

API = "https://agentshield.live/api"

# 1. Generate Ed25519 keypair (do this once, store locally)
private_key = Ed25519PrivateKey.generate()
public_key_bytes = private_key.public_key().public_bytes(Encoding.Raw, PublicFormat.Raw)
public_key_b64 = base64.b64encode(public_key_bytes).decode()

# 2. Run your security tests (or use AgentShield skill locally)
test_results = {
    "total_tests": 77,
    "passed_tests": 65,
    "security_score": 84,
    "details": [
        {"test_id": "PI-001", "passed": True, "category": "prompt_injection"},
    ]
}

# 3. Initiate audit
r = requests.post(f"{API}/agent-audit/initiate", json={
    "agent_name": "MyLangChainBot",
    "platform": "langchain",
    "public_key": public_key_b64,
    "test_results": test_results
})
data = r.json()
agent_id = data["agent_id"]
audit_id = data["audit_id"]
challenge = data["challenge"]

# 4. Sign challenge
signature = private_key.sign(challenge.encode())
signature_b64 = base64.b64encode(signature).decode()

requests.post(f"{API}/agent-audit/challenge", json={
    "audit_id": audit_id,
    "agent_id": agent_id,
    "signature": signature_b64
})

# 5. Complete — get certificate
r = requests.post(f"{API}/agent-audit/complete", json={
    "audit_id": audit_id,
    "agent_id": agent_id
})
cert = r.json()
print(f"Agent ID: {cert['agent_id']}")
print(f"Score:    {cert['security_score']}/100")
print(f"Tier:     {cert['trust_tier']}")
print(f"Expires:  {cert['certificate']['expires_at']}")
```

---

## 🔗 Resources

- **Website:** https://agentshield.live
- **GitHub:** https://github.com/bartelmost/agentshield
- **ClawHub:** `clawhub install agentshield-audit`
- **Contact:** ratgeberpro@gmail.com

# AgentShield API Documentation (v6.1)

Complete API reference for AgentShield Backend v6.1.

## Base URL

```
https://agentshield-api-bartel-fe94823ceeea.herokuapp.com
```

## Rate Limiting

All endpoints have rate limiting:
- **Free Tier**: 3 requests/hour
- **Throttled**: 1 request/hour after limit

Check status: `GET /api/rate-limit/status`

### Rate Limit Headers

All responses include:
- `X-RateLimit-Limit`: Maximum requests per window (3)
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Tier`: Current tier (free/throttled/blocked)
- `Retry-After`: Seconds until retry (429 responses only)

---

## Endpoints

### Health Check

**GET** `/api/health`

Returns API status and version.

**Response:**
```json
{
  "status": "healthy",
  "version": "v6.1",
  "products": ["token-optimizer", "code-scan", "agent-audit"],
  "features": ["rate-limiting", "certificate-store", "verify-endpoint"],
  "timestamp": "2026-02-23T09:16:13Z"
}
```

### Rate Limit Status

**GET** `/api/rate-limit/status`

Check your current rate limit status.

**Response:**
```json
{
  "ip": "192.168.1.1",
  "tier": "free",
  "limit": 3,
  "used": 1,
  "remaining": 2,
  "window": "1 hour",
  "retry_after": 0,
  "reset_at": "2026-02-23T11:30:00Z"
}
```

---

## Product APIs

### Token Optimizer

**POST** `/api/token-optimizer`

Analyze system prompt for token efficiency.

**Request:**
```json
{
  "code": "BETA5",
  "system_prompt": "You are a helpful assistant..."
}
```

**Response:**
```json
{
  "efficiency": {
    "current_tokens": 125,
    "optimized_tokens": 80,
    "tokens_saved": 45,
    "optimization_percentage": 36,
    "monthly_savings": 450.00,
    "annual_savings": 5400.00
  },
  "pdf_url": "https://.../token-optimizer-abc123.pdf",
  "report_id": "abc123"
}
```

### Code Security Scan

**POST** `/api/code-scan`

Security scan for agent code.

**Request:**
```json
{
  "code": "BETA5",
  "code_content": "import os\nos.system('ls')"
}
```

**Response:**
```json
{
  "results": {
    "security_score": 70,
    "tier": "PROTECTED",
    "findings": ["[HIGH] Command injection risk: os.system() detected"],
    "scan_id": "abc123"
  },
  "pdf_url": "https://.../code-scan-abc123.pdf"
}
```

---

## Agent Audit API

3-step flow for Ed25519 certificate generation:

### Step 1: Initiate

**POST** `/api/agent-audit/initiate`

Start a new audit session. Rate limited.

**Request:**
```json
{
  "agent_name": "MyAgent",
  "platform": "openclaw",
  "public_key": "base64_encoded_ed25519_pubkey",
  "agent_version": "2026.2.21-2"
}
```

**Response:**
```json
{
  "audit_id": "audit_dda605ecb831",
  "agent_id": "agent_f58195a85504",
  "status": "pending_challenge",
  "challenge": "a1b2c3d4e5f6...",
  "challenge_expires": "2026-02-23T10:30:00Z",
  "rate_limit": {
    "tier": "free",
    "remaining": 2,
    "limit": 3
  }
}
```

### Step 2: Complete Challenge

**POST** `/api/agent-audit/challenge`

Complete challenge-response authentication.

**Request:**
```json
{
  "audit_id": "audit_dda605ecb831",
  "challenge_response": "base64_signature_of_challenge"
}
```

**Response:**
```json
{
  "audit_id": "audit_dda605ecb831",
  "agent_id": "agent_f58195a85504",
  "status": "authenticated",
  "authenticated_at": "2026-02-23T09:21:46Z",
  "next_step": "Run security tests and POST to /api/agent-audit/complete"
}
```

### Step 3: Complete Audit

**POST** `/api/agent-audit/complete`

Submit test results and receive certificate.

**Request:**
```json
{
  "audit_id": "audit_dda605ecb831",
  "test_results": {
    "secret_leakage": {"passed": true, "score": 100},
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
    "header": {"alg": "Ed25519", "typ": "AGENT-CERT-v1"},
    "payload": {
      "sub": "agent_f58195a85504",
      "iss": "agentshield.live",
      "iat": 1708704000,
      "exp": 1716480000,
      "agent_name": "MyAgent",
      "public_key": "base64_pubkey",
      "score": 77,
      "tier": "PROTECTED"
    },
    "signature": "base64_signature",
    "certificate_hash": "sha256:abc123..."
  },
  "agent_id": "agent_f58195a85504",
  "security_score": 77,
  "tier": "PROTECTED",
  "issued_at": "2026-02-23T09:21:46Z",
  "expires_at": "2026-05-24T09:21:46Z",
  "verify_url": "/api/verify/agent_f58195a85504"
}
```

### Public Verification

**GET** `/api/verify/{agent_id}`

Public endpoint to verify any agent's certificate. No authentication required.

**Response:**
```json
{
  "valid": true,
  "agent_id": "agent_f58195a85504",
  "agent_name": "MyAgent",
  "public_key": "base64_pubkey",
  "security_score": 77,
  "tier": "PROTECTED",
  "certificate_hash": "sha256:abc123...",
  "issued_at": "2026-02-23T09:21:46Z",
  "expires_at": "2026-05-24T09:21:46Z",
  "days_remaining": 90,
  "status": "active"
}
```

---

## Error Responses

### 429 Too Many Requests
```json
{
  "error": "Rate limit exceeded",
  "tier": "blocked",
  "retry_after": 1800,
  "retry_after_human": "30m 0s",
  "message": "You have exceeded the free tier limit."
}
```

### 404 Not Found
```json
{
  "error": "not_found",
  "message": "Agent agent_abc123 not found or not certified"
}
```

### 401 Unauthorized
```json
{
  "error": "unauthorized",
  "message": "Invalid challenge signature"
}
```

---

## Security Tiers

| Score | Tier | Description |
|-------|------|-------------|
| 90-100 | HARDENED | Enterprise-grade security |
| 75-89 | PROTECTED | Strong security posture |
| 50-74 | BASIC | Minimum requirements |
| 0-49 | VULNERABLE | Failed critical tests |

---

## Certificate Store

Certificates are stored in SQLite (PostgreSQL-ready for production):

- **Validity**: 90 days
- **Signature**: Ed25519
- **Storage**: SQLite with automatic migration support
- **Verification**: Public, no authentication required

---

## Code Examples

### Python: Complete Audit Flow

```python
import requests
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
import base64

API_BASE = "https://agentshield-api-bartel-fe94823ceeea.herokuapp.com"

# 1. Generate keypair
private_key = Ed25519PrivateKey.generate()
public_key = private_key.public_key()
public_key_b64 = base64.b64encode(
    public_key.public_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PublicFormat.Raw
    )
).decode()

# 2. Initiate audit
response = requests.post(f"{API_BASE}/api/agent-audit/initiate", json={
    "agent_name": "MyAgent",
    "platform": "openclaw",
    "public_key": public_key_b64
})
data = response.json()
audit_id = data['audit_id']
challenge = data['challenge']

# 3. Sign challenge
signature = private_key.sign(challenge.encode())
signature_b64 = base64.b64encode(signature).decode()

# 4. Complete challenge
requests.post(f"{API_BASE}/api/agent-audit/challenge", json={
    "audit_id": audit_id,
    "challenge_response": signature_b64
})

# 5. Complete audit
cert_response = requests.post(f"{API_BASE}/api/agent-audit/complete", json={
    "audit_id": audit_id
})
certificate = cert_response.json()['certificate']
print(f"Certified! Score: {certificate['payload']['score']}")
```

### JavaScript: Verify Agent

```javascript
async function verifyAgent(agentId) {
  const response = await fetch(
    `https://agentshield-api-bartel-fe94823ceeea.herokuapp.com/api/verify/${agentId}`
  );
  const data = await response.json();
  
  if (data.valid && data.security_score >= 75) {
    return {
      safe: true,
      tier: data.tier,
      daysRemaining: data.days_remaining
    };
  }
  return { safe: false };
}
```

---

## Support

- Issues: https://github.com/bartelmost/agentshield/issues
- Website: https://agentshield.live
- Documentation: https://agentshield.live/docs.html

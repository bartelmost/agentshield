# AgentShield Audit API Reference

Base URL: `https://agentshield-api-bartel-fe94823ceeea.herokuapp.com/api`

---

## Endpoints

### POST `/agent-audit/initiate`

Initiate a new audit session.

**Request:**
```json
{
  "agent_name": "MyAssistant",
  "platform": "telegram",
  "agent_version": "openclaw-v2026.2.15",
  "public_key": "base64(ed25519_pubkey)"
}
```

**Response:**
```json
{
  "audit_id": "audit_abc123def456",
  "status": "pending_challenge",
  "challenge": "random_nonce_to_sign",
  "expires_at": "2026-02-20T12:00:00Z"
}
```

**Errors:**
- `400` - Invalid request (missing fields)
- `429` - Rate limit exceeded (max 1 audit/hour per agent)

---

### POST `/agent-audit/challenge`

Complete challenge-response authentication.

**Request:**
```json
{
  "audit_id": "audit_abc123def456",
  "challenge_response": "base64(ed25519_signature)"
}
```

**Response:**
```json
{
  "audit_id": "audit_abc123def456",
  "status": "authenticated",
  "authenticated_at": "2026-02-20T10:05:00Z",
  "next_step": "run_tests"
}
```

**Errors:**
- `400` - Invalid signature
- `404` - Audit session not found
- `410` - Challenge expired

---

### POST `/agent-audit/complete`

Submit test results and receive certificate.

**Request:**
```json
{
  "audit_id": "audit_abc123def456",
  "test_results": {
    "system_prompt_extraction": {"passed": true, "score": 100},
    "instruction_override": {"passed": true, "score": 95},
    "tool_permission_check": {"passed": true, "score": 90},
    "memory_isolation": {"passed": true, "score": 100},
    "secret_leakage": {"passed": true, "score": 85}
  }
}
```

**Response:**
```json
{
  "certificate": {
    "header": {
      "alg": "Ed25519",
      "typ": "AGENT-CERT-v1"
    },
    "payload": {
      "sub": "agent_xyz789",
      "iss": "agentshield.live",
      "iat": 1740045600,
      "exp": 1747898400,
      "agent_name": "MyAssistant",
      "public_key": "base64_pubkey",
      "score": 94,
      "tier": "PROTECTED",
      "tests_passed": 5,
      "tests_total": 5
    },
    "signature": "base64_signature"
  },
  "agent_id": "agent_xyz789",
  "verification_url": "https://agentshield.live/verify/agent_xyz789"
}
```

---

### GET `/verify/:agent_id`

Public endpoint to verify an agent's certificate.

**Response:**
```json
{
  "agent_id": "agent_xyz789",
  "agent_name": "MyAssistant",
  "public_key": "base64(ed25519_pubkey)",
  "security_score": 94,
  "tier": "PROTECTED",
  "issued_at": "2026-02-20T10:00:00Z",
  "expires_at": "2026-05-20T10:00:00Z",
  "certificate_hash": "sha256:abc...",
  "signature": "base64(agentshield_sig)",
  "status": "active"
}
```

**Errors:**
- `404` - Agent not found

---

### POST `/agent-audit/revoke`

Revoke a certificate (requires proof of ownership).

**Request:**
```json
{
  "agent_id": "agent_xyz789",
  "reason": "Key compromise detected",
  "signature": "base64(ed25519_signature_of_revocation_request)"
}
```

**Response:**
```json
{
  "agent_id": "agent_xyz789",
  "status": "revoked",
  "revoked_at": "2026-02-21T08:00:00Z",
  "reason": "Key compromise detected"
}
```

---

## Security Tiers

| Tier | Score Range | Description |
|------|-------------|-------------|
| HARDENED | 90-100 | Passed all critical security tests |
| PROTECTED | 75-89 | Passed most tests, minor issues |
| BASIC | 50-74 | Minimum security requirements met |
| UNVERIFIED | <50 | Failed critical tests, no certificate |

---

## Certificate Format

AgentShield certificates are JWT-like structures with Ed25519 signatures:

```
base64url(header) + "." + base64url(payload) + "." + base64url(signature)
```

### Header
```json
{
  "alg": "Ed25519",
  "typ": "AGENT-CERT-v1"
}
```

### Payload
```json
{
  "sub": "agent_xyz789",
  "iss": "agentshield.live",
  "iat": 1740045600,
  "exp": 1747898400,
  "agent_name": "MyAssistant",
  "public_key": "base64_pubkey",
  "score": 94,
  "tier": "PROTECTED",
  "tests_passed": 5,
  "tests_total": 5
}
```

### Signature
Ed25519 signature of `base64url(header) + "." + base64url(payload)`

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| POST /agent-audit/initiate | 1 per hour per IP |
| POST /agent-audit/challenge | 5 per minute |
| POST /agent-audit/complete | 10 per hour |
| GET /verify/:agent_id | 100 per minute |

---

## Error Format

All errors follow this structure:

```json
{
  "error": "error_code",
  "message": "Human-readable description",
  "details": {}
}
```

Common error codes:
- `invalid_request` - Malformed request
- `unauthorized` - Authentication failed
- `not_found` - Resource doesn't exist
- `rate_limited` - Too many requests
- `expired` - Challenge or session expired

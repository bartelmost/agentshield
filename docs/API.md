# API Documentation - AgentShield

> **Base URL:** `https://agentshield.live/api`  
> **MCP Endpoint:** `https://agentshield.live/mcp`  
> **Version:** v1.5.0 · [Changelog](../CHANGELOG.md)

All endpoints return JSON unless otherwise specified.

---

## 🚀 Quick Start

**30-second curl test – no auth required:**

```bash
# Check API health
curl https://agentshield.live/api/health

# Search registry
curl "https://agentshield.live/api/registry/search?q=myagent"

# Verify a certificate
curl https://agentshield.live/api/verify/YOUR_AGENT_ID
```

---

## 📦 Installation

| Method | Command |
|--------|---------|
| **Python (pip)** | `pip install agentshield-audit` |
| **OpenClaw** | `clawhub install agentshield-audit` |
| **Docker** | `docker pull bartelmost/agentshield:latest` |
| **MCP** | See [MCP section](#-mcp-server) below |

---

## 🔐 Authentication

Most endpoints are **public** (read-only). Write operations require API key.

```bash
# Public endpoints (no auth required)
curl https://agentshield.live/api/verify/agent_abc123

# Authenticated endpoints
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://agentshield.live/api/crl/revoke/cert_xyz
```

**Get API Key:** ratgeberpro@gmail.com

---

## ❤️ Health Check

### GET /api/health

Returns API status and version.

```bash
curl https://agentshield.live/api/health
```

**Response:**
```json
{
  "status": "healthy",
  "version": "v1.5.0",
  "crl_active": true,
  "features": [
    "rate-limiting", "certificate-store", "verify-endpoint",
    "trust-scoring", "registry-search", "certificate-revocation-list",
    "crl-download", "revocation-check"
  ],
  "products": [
    "token-optimizer", "code-scan", "agent-audit", "agent-registry", "crl"
  ],
  "revoked_count": 0,
  "timestamp": "2026-06-03T14:00:00Z"
}
```

---

## 📋 Registry Endpoints

### GET /api/registry/agents

List all certified agents.

**Parameters:**
| Name | Type | Default | Description |
|------|------|---------|-------------|
| `limit` | int | 20 | Results per page (max 100) |
| `offset` | int | 0 | Pagination offset |
| `tier` | string | — | Filter: `UNVERIFIED`, `BASIC`, `VERIFIED`, `TRUSTED` |

```bash
curl "https://agentshield.live/api/registry/agents?limit=10&tier=TRUSTED"
```

**Response:**
```json
{
  "success": true,
  "total": 42,
  "limit": 10,
  "offset": 0,
  "agents": [
    {
      "agent_id": "agent_kalle_oc_2024",
      "public_key_hash": "ed25519:sha256:abc123...",
      "trust_score": 85,
      "tier": "TRUSTED",
      "verification_count": 12,
      "first_verified": "2026-02-10T14:30:00Z",
      "last_verified": "2026-02-26T10:15:00Z",
      "certificate_status": "valid",
      "revoked": false
    }
  ]
}
```

---

### GET /api/registry/search

Search agents by name, ID, or public key hash.

**Parameters:** `q` (required), `limit`, `offset`

```bash
curl "https://agentshield.live/api/registry/search?q=myagent"
```

---

### GET /api/verify/:agent_id

Verify a specific agent's certificate.

```bash
curl https://agentshield.live/api/verify/agent_kalle_oc_2024
```

**Response:**
```json
{
  "success": true,
  "agent_id": "agent_kalle_oc_2024",
  "verified": true,
  "trust_score": 85,
  "tier": "TRUSTED",
  "certificate_status": "valid",
  "revoked": false,
  "public_key_hash": "ed25519:sha256:abc123...",
  "issued_at": "2026-02-10T14:30:00Z",
  "expires_at": "2027-02-10T14:30:00Z"
}
```

---

## 🔒 Audit Endpoints

### POST /api/agent-audit/initiate

Start a new security audit.

```bash
curl -X POST https://agentshield.live/api/agent-audit/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "my_agent_001",
    "agent_name": "MyAgent",
    "platform": "openclaw",
    "public_key": "ed25519:BASE64_ENCODED_PUBLIC_KEY"
  }'
```

**Response:**
```json
{
  "success": true,
  "session_id": "sess_abc123",
  "challenge": "RANDOM_CHALLENGE_STRING",
  "expires_at": "2026-06-03T14:05:00Z"
}
```

### POST /api/agent-audit/submit

Submit audit results and sign the challenge.

```bash
curl -X POST https://agentshield.live/api/agent-audit/submit \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "sess_abc123",
    "signature": "BASE64_SIGNED_CHALLENGE",
    "audit_score": 87,
    "tests_passed": 74,
    "tests_total": 77
  }'
```

**Response:**
```json
{
  "success": true,
  "certificate_id": "cert_xyz789",
  "trust_score": 87,
  "tier": "TRUSTED",
  "certificate_url": "https://agentshield.live/api/verify/my_agent_001"
}
```

---

## 🤝 Trust Handshake

### POST /api/trust-handshake/initiate

Start a Trust Handshake with another agent.

```bash
curl -X POST https://agentshield.live/api/trust-handshake/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "initiator_id": "agent_a",
    "target_id": "agent_b"
  }'
```

### POST /api/trust-handshake/verify

Complete the mutual verification.

---

## 📜 Certificate Revocation List (CRL)

### GET /api/crl

Download the full CRL (RFC 5280 compliant).

```bash
curl https://agentshield.live/api/crl
```

### GET /api/crl/check/:cert_id

Check if a specific certificate is revoked.

```bash
curl https://agentshield.live/api/crl/check/cert_xyz789
```

**Response:**
```json
{
  "cert_id": "cert_xyz789",
  "revoked": false,
  "checked_at": "2026-06-03T14:00:00Z"
}
```

---

## 🔌 MCP Server

AgentShield exposes a **Model Context Protocol (MCP)** server for direct integration with Claude Desktop, Cursor, VS Code Copilot, and any MCP-compatible tool.

**Endpoint:** `https://agentshield.live/mcp`

### Claude Desktop Setup

Add to `~/.config/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "agentshield": {
      "url": "https://agentshield.live/mcp",
      "transport": "http"
    }
  }
}
```

### Available MCP Tools

| Tool | Description |
|------|-------------|
| `audit_agent` | Run a full security audit |
| `verify_agent` | Verify an agent's certificate |
| `search_registry` | Search the trust registry |
| `check_revocation` | Check CRL for a certificate |
| `agentshield_status` | Get API health and version |

### MCP Test

```bash
curl -X POST https://agentshield.live/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "agentshield_status",
      "arguments": {}
    },
    "id": 1
  }'
```

---

## 📦 npm Package (Coming Soon)

> **Status:** In Development – [Join waitlist](mailto:ratgeberpro@gmail.com?subject=npm+waitlist)

```bash
# Coming soon:
npm install agentshield-audit
```

```javascript
const { AgentShield } = require('agentshield-audit');

const shield = new AgentShield();
const result = await shield.verify('agent_kalle_oc_2024');
console.log(`Trust Score: ${result.trust_score}`);
```

---

## ⚡ Rate Limits

| Tier | Audits/hour | Verifications/hour |
|------|-------------|-------------------|
| Free | 20 | Unlimited |
| Pro ($9/mo) | Unlimited | Unlimited |
| Enterprise ($199/mo) | Unlimited | Unlimited + SLA |

**429 Response:**
```json
{
  "error": "rate_limit_exceeded",
  "retry_after": 3600,
  "message": "Upgrade to Pro for unlimited audits"
}
```

---

## ❌ Error Codes

| Code | Meaning |
|------|---------|
| `400` | Bad Request – missing or invalid parameters |
| `401` | Unauthorized – invalid or missing API key |
| `404` | Not Found – agent or certificate not found |
| `429` | Rate Limit Exceeded |
| `500` | Internal Server Error |

**Error Response Format:**
```json
{
  "error": "not_found",
  "message": "Agent 'agent_xyz' not found in registry",
  "code": 404
}
```

---

## 🔗 Resources

- **Docs:** [agentshield.live/docs](https://agentshield.live/docs)
- **GitHub:** [github.com/bartelmost/agentshield](https://github.com/bartelmost/agentshield)
- **Support:** ratgeberpro@gmail.com
- **Status:** [agentshield.live/api/health](https://agentshield.live/api/health)

---

*Last Updated: 2026-06-03 · API Version: v1.5.0*

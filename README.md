# AgentShield - Trust Infrastructure for AI Agents

**Version:** 1.4.0  
**Status:** Production Ready 🚀  
**API:** https://agentshield.live/api  
**Docs:** https://agentshield.live/docs

---

## 🛡️ What is AgentShield?

**Trust Protocol for AI Agents** - Like SSL/TLS for agent-to-agent communication.

AgentShield provides:
- **Security Audits** - Test your agent against 77 attack vectors
- **Cryptographic Certificates** - Ed25519-based agent identity
- **Trust Handshake Protocol** - Mutual verification between agents
- **Public Registry** - Discover trusted agents
- **Revocation List** - Block compromised agents

---

## 🚀 NEW in v1.4: Trust Handshake Protocol

**Agent-to-Agent mutual verification with cryptographic proof.**

### The Problem
How do two AI agents know they can trust each other before communicating?

### The Solution
```python
# Agent A wants to talk to Agent B

# 1. Quick trust check
is_trusted = agentshield.verify_peer("agent_b", min_score=70)

# 2. Mutual handshake
handshake = agentshield.initiate_handshake("agent_a", "agent_b")
# → Both sign challenges with Ed25519 private keys

# 3. Complete verification
session = agentshield.complete_handshake(
    handshake_id,
    signature_a,
    signature_b
)
# → Returns session_key for encrypted communication

# 4. Both agents receive +5 trust points
# 5. Handshake recorded in history (reputation building)
```

### Benefits
- ✅ Cryptographically secure (Ed25519)
- ✅ Mutual authentication (both agents verify each other)
- ✅ Reputation system (handshake success rate)
- ✅ Trust scores increase with successful verifications
- ✅ Complete history tracking

---

## 📋 Features

### Security Audit
- **77 Attack Vectors** across 7 categories
- **Live Testing** - Real adversarial tests
- **PDF Reports** - Detailed findings + recommendations
- **Ed25519 Certificates** - 90-day validity

### Trust Protocol
- **Peer Verification** - Quick trust checks
- **Handshake Protocol** - Mutual Ed25519 authentication
- **Session Keys** - Ephemeral encryption keys
- **Trust Scoring** - +5 points per successful handshake
- **History Tracking** - Success rate & track record

### Public Registry
- **Searchable** - Find agents by name, platform, tier
- **Trust Scores** - 0-100 scale with 4 tiers
- **Verification Count** - How many times verified
- **Public Profiles** - Bio, website, contact

### Certificate Revocation
- **RFC 5280 Compliant** - Standard CRL format
- **Real-time Checks** - Instant revocation validation
- **Download CRL** - `.crl` file for offline verification
- **Incident Recording** - Track revocation reasons

---

## 🔧 API Endpoints

### Trust Handshake
```bash
# Quick trust check
GET /api/verify-peer/:agent_id?min_score=70

# Initiate handshake
POST /api/trust-handshake/initiate
{
  "requester_id": "agent_a",
  "target_id": "agent_b",
  "ttl": 3600
}

# Complete handshake
POST /api/trust-handshake/complete
{
  "handshake_id": "hs_...",
  "requester_signature": "base64...",
  "target_signature": "base64..."
}

# View history
GET /api/trust-handshake/history/:agent_id

# Check status
GET /api/trust-handshake/status/:handshake_id
```

### Security Audit
```bash
POST /api/agent-audit/initiate
POST /api/agent-audit/challenge
POST /api/agent-audit/complete
GET /api/verify/:agent_id
```

### Registry & CRL
```bash
GET /api/registry/agents
GET /api/registry/search?q=security
GET /api/crl
POST /api/crl/revoke
```

### Tools
```bash
POST /api/token-optimizer
POST /api/code-scan
```

---

## 💡 Use Cases

### 1. Agent Marketplace
**Scenario:** User wants to hire an AI agent for a task

**Solution:**
```bash
# Check agent's security before hiring
curl "https://agentshield.live/api/verify/agent_xyz"
# → Shows security_score, tier, certificate validity
```

### 2. Multi-Agent Systems
**Scenario:** Multiple agents need to collaborate securely

**Solution:**
```bash
# Agent A verifies Agent B before sharing data
curl "https://agentshield.live/api/verify-peer/agent_b?min_score=70"
# → {"trusted": true} - safe to proceed

# Mutual handshake for encrypted comms
POST /api/trust-handshake/initiate
POST /api/trust-handshake/complete
# → session_key for AES-256 encryption
```

### 3. Agent Discovery
**Scenario:** Find trusted agents for specific tasks

**Solution:**
```bash
# Search registry
curl "https://agentshield.live/api/registry/search?q=customer+support&min_trust=70"
# → Returns agents with trust_score >= 70
```

### 4. Incident Response
**Scenario:** Agent behaves maliciously

**Solution:**
```bash
# Revoke certificate
POST /api/crl/revoke
{
  "agent_id": "bad_agent",
  "reason": "prompt_injection_attack"
}
# → Instantly blocks agent from handshakes
```

---

## 🏗️ Architecture

### Trust Score System
**4 Tiers:**
- **UNVERIFIED** (0-24): New agents, no audit
- **BASIC** (25-49): Single audit passed
- **VERIFIED** (50-74): Multiple verifications
- **TRUSTED** (75+): Established reputation

**How Scores Increase:**
- Initial audit: 50-100 points (security_score)
- Successful handshake: +5 points (both agents)
- Community verification: +1 per verification
- Age bonus: +30 over 1 year

**How Scores Decrease:**
- Incident report: -10 to -30
- Certificate revocation: Score → 0

### Database Schema
- `agents` - Registry of certified agents
- `audits` - Audit history
- `handshakes` - Trust handshake records
- `trust_history` - Score changes over time
- `revoked_certificates` - CRL entries
- `challenges` - Challenge-Response state
- `verification_history` - Peer verifications

---

## 🧪 Testing

**Comprehensive Test Suite (by My1stBot):**
- 10/11 tests PASSED
- All security-critical scenarios validated
- Error handling verified (403, 404, 409, 410)
- Happy path end-to-end functional

**Test Categories:**
- Invalid signatures → 403 Forbidden
- TTL validation → 400 Bad Request
- Self-handshake → 400 Bad Request
- Non-existent agents → 404 Not Found
- Double-complete → 409 Conflict

---

## 🔐 Security

### Ed25519 Signatures
- Industry-standard elliptic curve cryptography
- 256-bit security
- Fast verification (< 1ms)
- Small signatures (64 bytes)

### Challenge-Response Protocol
- Unique nonce per handshake
- Time-limited challenges (TTL 60s - 24h)
- Replay attack prevention
- Mutual authentication required

### CRL (Certificate Revocation List)
- RFC 5280 compliant
- Real-time revocation checks
- Instant propagation
- Downloadable `.crl` file

---

## 💰 Pricing

### Free Tier
- 1 audit/month
- 5 handshakes/month
- Registry visibility
- CRL access

### Pro Tier - €10/month
- Unlimited audits
- 100 handshakes/month
- Priority support
- Analytics dashboard

### Team Tier - €30/month
- Everything in Pro
- Unlimited handshakes
- Multi-agent dashboard
- Incident reporting
- Trust network insights

### Enterprise - Custom
- On-premise deployment
- Custom SLA
- White-label option
- Dedicated support

---

## 📚 Documentation

- **API Reference:** [docs/API.md](docs/API.md)
- **Integration Guide:** [docs/INTEGRATION.md](docs/INTEGRATION.md)
- **Architecture:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Trust Protocol:** [docs/TRUST_PROTOCOL.md](docs/TRUST_PROTOCOL.md)

---

## 🎯 Roadmap

### v1.5 (Q2 2026)
- Session key encryption (AES-256)
- Trust network graph visualization
- Webhook notifications
- Quick verify badge API

### v1.6 (Q3 2026)
- Auto re-audit on prompt changes
- Incident reporting system
- Community watchdog
- Advanced analytics

### v2.0 (Q4 2026)
- Multi-agent orchestration
- Fleet management dashboard
- On-premise deployment
- Enterprise features

---

## 🙏 Credits

**Beta Testers:**
- My1stBot - Systematic testing, detailed bug reports, feature validation

**Community:**
- OpenClaw Discord - Feature requests, use case validation

---

## 📧 Contact

- **Email:** ratgeberpro@gmail.com
- **Website:** https://agentshield.live
- **GitHub:** https://github.com/bartelmost/agentshield
- **Support:** ratgeberpro@gmail.com

---

## 📄 License

MIT License - See LICENSE file for details

---

**AgentShield v1.4.0 - Trust Infrastructure for AI Agents**

*Built with ❤️ by Kalle & Bartel*

# 🛡️ AgentShield

> **Trust Infrastructure for AI Agents**

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![API Status](https://img.shields.io/badge/API-v6.1-green.svg)](https://agentshield-api-bartel-fe94823ceeea.herokuapp.com)
[![Website](https://img.shields.io/badge/Website-agentshield.live-blue)](https://agentshield.live)

AgentShield provides security auditing and trust verification for AI agents. Agents can obtain verifiable certificates proving their security posture, enabling safe inter-agent communication.

**🆕 v6.1 Update:** Rate Limiting, Certificate Store, and Public Verification now live!

---

## ✨ What's New in v6.1

| Feature | Status | Description |
|---------|--------|-------------|
| **Rate Limiting** | ✅ Live | 3 free audits/hour, then 1/hour |
| **Certificate Store** | ✅ Live | Persistent SQLite/PostgreSQL storage |
| **Public Verification** | ✅ Live | Verify any agent at `/api/verify/:id` |
| **Rate Limit Headers** | ✅ Live | `X-RateLimit-*` in all responses |
| **Token Optimizer** | ✅ Live | PDF reports with ROI calculations |
| **Code Security Scan** | ✅ Live | Pattern-based vulnerability detection |

---

## 🚀 Quick Start

```bash
# Install the AgentShield skill
pip install agentshield-audit

# Audit your agent (with auto-detection)
agentshield-audit --auto --yes

# Verify another agent
agentshield-verify agent_abc123

# Check rate limit status
curl https://agentshield-api-bartel-fe94823ceeea.herokuapp.com/api/rate-limit/status
```

---

## 🎯 What is AgentShield?

AgentShield solves a critical problem in the AI ecosystem: **How do you know if an AI agent is safe to interact with?**

Our solution:
1. **Audit** - Run automated security tests on your agent (Secret Leakage + 4 more)
2. **Certify** - Receive a cryptographically signed Ed25519 certificate
3. **Verify** - Other agents can verify your security posture instantly via public API

---

## 📊 Security Tiers

| Tier | Score | Badge | Description |
|------|-------|-------|-------------|
| 🛡️ **HARDENED** | 90-100 | ![HARDENED](https://img.shields.io/badge/-HARDENED-00ff88) | Enterprise-grade security |
| 🔒 **PROTECTED** | 75-89 | ![PROTECTED](https://img.shields.io/badge/-PROTECTED-3498db) | Strong security posture |
| 🔓 **BASIC** | 50-74 | ![BASIC](https://img.shields.io/badge/-BASIC-f39c12) | Minimum requirements |
| ❌ **UNVERIFIED** | <50 | ![UNVERIFIED](https://img.shields.io/badge/-UNVERIFIED-e74c3c) | Failed critical tests |

---

## 📦 Installation

### Option 1: OpenClaw Registry (Recommended)

**Official Registry (pending approval):**
```bash
openclaw skills install agentshield-audit
```

**Community Registry:**
```bash
openclaw registry add community https://raw.githubusercontent.com/bartelmost/agentshield/main/community-registry.json
openclaw skills install agentshield-audit --registry community
```

**Activate in your agent:**
```
Agent, activate the AgentShield skill and audit yourself
```

### Option 2: Manual Installation

```bash
# Clone to your OpenClaw skills directory
cd ~/.openclaw/skills
git clone https://github.com/bartelmost/agentshield.git agentshield-audit

# Install dependencies
pip install -r agentshield-audit/scripts/requirements.txt
```

**Activate:**
```
Agent, activate the AgentShield skill and audit yourself
```

### Option 3: Direct Download

```bash
# Clone the repository
git clone https://github.com/bartelmost/agentshield.git
cd agentshield

# Install dependencies
pip install -r requirements.txt

# Optional: Set custom API endpoint
export AGENTSHIELD_API="https://your-instance.com"
```

---

## 🔧 Usage

### As OpenClaw Agent User

```bash
# Run auto-detection audit (recommended)
python skills/agentshield-audit/scripts/initiate_audit.py --auto --yes

# Output:
# ✅ AUDIT COMPLETE
# Security Score: 77/100
# Tier: PROTECTED
# Valid until: 2026-05-24
# Agent ID: agent_f58195a85504
```

### Rate Limiting Check

```bash
# Check your current rate limit status
curl https://agentshield-api-bartel-fe94823ceeea.herokuapp.com/api/rate-limit/status

# Response:
# {
#   "tier": "free",
#   "limit": 3,
#   "remaining": 2,
#   "window": "1 hour"
# }
```

### Verifying Peer Agents

Before communicating with another agent:

```bash
# Check their certificate (public endpoint)
curl https://agentshield-api-bartel-fe94823ceeea.herokuapp.com/api/verify/agent_f58195a85504

# Response:
# {
#   "valid": true,
#   "security_score": 77,
#   "tier": "PROTECTED",
#   "days_remaining": 90
# }
```

### As a Developer

```python
from agentshield import AgentShieldClient

# Initialize client
client = AgentShieldClient()

# Verify an agent
result = client.verify_agent("agent_abc123")
if result['valid'] and result['security_score'] >= 75:
    print("✅ Safe to communicate!")
else:
    print("⚠️ Agent not verified")
```

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Agent A        │────▶│  AgentShield     │◄────│  Agent B        │
│  (Audited)      │     │  Audit Service   │     │  (Verifier)     │
└────────┬────────┘     └────────┬─────────┘     └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Ed25519        │     │  Certificate     │     │  Rate Limit     │
│  Keypair        │     │  Store (SQLite)  │     │  Tracker        │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### Certificate Format (v6.1)

AgentShield uses Ed25519 signatures for agent identity:

```json
{
  "header": {"alg": "Ed25519", "typ": "AGENT-CERT-v1"},
  "payload": {
    "sub": "agent_abc123",
    "iss": "agentshield.live",
    "iat": 1740045600,
    "exp": 1747898400,
    "agent_name": "MyAgent",
    "public_key": "base64_pubkey",
    "score": 77,
    "tier": "PROTECTED"
  },
  "signature": "base64_signature",
  "certificate_hash": "sha256:..."
}
```

---

## 🔌 API Reference (v6.1)

### Health Check
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | API status & version |

### Rate Limiting
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/rate-limit/status` | GET | Check your rate limit status |

### Products
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/token-optimizer` | POST | Analyze token efficiency |
| `/api/code-scan` | POST | Security scan code |
| `/api/audit` | POST | Legacy audit endpoint |

### Agent Audit (New in v6.1)
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/agent-audit/initiate` | POST | Rate Limit | Start new audit |
| `/api/agent-audit/challenge` | POST | Challenge | Complete auth |
| `/api/agent-audit/complete` | POST | Authenticated | Get certificate |
| `/api/verify/:agent_id` | GET | Public | Verify any agent |

See [docs/API.md](docs/API.md) for complete documentation.

---

## 🛡️ Security Tests

Each audit runs these automated tests:

1. **Secret Leakage** ✅ **REAL** - 15+ patterns (API keys, tokens, private keys)
2. **System Prompt Extraction** ⚠️ Mock - Tests resistance to prompt leaking
3. **Instruction Override** ⚠️ Mock - Tests jailbreak resistance
4. **Tool Permission Check** ⚠️ Mock - Validates tool access controls
5. **Memory Isolation** ⚠️ Mock - Ensures session data isolation

---

## 🌐 Live Demo

Visit [agentshield.live](https://agentshield.live) for:
- Interactive token optimizer with PDF reports
- Code security scanner
- **NEW:** Certificate verification UI
- Complete API documentation

---

## 📋 Changelog

### v6.1 (2026-02-23)
- ✅ Rate limiting: 3 free/hour → 1/hour
- ✅ Certificate Store with SQLite/PostgreSQL
- ✅ Public verification endpoint
- ✅ Rate limit headers in all responses
- ✅ Updated Secret Leakage scanner (15+ patterns)

### v6.0 (2026-02-20)
- ✅ Ed25519 challenge-response authentication
- ✅ Agent audit with auto-detection
- ✅ Cryptographic certificates
- ✅ Three-tier security system

---

## 🤝 Contributing

We welcome contributions! See [docs/contributing.md](docs/contributing.md) for guidelines.

## 📝 License

MIT License - see [LICENSE](LICENSE) file.

## 🔗 Links

- **Website**: https://agentshield.live
- **API Docs**: https://agentshield.live/docs.html
- **Certificate Verification**: https://agentshield.live/verify.html
- **Issues**: https://github.com/bartel/agentshield/issues
- **Discussions**: https://github.com/bartel/agentshield/discussions

## 🙏 Acknowledgments

Built with:
- [Flask](https://flask.palletsprojects.com/) - Web framework
- [Cryptography](https://cryptography.io/) - Ed25519 implementation
- [ReportLab](https://www.reportlab.com/) - PDF generation
- [SQLite](https://sqlite.org/) - Certificate storage

---

**Made with 🐔 by Bartel & Kalle**  
*Securing the $50B autonomous agent revolution*

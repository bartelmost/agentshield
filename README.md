# AgentShield - Privacy-First Security for AI Agents

**Version:** 1.4.1  
**Status:** Production Ready  
**Architecture:** Privacy-First (Local Testing Only)

---

## 🔒 Privacy Guarantee

**Your system prompts NEVER leave your device.**

AgentShield Security Assessment runs all 77 tests locally. Only test scores (not prompts) are transmitted to our server for certificate generation.

📄 **[Read Full Privacy Architecture →](PRIVACY_ARCHITECTURE_v1.4.1.md)**

---

## Quick Start

### 1. Install (OpenClaw)

```bash
clawhub install agentshield-audit
```

### 2. Run Security Audit

```bash
openclaw run agentshield-audit --audit
```

**What happens:**
1. 77 security tests run on YOUR machine (local)
2. Only scores submitted to server (e.g., "Prompt Injection: 18/18 passed")
3. Ed25519 certificate issued (90-day validity)
4. Published in public trust registry

### 3. Verify Another Agent

```bash
openclaw run agentshield-audit --verify agent_xyz
```

### 4. Trust Handshake (NEW in v1.4!)

```bash
openclaw run agentshield-audit --handshake agent_b
```

---

## 🛡️ Security Test Categories

**All tests run locally - your prompts never leave your device:**

- **Prompt Injection** (18 tests) - System override, role manipulation
- **Data Exfiltration** (12 tests) - Credential leaking, API key exposure
- **Privilege Escalation** (15 tests) - Permission bypasses, sandboxing escapes
- **Denial of Service** (10 tests) - Token flooding, infinite loops
- **Social Engineering** (12 tests) - Persona manipulation, trust exploitation
- **Code Injection** (10 tests) - Command injection, SQL injection

**Total: 77 adversarial tests**

---

## 🎯 What Makes AgentShield Different?

### Traditional Security Audits (Centralized)
```
[Your Agent + Prompts] → Auditor's Server → Analysis → Report
```
**Problems:**
- 🔴 Data exfiltration risk
- 🔴 GDPR compliance issues
- 🔴 Intellectual property exposure

### AgentShield (Privacy-First)
```
[Your Agent] → Local Tests → Scores Only → AgentShield → Certificate
```
**Benefits:**
- 🟢 Zero data exfiltration (prompts stay local)
- 🟢 GDPR compliant (no personal data transmitted)
- 🟢 IP protection (your code never leaves)

---

## 📊 Tool Comparison

AgentShield has **3 separate tools** with **different privacy models**:

| Tool | Data to Server? | Purpose |
|------|----------------|---------|
| **Security Assessment** | ❌ Scores only | Production security (Privacy-First) |
| **Token Optimizer** | ✅ Full prompts | Marketing demo (cost analysis) |
| **Code Scan** | ✅ Full code | Marketing demo (pattern matching) |

**⚠️ IMPORTANT:** The OpenClaw skill (`agentshield-audit`) is **ONLY** the Security Assessment tool (Privacy-First).

Token Optimizer and Code Scan are web-only marketing tools, NOT part of the ClawHub skill.

---

## 🔐 Data Privacy

### Security Assessment (ClawHub Skill)

**Sent to Server:**
- ✅ Agent name + platform
- ✅ Ed25519 public key
- ✅ Test scores (passed/failed per category)
- ✅ Cryptographic signatures

**Stays Local:**
- ✅ Your system prompts
- ✅ Agent source code
- ✅ All 77 test payloads
- ✅ Vulnerability details
- ✅ Private keys

**Full details:** [PRIVACY_ARCHITECTURE_v1.4.1.md](PRIVACY_ARCHITECTURE_v1.4.1.md)

---

## 🚀 New in v1.4

### Trust Handshake Protocol

Agent-to-agent mutual verification with cryptographic proof:

```bash
# Quick peer verification
openclaw run agentshield-audit --verify-peer agent_b --min-score 70

# Full mutual handshake
openclaw run agentshield-audit --handshake agent_b
```

**Benefits:**
- Cryptographically secure trust establishment
- Reputation building (success rate tracking)
- Foundation for encrypted agent communication
- Public audit trail (handshake history)

---

## 📖 Documentation

- **Privacy Architecture:** [PRIVACY_ARCHITECTURE_v1.4.1.md](PRIVACY_ARCHITECTURE_v1.4.1.md)
- **ClawHub Review Response:** [OPENCLAW_REVIEW_RESPONSE_v1.4.1.md](OPENCLAW_REVIEW_RESPONSE_v1.4.1.md)
- **API Documentation:** https://agentshield.live/api
- **Web Frontend:** https://agentshield.live
- **Full Docs:** https://agentshield.live/docs.html

---

## 🏆 Trust Tiers

Your agent's trust tier based on security score + verification count:

- **🔴 UNVERIFIED** (0-49) - Failed basic security tests
- **🟡 BASIC** (50-69) - Passed basic tests, needs improvement
- **🟢 VERIFIED** (70-89) - Strong security posture
- **🔵 TRUSTED** (90-100) - Excellent security + proven track record

---

## 📞 Contact

- **Support:** support@agentshield.live
- **Security Issues:** security@agentshield.live
- **Admin:** admin@agentshield.live

---

## 🛠️ Technical Stack

- **Client:** Python 3.8+ (local test execution)
- **Cryptography:** Ed25519 signatures (industry standard)
- **Backend:** Python/Flask + PostgreSQL
- **Hosting:** Heroku (production), Netlify (frontend)
- **Open Source:** Client code fully open (audit the auditor!)

---

## 🗺️ Roadmap

**v1.5 (April 2026) - Transparency**
- OpenAPI specification
- Public test suite
- Reproducible builds

**v2.0 (Q2 2026) - Hybrid Verification**
- Server-side spot checks (10% random re-testing)
- Blockchain audit trail
- P2P handshake (no server middleman)

**v3.0 (Q3 2026) - Enterprise**
- SOC2 Type II certification
- Penetration testing reports
- Multi-agent fleet management

---

## 📜 License

MIT License - Free for personal and commercial use.

---

## 🙏 Acknowledgments

- **OpenClaw Community** - For building the agent ecosystem
- **ClawHub Security Team** - For thorough review process
- **Let's Encrypt** - Inspiration for free, automated certificates

---

## ⚠️ Security Notice

Found a security issue? Please report to **security@agentshield.live** (not public GitHub issues).

We follow responsible disclosure and will credit security researchers in our Hall of Fame.

---

**Built with ❤️ for the AI Agent Revolution**

*"Let's Encrypt for Agents"*

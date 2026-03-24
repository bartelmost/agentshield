# AgentShield - Trust Infrastructure for AI Agents

[![Version](https://img.shields.io/badge/version-1.0.23-blue.svg)](https://github.com/bartelmost/agentshield/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![ClawHub](https://img.shields.io/badge/clawhub-install-orange.svg)](https://clawhub.com/skills/agentshield-audit)

**Like SSL/TLS, but for AI agents.** 🔐

AgentShield provides cryptographic identity, security audits (77 tests), and Trust Handshake Protocol for agent-to-agent communication.

---

## 🎯 What Is AgentShield?

**The Problem:** Agents need to communicate with other agents, but how do you verify trust?

**The Solution:** AgentShield provides:
- **🔐 Cryptographic Identity** - Ed25519 key pairs
- **✅ Security Audits** - 77 real attack tests (52 live + 25 static)
- **🤝 Trust Handshake Protocol** - Mutual verification before communication
- **📋 Public Trust Registry** - Reputation scores & track records

---

## 🚀 Quick Start

### Installation

```bash
clawhub install agentshield-audit
cd ~/.openclaw/workspace/skills/agentshield*/

# Install Python dependencies
pip3 install -r requirements.txt
```

### Get Your Security Certificate

```bash
# Auto-detect agent info from IDENTITY.md/SOUL.md
python3 initiate_audit.py --auto

# Or specify manually
python3 initiate_audit.py --name "MyAgent" --platform telegram

# Non-interactive mode (CI/CD)
python3 initiate_audit.py --auto --yes
```

**Output:**
- ✅ Agent ID: `agent_xxxxx`
- ✅ Security Score: XX/100
- ✅ Trust Tier: BASIC/VERIFIED/TRUSTED
- ✅ 90-day certificate

### Verify Another Agent

```bash
python3 verify_peer.py agent_yyyyy
```

### Trust Handshake (Agent-to-Agent)

```bash
# Initiate handshake with another certified agent
python3 handshake.py --target agent_yyyyy

# Complete the handshake
python3 complete_handshake.py --handshake-id hs_xxxxx
```

**Result:** Shared session key for encrypted communication 🔐

---

## 📊 Security Audit (77 Tests)

### 52 Live Attack Vectors
- **Prompt Injection** (15 variants)
- **Encoding Exploits** (Base64, ROT13, Hex, Unicode)
- **Multi-Language Attacks** (Chinese, Russian, Arabic, Japanese, German, Korean)
- **Social Engineering** (emotional appeals, authority pressure, flattery)
- **System Prompt Extraction** attempts

### 25 Static Security Checks
- Input Sanitization
- Output DLP (Data Leak Prevention)
- Tool Sandboxing
- Secret Scanning
- Supply Chain Security

**Example Score:** 85/100 = VERIFIED tier ✅

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│  AgentShield Trust Infrastructure               │
├─────────────────────────────────────────────────┤
│                                                  │
│  1. Cryptographic Identity (Ed25519)            │
│     ├─ Private Key (local, never transmitted)   │
│     └─ Public Key Certificate (signed)          │
│                                                  │
│  2. Security Audit Engine                       │
│     ├─ 52 Live Attack Vectors                   │
│     ├─ 25 Static Checks                         │
│     └─ Score: 0-100 → Tier: BASIC-TRUSTED       │
│                                                  │
│  3. Trust Handshake Protocol                    │
│     ├─ Challenge-Response (Ed25519 signatures)  │
│     ├─ Mutual Verification                      │
│     └─ Shared Session Key                       │
│                                                  │
│  4. Public Trust Registry                       │
│     ├─ Agent Directory (searchable)             │
│     ├─ Reputation Scores                        │
│     └─ Revocation List (CRL)                    │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 📂 Repository Structure

```
agentshield/
├── skill/               # OpenClaw Skill (ClawHub Package)
│   ├── *.py            # Core audit scripts
│   ├── SKILL.md        # Skill documentation
│   ├── CHANGELOG.md    # Version history
│   └── requirements.txt
├── docs/               # Additional documentation
│   ├── API.md          # Backend API docs
│   └── contributing.md
└── README.md           # This file
```

---

## 🔒 Privacy & Security

**What We Read:**
- `IDENTITY.md`, `SOUL.md` (with consent, only in `--auto` mode)

**What We Send:**
- Agent name, platform, public key, security test scores

**What We DON'T Send:**
- Private keys (always stay local)
- System prompts, chat history, workspace files
- Any secrets or credentials

**API Endpoint:** `https://agentshield.live/api` (TLS 1.2+)

👉 **Full Privacy Policy:** See [`skill/PRIVACY.md`](skill/PRIVACY.md)

---

## 📈 Use Cases

### 1. Agent-to-Agent API Calls
**Before:** Agent A calls Agent B → No verification ❌  
**After:** Trust Handshake → Verified identity + encrypted session ✅

### 2. Multi-Agent Workflows
**Before:** Agents delegate tasks blindly → Risk of compromised agents ❌  
**After:** Check trust score first → Only work with VERIFIED+ agents ✅

### 3. Agent Marketplaces
**Before:** No way to verify agent security ❌  
**After:** Public trust registry → Users see security scores ✅

---

## 🛠️ Development

### Prerequisites
- Python 3.8+
- `cryptography` library (Ed25519 support)
- `requests` library

### Install Dev Dependencies
```bash
pip install -r requirements.txt
```

### Run Tests
```bash
python3 test_real_live.py
```

---

## 📝 Changelog

See [`CHANGELOG.md`](CHANGELOG.md) for version history.

**Latest:** v1.0.23 (2026-03-24)
- Fixed API URL bug in Trust Handshake
- Added `--yes` flag for non-interactive mode
- Improved dependencies documentation

---

## 🤝 Contributing

We welcome contributions! See [`docs/contributing.md`](docs/contributing.md) for guidelines.

**Quick Start:**
1. Fork this repo
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open Pull Request

---

## 📧 Contact

- **GitHub Issues:** [https://github.com/bartelmost/agentshield/issues](https://github.com/bartelmost/agentshield/issues)
- **Email:** ratgeberpro@gmail.com
- **Moltbook:** @Kalle-OC
- **Website:** [https://agentshield.live](https://agentshield.live)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- Thanks to the OpenClaw community for feedback and testing
- Special thanks to My1stBot for v1.0.23 bug reports
- Built with ❤️ for the agent economy

---

**Made with 🐔 by Kalle-OC (bartelmost)**

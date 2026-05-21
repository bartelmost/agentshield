# AgentShield - Trust Infrastructure for AI Agents

[![Version](https://img.shields.io/badge/version-1.0.33-blue.svg)](https://github.com/bartelmost/agentshield/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![ClawHub](https://img.shields.io/badge/clawhub-install-orange.svg)](https://clawhub.ai/skills/agentshield-audit)

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
cd ~/.openclaw/workspace/skills/agentshield-audit/

# Install Python dependencies
pip3 install -r requirements.txt
```

### Get Your Security Certificate

```bash
# Auto-detect agent info (OpenClaw, n8n auto-detected)
python3 initiate_audit.py --auto

# Try before you submit (recommended first step)
python3 initiate_audit.py --auto --dry-run

# Or specify manually
python3 initiate_audit.py --name "MyAgent" --platform telegram

# With system prompt for deeper local analysis (stays 100% local)
python3 initiate_audit.py --name "MyAgent" --system-prompt "You are..."

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

## 🌐 Platform Support

AgentShield works with **any AI agent platform**:

| Platform | Auto-Detection | Notes |
|----------|---------------|-------|
| **OpenClaw** | ✅ Auto (IDENTITY.md) | Native support |
| **n8n** | ✅ Auto (~/.n8n/) | Detects instanceName |
| **LangChain** | Manual | `--name` + `--platform langchain` |
| **Discord/Telegram bots** | Manual | `--name` + `--platform discord` |
| **Any Python agent** | Manual | `--name "MyBot"` |

See [`skill/PLATFORMS.md`](skill/PLATFORMS.md) for detailed guides per platform.

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
│   ├── PLATFORMS.md    # Platform-specific guides
│   └── requirements.txt
├── docs/               # Additional documentation
│   ├── API.md          # Backend API docs
│   └── contributing.md
└── README.md           # This file
```

---

## 🔒 Privacy & Security

**What We Read:**
- `IDENTITY.md`, `SOUL.md` (with explicit consent prompt, only in `--auto` mode)

**What We Send:**
- Agent name, platform, public key, security test scores (pass/fail only)

**What We DON'T Send:**
- Private keys (always stay local)
- System prompts, attack payloads, agent responses
- Chat history, workspace files, secrets or credentials

**Dry-Run Mode:** `--dry-run` shows the exact API payload before any submission — verify what gets sent before it happens.

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

---

## 📝 Changelog

See [`skill/CHANGELOG.md`](skill/CHANGELOG.md) for full version history.

**Latest:** v1.0.33 (2026-05-21) — Multi-Platform Support
- n8n auto-detection (`~/.n8n/` directory, instanceName)
- New `--system-prompt` flag for deeper local analysis
- New `PLATFORMS.md` guide for OpenClaw, n8n, LangChain, and more

**Previous highlights:**
- v1.0.32 (2026-04-01) — Critical production sanitization fix
- v1.0.31 (2026-04-01) — Dry-run mode, explicit whitelist sanitization
- v1.0.30 (2026-04-01) — Consent flow consistency
- v1.0.23 (2026-03-24) — Trust Handshake API URL fix

---

## 🤝 Contributing

We welcome contributions! See [`docs/contributing.md`](docs/contributing.md) for guidelines.

---

## 📧 Contact

- **GitHub Issues:** [https://github.com/bartelmost/agentshield/issues](https://github.com/bartelmost/agentshield/issues)
- **Email:** ratgeberpro@gmail.com
- **Website:** [https://agentshield.live](https://agentshield.live)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Made with 🐔 by Kalle-OC (bartelmost)**

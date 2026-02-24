# AgentShield Audit - ClawHub Skill

🔒 **Audit your AI agent's security and obtain verifiable trust certificates for inter-agent communication.**

![AgentShield](https://img.shields.io/badge/AgentShield-Security%20Audit-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.8+-blue)

---

## What is AgentShield?

AgentShield is a **security audit framework** for AI agents. It tests your agent against common attack vectors, generates cryptographic identity certificates, and enables secure inter-agent communication through verifiable trust chains.

**Think of it as:** Let's Encrypt for AI Agents 🛡️

---

## 🚀 Quick Start

### Installation

```bash
clawhub install agentshield-audit
```

### Run Your First Audit

```bash
cd ~/.openclaw/workspace/skills/agentshield-audit
python scripts/initiate_audit.py --auto
```

That's it! Your agent will be audited in ~30 seconds and receive a signed certificate.

---

## ✨ Features

- ✅ **Zero-config auto-detection** - Automatically detects agent name and platform
- ✅ **Cryptographic identity** - Ed25519 keypair generation with local private key storage
- ✅ **Security audit** - Tests against 5+ common attack vectors
- ✅ **Verifiable certificates** - 90-day validity, signed by AgentShield CA
- ✅ **Peer verification** - Verify other agents' certificates before trusting them
- ✅ **No API key required** - Free for basic usage (1 audit/hour rate limit)
- ✅ **Privacy-first** - Private keys NEVER leave your workspace

---

## 🧪 What Gets Tested?

Your agent is tested against these attack vectors:

| Test | Description | Risk Level |
|------|-------------|------------|
| **System Prompt Extraction** | Attempts to extract the agent's system prompt | High |
| **Instruction Override** | Tries to override safety instructions | Critical |
| **Tool Permission Check** | Verifies proper tool access controls | High |
| **Memory Isolation** | Tests for context leakage between sessions | Medium |
| **Secret Leakage** | Scans for exposed API keys, tokens, passwords | Critical |

**Your Security Score:** 0-100 based on passed tests

---

## 📦 Bundle Contents

```
agentshield-audit/
├── clawhub.json              # ClawHub manifest
├── SKILL.md                  # Skill documentation
├── README.md                 # This file
├── QUICKSTART.md             # Step-by-step tutorial
├── sandbox_config.yaml       # Tool sandbox configuration
│
├── scripts/
│   ├── requirements.txt      # Python dependencies
│   ├── initiate_audit.py     # Start a new audit
│   ├── verify_peer.py        # Verify another agent
│   ├── show_certificate.py   # Display your certificate
│   └── audit_client.py       # Low-level API client
│
├── src/
│   └── agentshield_security/ # Security testing modules
│       ├── __init__.py
│       ├── input_sanitizer.py
│       ├── output_dlp.py
│       ├── tool_sandbox.py
│       ├── echoleak_test.py
│       ├── secret_scanner.py
│       └── supply_chain_scanner.py
│
├── references/
│   └── api.md                # API documentation
│
└── tests/
    ├── test_security_modules.py
    ├── test_input_sanitizer.py
    └── test_quick.py
```

---

## 🔐 Privacy & Security

### What Gets Stored Locally?

All sensitive data stays in `~/.openclaw/workspace/.agentshield/`:

```
.agentshield/
├── agent.key          # Your Ed25519 private key (NEVER shared)
├── certificate.json   # Your signed certificate (shareable)
└── config.json        # Agent configuration
```

**File Permissions:** Private key is stored with `600` (owner read/write only)

### What Gets Sent to AgentShield API?

1. **Public key** (Ed25519, generated from your private key)
2. **Agent name** (auto-detected or user-specified)
3. **Platform** (discord, telegram, etc.)
4. **Audit results** (test scores, no sensitive data)

**What is NEVER sent:**
- ❌ Private keys
- ❌ API tokens
- ❌ System prompts
- ❌ Conversation history
- ❌ User data

### Rate Limiting

- **Free tier:** 1 audit per hour per IP
- **No registration required**
- **No payment needed for basic usage**
- Enterprise/high-volume: Contact us

---

## 🎯 Usage Examples

### 1. Auto-detected Audit (Recommended)

```bash
python scripts/initiate_audit.py --auto
```

The script will:
- Auto-detect your agent name from `IDENTITY.md`, `SOUL.md`
- Auto-detect platform from environment variables
- Generate Ed25519 keypair if none exists
- Run the security audit
- Save your certificate

### 2. Manual Audit (Specify Name & Platform)

```bash
python scripts/initiate_audit.py --name "MyAgent" --platform telegram
```

### 3. Verify Another Agent

```bash
python scripts/verify_peer.py --agent-id "agent_abc123xyz"
```

Returns:
- ✅ Certificate validity
- ✅ Expiration date
- ✅ Security score
- ✅ Public key fingerprint

### 4. Show Your Certificate

```bash
python scripts/show_certificate.py
```

Displays:
- Agent ID
- Validity period
- Security score
- Verification URL

---

## 📚 Documentation

- **[SKILL.md](SKILL.md)** - Complete skill reference
- **[QUICKSTART.md](QUICKSTART.md)** - Step-by-step tutorial for first-time users
- **[references/api.md](references/api.md)** - API technical documentation
- **[GitHub](https://github.com/bartelmost/agentshield)** - Source code & issues

---

## 🛠️ Installation Requirements

- **Python:** 3.8 or higher
- **Dependencies:**
  - `cryptography>=41.0.0` (Ed25519 key generation)
  - `requests>=2.31.0` (API communication)

Dependencies are automatically installed via:

```bash
pip install -r scripts/requirements.txt
```

Or using the ClawHub shortcut:

```bash
clawhub run agentshield-audit install
```

---

## 🔧 Troubleshooting

### "No certificate found"
**Solution:** Run `python scripts/initiate_audit.py --auto` to generate one

### "Challenge failed"
**Solution:** Check your system clock. AgentShield uses time-based challenge-response authentication (NTP sync required)

### "API unreachable"
**Solution:** Verify internet connection. The API endpoint is `https://agentshield-api-bartel-fe94823ceeea.herokuapp.com`

### "Rate limited"
**Solution:** Free tier allows 1 audit per hour. Wait 60 minutes between audits.

### "Auto-detection failed"
**Solution:** Use manual mode:
```bash
python scripts/initiate_audit.py --name "YourAgentName" --platform discord
```

---

## 🧑‍💻 Development

### Run Tests

```bash
cd ~/.openclaw/workspace/skills/agentshield-audit
python -m pytest tests/
```

### Run Security Module Tests

```bash
python tests/test_security_modules.py
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a feature branch
3. Submit a pull request

**GitHub:** https://github.com/bartelmost/agentshield

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

## 💬 Support

- **Issues:** https://github.com/bartelmost/agentshield/issues
- **Contact:** @Kalle-OC on Moltbook
- **Documentation:** https://github.com/bartelmost/agentshield

---

## 🌟 Why AgentShield?

As AI agents become more autonomous and interconnected, **trust becomes the bottleneck**. AgentShield solves this by:

1. **Standardizing security audits** - Consistent testing across all agents
2. **Enabling verifiable trust** - Cryptographic certificates anyone can verify
3. **Preventing attack vectors** - Proactive defense against known threats
4. **Building a trust network** - Agents can verify each other before collaboration

**Secure yourself. Verify others. Trust nothing by default.** 🛡️

---

**Made with 🔐 by the AgentShield team**

# AgentShield OpenClaw Skill

**Privacy-First Security Assessment for AI Agents**

This directory contains the OpenClaw skill for AgentShield Security Assessment.

---

## 🔒 Privacy Guarantee

**All 77 security tests run locally on your machine.**  
**Your system prompts NEVER leave your device.**

Only test scores (not prompts or code) are transmitted to our API for certificate generation.

📄 **[Full Privacy Architecture](../PRIVACY_ARCHITECTURE_v1.4.1.md)**

---

## Installation

### Via ClawHub (Recommended)

```bash
clawhub install agentshield-audit
```

### Manual Installation

```bash
git clone https://github.com/bartelmost/agentshield.git
cd agentshield/skill
pip install -r requirements.txt
```

---

## Files

- **SKILL.md** - Full skill documentation
- **src/** - Client implementation (local testing)
  - `audit_client.py` - Security audit client
  - `handshake.py` - Trust handshake protocol
  - `registry.py` - Agent registry client
- **example_handshake.py** - Example usage
- **INSTALLATION.md** - Installation guide
- **requirements.txt** - Python dependencies

---

## Usage

See [SKILL.md](SKILL.md) for complete documentation.

**Quick Start:**

```bash
# Run security audit
openclaw run agentshield-audit --audit

# Verify another agent
openclaw run agentshield-audit --verify agent_xyz

# Trust handshake
openclaw run agentshield-audit --handshake agent_b
```

---

## Transparency

**This code is open-source to demonstrate our privacy-first approach:**

1. **Inspect the code** - See exactly what data is transmitted
2. **Verify locally** - All tests run on your machine
3. **Audit the auditor** - Review our implementation

**No hidden data collection. No prompt exfiltration. Just security.**

---

## Support

- **Email:** support@agentshield.live
- **Security Issues:** security@agentshield.live
- **Documentation:** https://agentshield.live/docs.html

---

## License

MIT License - Free for personal and commercial use.

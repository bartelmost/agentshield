---
name: agentshield-audit
description: Initiate and manage AgentShield security audits for AI agents. Use when a user wants to audit their agent's security posture, generate cryptographic identity keys, obtain security certificates, or verify other agents' trustworthiness. Safe to install - all scripts are bundled locally, no external code fetching.
triggers: ["audit my agent", "get security certificate", "verify agent", "activate AgentShield", "security audit"]
---

# AgentShield Audit Skill

**Audit your agent's security and obtain verifiable trust certificates for inter-agent communication.**

✅ **Verified Bundle Status:** All scripts bundled locally - no external code fetching  
✅ **Human-in-the-Loop:** Explicit user approval required before reading sensitive files  
✅ **Privacy-First:** No environment variable scanning, private keys never leave your workspace  
⚠️ **Development Status:** Using DEV API endpoint (production migration planned)

---

## 🛡️ Security Architecture

This skill operates with **three layers of protection**:

### 1. Complete Local Bundle
- **0 external code downloads** during runtime
- All Python scripts are bundled in this skill package
- No `curl | bash` or runtime fetching from GitHub
- Immutable - what you install is what runs

### 2. Human-in-the-Loop Consent
Before accessing ANY sensitive files, the skill **explicitly asks for user approval**:

| Action | User Consent Required |
|--------|----------------------|
| Read `IDENTITY.md` | ✅ Yes - explicit approval |
| Read `SOUL.md` | ✅ Yes - explicit approval |
| Read `AGENTS.md` | ✅ Yes - explicit approval |
| Read system prompts | ✅ Yes - explicit approval |
| Generate keys | ✅ Yes - explicit approval |
| Send public key to API | ✅ Yes - explicit approval |

**No silent file access. No background scanning.**

### 3. Minimal Data Transmission
Data sent to AgentShield API:
- ✅ Public key (Ed25519)
- ✅ Agent name (user-provided or auto-detected with consent)
- ✅ Platform (discord, telegram, etc.)
- ✅ Audit results (test scores only)

Data **NEVER** sent:
- ❌ Private keys
- ❌ System prompts
- ❌ Conversation history
- ❌ API tokens or secrets

---

## 🧪 77 Security Tests Included

This skill includes a **complete security test suite** with 77 real tests:

**Static Security Tests (25):**
- Input Sanitizer (5 tests) - Prompt injection, unicode attacks, encoding
- Output DLP (5 tests) - API keys, passwords, PII detection
- Tool Sandbox (5 tests) - Dangerous commands, network access control
- EchoLeak (3 tests) - System prompt leaks, HTML injection
- Secret Scanner (3 tests) - Hardcoded secrets, OAuth tokens
- Supply Chain (4 tests) - Suspicious imports, RCE detection

**Live Attack Vectors (52):**
- Direct Override (7) - Jailbreak attempts, developer mode, admin override
- Role Hijacking (7) - Impersonation, fake support, authority escalation
- Encoding Tricks (7) - Base64, ROT13, Hex, Unicode homoglyphs
- Multi-Language (7) - Chinese, Russian, Arabic, Japanese, Korean, German, Spanish
- Context Manipulation (8) - Hypothetical scenarios, dream sequences, story mode
- Social Engineering (7) - Emotional appeals, flattery, guilt manipulation
- Prompt Leaks (9) - Direct prompt requests, configuration dumps, meta-extraction

**Run Tests Standalone:**
```bash
python agentshield_tester.py --config agent_config.json --prompt system_prompt.txt
```

See `TESTING.md` for complete documentation.

---

## One-Line Quick Start

```bash
clawhub install agentshield-audit && python initiate_audit.py --auto
```

That's it. Your agent will be audited in ~30 seconds.

---

## The Complete Workflow

```
Step 1: INSTALL
  clawhub install agentshield-audit
         |
         v
Step 2: LAUNCH (no code fetched)
  python initiate_audit.py --auto
  (All scripts are bundled locally)
         |
         v
Step 3: USER CONSENT (Human-in-the-Loop)
  "This audit requires reading IDENTITY.md and SOUL.md
   to detect your agent name. Allow? [y/N]"
  User must explicitly approve to proceed
         |
         v
Step 4: AUTO-DETECT (with consent only)
  Skill reads approved files to detect agent info
  User can override with --name and --platform
         |
         v
Step 5: GENERATE KEYS (user confirmed)
  Ed25519 keypair created locally
  Stored in: ~/.agentshield/agent.key
  Private keys NEVER leave your workspace
         |
         v
Step 6: RUN AUDIT (~30 seconds)
  - System Prompt Extraction Test
  - Instruction Override Test
  - Tool Permission Check
  - Memory Isolation Test
  - Secret Leakage Detection
         |
         v
Step 7: RECEIVE CERTIFICATE
  90 days validity
  Verifiable by anyone at: /api/verify/{agent_id}
```

---

## Human-in-the-Loop: Detailed Consent Flow

### When you run `python initiate_audit.py --auto`:

```
┌─────────────────────────────────────────────────┐
│  AgentShield Security Audit - Consent Required  │
├─────────────────────────────────────────────────┤
│                                                 │
│  Before proceeding, I need to:                  │
│                                                 │
│  1. Read these files (to detect agent name):    │
│     • IDENTITY.md                               │
│     • SOUL.md                                   │
│                                                 │
│  2. Generate a cryptographic keypair            │
│     (stored locally in ~/.agentshield/)         │
│                                                 │
│  3. Send public key to AgentShield API          │
│                                                 │
│  Private keys NEVER leave this workspace.       │
│                                                 │
│  Proceed? [y/N]: _                              │
│                                                 │
└─────────────────────────────────────────────────┘
```

**User must explicitly type 'y' or 'yes' to continue.**

### Alternative: Skip File Reading Entirely

```bash
# Provide info manually - no file access needed
python initiate_audit.py --name "MyAgent" --platform telegram
```

---

## When to Use

- User wants to audit their agent's security
- User wants a trust certificate for their agent
- User wants to verify another agent's certificate
- Setting up inter-agent secure communication
- Before installing untrusted skills

---

## Installation Methods

### Method A: One-Line (Recommended)

```bash
clawhub install agentshield-audit && python initiate_audit.py --auto
```

### Method B: Step by Step

```bash
# Install the skill (all scripts bundled locally)
clawhub install agentshield-audit

# Navigate to skill directory
cd ~/.openclaw/workspace/skills/agentshield-audit

# Run with user confirmation (Human-in-the-Loop)
python initiate_audit.py --auto
```

### Method C: Manual Specification (No File Reading)

```bash
# Skip auto-detection entirely - user provides info manually
python initiate_audit.py --name "MyAgent" --platform telegram
```

---

## Security Score (0-100)

| Score | Tier | Description |
|-------|------|-------------|
| 90-100 | HARDENED | Passed all critical tests. Top-tier security. |
| 75-89 | PROTECTED | Passed most tests. Minor issues found. |
| 50-74 | BASIC | Minimum requirements met. Room for improvement. |
| <50 | VULNERABLE | Failed critical tests. Immediate action recommended. |

---

## Security Model

- **Complete Local Bundle** - Zero external code fetching
- **User Consent Required** - Explicit approval before reading sensitive files
- **Private keys never leave** the agent's workspace
- **Challenge-response authentication** - Prevents replay attacks
- **Certificates signed by AgentShield** - Verifiable by anyone
- **90-day validity** - Encourages regular re-auditing
- **Rate limiting:** 1 audit per hour per IP (prevents abuse)

---

## Script Reference

All scripts are bundled locally - no external downloads:

| Script | Purpose | Example |
|--------|---------|---------|
| `initiate_audit.py` | Start new audit with consent flow | `python initiate_audit.py --auto` |
| `verify_peer.py` | Verify another agent's certificate | `python verify_peer.py --agent-id "agent_xyz789"` |
| `show_certificate.py` | Display your certificate | `python show_certificate.py` |
| `audit_client.py` | Low-level API client | Import for custom integrations |

---

## Bundle Contents (Complete)

```
agentshield-audit/
├── SKILL.md                  # This file
├── README.md                 # User documentation
├── clawhub.json             # ClawHub manifest
├── requirements.txt         # Python dependencies
│
├── Core Scripts (bundled):
│   ├── initiate_audit.py    # Main audit script with consent flow
│   ├── verify_peer.py       # Peer verification
│   ├── show_certificate.py  # Certificate display
│   └── audit_client.py      # API client
│
├── Security Modules (bundled):
│   ├── input_sanitizer.py   # Input validation
│   ├── output_dlp.py        # Output data loss prevention
│   ├── tool_sandbox.py      # Tool execution sandbox
│   ├── echoleak_test.py     # Echo leakage detection
│   ├── secret_scanner.py    # Secret scanning
│   └── supply_chain_scanner.py  # Supply chain security
│
└── sandbox_config.yaml      # Sandbox configuration
```

---

## Demo Mode / Free Usage

**First 3 audits are completely free.** No registration, no API key.

After that:
- Rate limit: 1 audit per hour per IP
- No payment required for basic usage
- Enterprise/high-volume: Contact us

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No certificate found" | Run `initiate_audit.py` first |
| "Challenge failed" | Check system clock (NTP sync required) |
| "API unreachable" | Verify internet connection |
| "Rate limited" | Wait 1 hour between audits |
| "User declined" | The user chose not to proceed with the audit |
| Auto-detection failed | Use `--name` and `--platform` manually |

---

## Developer Information

**Version:** 1.0.0  
**License:** MIT  
**Author:** Kalle-OC (@bartelmost)  
**GitHub:** https://github.com/bartelmost/agentshield

**Bundle Status:** ✅ Verified - All scripts bundled locally  
**Current API:** agentshield.live/api  
**Future:** Migration to enterprise-grade hosting planned

---

## Questions?

Open an issue on GitHub or ping @Kalle-OC on Moltbook.

**Secure yourself. Verify others. Trust nothing by default.**
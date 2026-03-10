# AgentShield Security Audit - OpenClaw Skill v1.4.1

**Privacy-First Trust Infrastructure for AI Agents**

---

## 🔒 Privacy Architecture

**AgentShield is designed with privacy as the foundation:**

✅ **All security tests run locally** on your machine  
✅ **Only test scores + signatures** are transmitted to our server  
✅ **Your system prompts NEVER leave your device**  
✅ **No code analysis on our servers** - results only  
✅ **End-to-end cryptographic verification** (Ed25519 signatures)

**What goes to the server:**
- Your agent name + platform
- Ed25519 public key (for certificate signing)
- Test result scores (passed/failed per category)
- Cryptographic signatures (for verification)

**What stays local:**
- System prompts
- Agent code
- Configuration files
- Prompt injection test attempts
- Detailed vulnerability reports

---

## Description

AgentShield provides cryptographic security audits and trust verification for AI agents.

**NEW in v1.4:** Trust Handshake Protocol for agent-to-agent mutual verification.

**Features:**
- 77 local security tests (adversarial attacks)
- Ed25519 certificates (90-day validity)
- Trust handshake protocol (mutual verification)
- Public trust registry
- Certificate revocation list (CRL)

**Use Cases:**
- Verify agent security before deployment
- Establish trust between agents
- Build agent reputation over time
- Discover trusted agents in the registry
- Revoke compromised certificates

---

## Quick Start

### 1. Security Audit (One-Time Setup)

```bash
# Initialize audit (generates Ed25519 keypair locally)
openclaw run agentshield-audit --agent-id your_agent_id

# The audit process:
# 1. Generate Ed25519 keypair (locally)
# 2. Run 77 security tests (locally - prompts never leave your device)
# 3. Sign challenge with your private key
# 4. Submit scores + signature to server
# 5. Receive certificate (90-day validity)
```

**Privacy guarantee:** Your system prompt stays on your machine. Only the test results (passed/failed scores) are submitted.

**Result:** Certificate valid for 90 days, published in public registry.

---

### 2. Verify Another Agent

```bash
openclaw run agentshield-audit --verify agent_xyz
```

**Returns:**
- Security score (0-100)
- Trust tier (UNVERIFIED → BASIC → VERIFIED → TRUSTED)
- Certificate validity
- Revocation status
- Public key for signature verification

---

### 3. Trust Handshake (NEW in v1.4!)

**Agent-to-agent mutual verification with cryptographic proof.**

```bash
# Quick trust check (verify peer's certificate)
openclaw run agentshield-audit --verify-peer agent_b --min-score 70

# Full mutual handshake (both agents verify each other)
openclaw run agentshield-audit --handshake agent_b
```

**What Happens:**
1. Both agents verified (security + trust scores checked)
2. Mutual Ed25519 signature exchange
3. Ephemeral session key generated for encrypted communication
4. Both agents receive +5 trust points
5. Handshake recorded in public history

**Benefits:**
- Cryptographically secure agent-to-agent trust
- Reputation building (success rate tracking)
- Foundation for encrypted agent communication
- Audit trail (all handshakes publicly recorded)

**Privacy:** Only agent IDs, public keys, and signatures are exchanged. No prompts, no code.

---

## Commands

### Audit Commands
- `--audit` - Run full security audit (77 tests, local execution)
- `--verify <agent_id>` - Verify another agent's certificate
- `--status` - Check your certificate status

### Trust Handshake Commands (NEW!)
- `--verify-peer <agent_id>` - Quick trust check
- `--verify-peer <agent_id> --min-score 70` - Verify with threshold
- `--handshake <agent_id>` - Full mutual verification
- `--history` - View your handshake history

### Registry Commands
- `--search <query>` - Search agent registry
- `--list` - List top trusted agents
- `--list --tier VERIFIED` - Filter by trust tier

---

## Security Test Categories (77 Tests)

All tests run **locally** - your prompts never leave your device:

**1. Prompt Injection (18 tests)**
- System override attempts
- Role manipulation
- Instruction hijacking
- Context poisoning

**2. Data Exfiltration (12 tests)**
- Credential leaking
- API key exposure
- Session token leaks
- Memory dumps

**3. Privilege Escalation (15 tests)**
- Permission bypasses
- Sandboxing escapes
- File access violations
- Network restrictions

**4. Denial of Service (10 tests)**
- Token flooding
- Infinite loops
- Memory exhaustion
- Rate limit bypasses

**5. Social Engineering (12 tests)**
- Persona manipulation
- Trust exploitation
- Context confusion
- Fake urgency

**6. Code Injection (10 tests)**
- Command injection
- SQL injection (if applicable)
- XSS attacks
- Script injection

---

## Trust Tiers

Your agent's trust tier is based on security score + verification count:

- **🔴 UNVERIFIED** (0-49): Failed basic security tests
- **🟡 BASIC** (50-69): Passed basic tests, needs improvement
- **🟢 VERIFIED** (70-89): Strong security posture
- **🔵 TRUSTED** (90-100): Excellent security + proven track record

**Trust Score Formula:**
```
Trust Score = Security Score + (Handshake Success Rate × 10)
```

---

## Certificate Lifecycle

**1. Generation (Day 0)**
- Run audit → Receive Ed25519 certificate
- Valid for 90 days
- Published in public registry

**2. Verification (Ongoing)**
- Other agents can verify your certificate
- Successful handshakes increase trust score
- Failed handshakes decrease trust score

**3. Renewal (Day 85+)**
- Re-run audit to renew certificate
- Previous trust score preserved
- New certificate issued

**4. Revocation (If Compromised)**
- Agent owner or security team can revoke
- Published in CRL (Certificate Revocation List)
- Other agents warned automatically

---

## API Endpoints

All endpoints are at `https://agentshield.live/api`

**Audit Flow:**
1. `POST /agent-audit/initiate` - Start audit (submit public key)
2. `POST /agent-audit/challenge` - Prove identity (sign challenge)
3. `POST /agent-audit/complete` - Submit test scores (receive certificate)

**Verification:**
- `GET /verify/:agent_id` - Check certificate validity
- `GET /crl/check/:agent_id` - Check revocation status

**Trust Handshake:**
- `GET /trust-handshake/verify-peer/:agent_id` - Quick trust check
- `POST /trust-handshake/initiate` - Start mutual handshake
- `POST /trust-handshake/complete` - Finalize handshake
- `GET /trust-handshake/history/:agent_id` - View handshake record

**Registry:**
- `GET /registry/agents` - List all verified agents
- `GET /registry/search?q=query` - Search agents
- `GET /registry/agents/:agent_id` - Agent profile

---

## Installation

**Requirements:**
- OpenClaw installed
- Python 3.8+ (for local tests)
- `cryptography` package (Ed25519 support)

**Install via ClawHub:**
```bash
clawhub install agentshield-audit
```

**Manual Installation:**
```bash
git clone https://github.com/bartelmost/agentshield-skill.git
cd agentshield-skill
pip install -r requirements.txt
```

---

## Privacy & Security

**What we collect:**
- Agent name + platform (public)
- Ed25519 public key (for certificates)
- Test result scores (passed/failed per category)
- Cryptographic signatures
- Handshake history (agent IDs only)

**What we DON'T collect:**
- System prompts (stay local)
- Agent source code
- API keys or credentials
- User data or conversations
- Detailed vulnerability descriptions

**Data retention:**
- Certificates: 90 days (renewable)
- Revoked certs: Permanent (CRL)
- Handshake history: Permanent (public trust record)

**Security measures:**
- All API traffic over HTTPS
- Ed25519 signature verification
- Rate limiting (5 audits/hour free tier)
- Input validation + sanitization

---

## Support

- **Documentation:** https://agentshield.live/docs.html
- **API Docs:** https://agentshield.live/api
- **Email:** support@agentshield.live
- **Security Issues:** security@agentshield.live
- **GitHub:** https://github.com/bartelmost/agentshield

---

## License

MIT License - Free for personal and commercial use.

---

## Version History

**v1.4.1** (2026-03-10)
- Clarified privacy architecture
- Emphasized local test execution
- Separated from marketing tools (Token Optimizer, Code Scan)
- Updated contact emails (@agentshield.live)

**v1.4.0** (2026-03-09)
- Trust Handshake Protocol
- Ed25519 signature verification
- Session key generation
- Handshake history tracking

**v1.0.0** (2026-03-01)
- Initial release
- 77 security tests
- Certificate generation
- Public registry

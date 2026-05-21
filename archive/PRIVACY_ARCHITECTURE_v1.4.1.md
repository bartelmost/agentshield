# Privacy Architecture - AgentShield v1.4.1

**Last Updated:** 2026-03-10

---

## Executive Summary

AgentShield operates **three distinct tools** with **different privacy models**:

1. **Token Optimizer** (Marketing Tool) - Analyzes prompts on server
2. **Code Security Scan** (Marketing Tool) - Analyzes code on server  
3. **Agent Security Assessment** (Production Security) - **Privacy-First: Local testing only**

**This document clarifies what data goes where and why.**

---

## Tool Comparison

| Feature | Token Optimizer | Code Scan | Security Assessment |
|---------|----------------|-----------|-------------------|
| **Purpose** | Cost Analysis | Quick Vulnerability Check | Enterprise Security Certification |
| **Target Users** | Developers optimizing costs | Developers checking code | Production AI agents |
| **Data Sent to Server** | Full system prompt | Full code snippet | Scores + signatures only |
| **Local Execution** | ❌ No | ❌ No | ✅ Yes (77 tests) |
| **Privacy-First** | ❌ No | ❌ No | ✅ Yes |
| **Production-Ready** | ❌ No (demo) | ❌ No (demo) | ✅ Yes |

---

## 1. Token Optimizer (Marketing Tool)

### What It Does
Analyzes your system prompt to estimate token savings potential.

### Data Flow
```
[Your Prompt] → AgentShield Server → Token Analysis → PDF Report
```

### What Goes to Server
- ✅ Your system prompt (full text)
- ✅ Token count
- ✅ Language/framework

### What Stays Local
- ❌ Nothing - full analysis on server

### Privacy Considerations
- **Not suitable for production secrets** - This is a marketing demo
- **No retention promise** - Prompts may be logged for debugging
- **Use for public/demo prompts only**

### Use Cases
- ✅ Public demo prompts
- ✅ Cost estimation for new projects
- ✅ Marketing collateral
- ❌ Production system prompts with secrets
- ❌ Proprietary agent logic

---

## 2. Code Security Scan (Marketing Tool)

### What It Does
Pattern-based vulnerability detection for Python, JavaScript, agent code.

### Data Flow
```
[Your Code] → AgentShield Server → Pattern Matching → PDF Report
```

### What Goes to Server
- ✅ Your code snippet (full text)
- ✅ Language (Python/JS)
- ✅ Scan type (quick/full)

### What Stays Local
- ❌ Nothing - analysis on server

### Privacy Considerations
- **Not suitable for proprietary code** - This is a demo tool
- **Pattern matching only** - Not a full security audit
- **No retention guarantees** - Code may be logged

### Use Cases
- ✅ Open-source projects
- ✅ Quick malware check
- ✅ Educational demos
- ❌ Proprietary algorithms
- ❌ Production secrets

---

## 3. Agent Security Assessment (Privacy-First)

### What It Does
Comprehensive security audit with Ed25519 certificates for AI agents.

### Data Flow
```
[Your Agent] → Local Tests (77 attacks) → Scores Only → AgentShield Server → Certificate
```

### What Goes to Server
- ✅ Agent name + platform
- ✅ Ed25519 public key (for certificates)
- ✅ Test result scores (e.g., "Prompt Injection: 18/18 passed")
- ✅ Cryptographic signatures

### What Stays Local
- ✅ Your system prompts (NEVER transmitted)
- ✅ Agent source code
- ✅ All 77 test payloads
- ✅ Detailed vulnerability reports
- ✅ Private keys

### Privacy Guarantees
1. **Zero-Knowledge Architecture:** We never see your prompts or code
2. **Cryptographic Proof:** Ed25519 signatures prove test integrity
3. **Open-Source Client:** Audit the audit tool yourself
4. **No Log Retention:** Only scores stored, not test details

### Technical Implementation

**Step 1: Local Testing (Your Machine)**
```bash
# All 77 tests run locally
python audit_local.py --agent-id my_agent

# Tests include:
# - Prompt injection (18 variants)
# - Data exfiltration (12 tests)
# - Privilege escalation (15 tests)
# - Denial of service (10 tests)
# - Social engineering (12 tests)
# - Code injection (10 tests)
```

**Step 2: Score Submission (API)**
```json
POST /api/agent-audit/complete
{
  "audit_id": "abc123",
  "test_results": {
    "prompt_injection": {"passed": 18, "total": 18},
    "data_exfiltration": {"passed": 10, "total": 12},
    ...
  }
}
```

**What We Receive:**
- Test category names (public knowledge)
- Pass/fail counts
- Overall security score (0-100)

**What We DON'T Receive:**
- Your system prompts
- Test payloads
- Vulnerability details
- Agent code

**Step 3: Certificate Issuance**
```json
{
  "certificate": {
    "agent_id": "my_agent_xyz",
    "security_score": 85,
    "tier": "VERIFIED",
    "issued_at": "2026-03-10T09:00:00Z",
    "expires_at": "2026-06-08T09:00:00Z",
    "signature": "[Ed25519 signature]"
  }
}
```

### Use Cases
- ✅ Production AI agents
- ✅ Enterprise deployments
- ✅ Compliance requirements (EU AI Act, SOC2)
- ✅ Agent-to-agent trust verification
- ✅ Public reputation building

---

## Why Privacy-First Architecture?

### Traditional Security Audits (Centralized)
```
[Your Agent + Prompts] → Security Company Server → Analysis → Report
```

**Problems:**
- 🔴 Data exfiltration risk (your secrets on external server)
- 🔴 Compliance issues (GDPR Article 28 - subprocessor agreements)
- 🔴 Trust dependency (must trust auditor)
- 🔴 Intellectual property exposure

### AgentShield Security Assessment (Decentralized)
```
[Your Agent] → Local Tests → Scores → AgentShield → Certificate
```

**Benefits:**
- 🟢 Zero data exfiltration (prompts stay local)
- 🟢 GDPR compliant (no personal data transmitted)
- 🟢 Zero-trust architecture (cryptographic proof)
- 🟢 IP protection (your code never leaves)

---

## Data Retention Policy

### Token Optimizer & Code Scan
- **Retention:** 30 days (debugging logs)
- **Deletion:** Automatic after 30 days
- **Access:** AgentShield admins only
- **Encryption:** TLS in transit, AES-256 at rest

### Agent Security Assessment
- **Test Scores:** Stored permanently (public registry)
- **Certificates:** 90 days validity, CRL permanent
- **Private Keys:** NEVER transmitted or stored
- **System Prompts:** NEVER transmitted or stored
- **Test Details:** NEVER transmitted or stored

---

## Security Measures

### All Tools
- ✅ HTTPS only (TLS 1.3)
- ✅ Rate limiting (5 requests/hour free tier)
- ✅ Input validation + sanitization
- ✅ SQL injection protection (parameterized queries)

### Security Assessment Only
- ✅ Ed25519 signature verification
- ✅ Challenge-response authentication
- ✅ Ephemeral session keys
- ✅ Public key infrastructure (PKI)
- ✅ Certificate Revocation List (CRL)

---

## Compliance

### GDPR Compliance
- **Token Optimizer/Code Scan:** Data Controller (we process your prompts/code)
- **Security Assessment:** Data Processor (we process scores only, not personal data)

### EU AI Act Compliance
- **Article 15 (Transparency):** Agent security scores publicly verifiable
- **Article 17 (Record-Keeping):** Audit trail via blockchain (planned v2.0)

### SOC2 Type II (Planned Q2 2026)
- Independent audit of security controls
- Penetration testing
- Incident response procedures

---

## Trust Handshake Protocol (NEW in v1.4)

### Purpose
Agent-to-agent mutual verification without sharing secrets.

### Data Flow
```
[Agent A] ←→ AgentShield Server ←→ [Agent B]
   ↓                                   ↓
Public Key                         Public Key
Signature                          Signature
   ↓                                   ↓
Session Key Generated (both sides)
```

### What Goes to Server
- ✅ Agent IDs (both parties)
- ✅ Ed25519 public keys
- ✅ Challenge signatures
- ✅ Timestamp

### What Stays Local
- ✅ Private keys
- ✅ Session keys (generated locally)
- ✅ Encrypted communication content

---

## OpenClaw ClawHub Review Response

**Flagging Reasons (from ClawHub):**
1. ❌ "System Prompt submission" - **INCORRECT** (only in Token Optimizer, not Security Assessment)
2. ❌ "Client-submitted scores" - **CORRECT** (but cryptographically verified)
3. ❌ "Gmail address" - **FIXED** (now support@agentshield.live)
4. ❌ "Session keys via server" - **PARTIAL** (handshake uses ephemeral keys, not stored)

**Our Response:**
- **Tool Separation:** Token Optimizer ≠ Security Assessment
- **Privacy-First Design:** Prompts NEVER leave device in Security Assessment
- **Cryptographic Trust:** Ed25519 signatures prevent score manipulation
- **Professional Infrastructure:** @agentshield.live emails, dedicated support

---

## Contact

- **General Questions:** support@agentshield.live
- **Security Issues:** security@agentshield.live
- **Privacy Concerns:** admin@agentshield.live

---

## Version History

**v1.4.1** (2026-03-10)
- Separated Token Optimizer/Code Scan (marketing) from Security Assessment (production)
- Clarified privacy architecture
- Updated contact emails (@agentshield.live)

**v1.4.0** (2026-03-09)
- Trust Handshake Protocol
- Session key generation
- Mutual agent verification

**v1.0.0** (2026-03-01)
- Initial release
- Privacy-first local testing

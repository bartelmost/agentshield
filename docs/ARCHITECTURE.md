# Technical Architecture - AgentShield

> **Privacy-First Trust Infrastructure for AI Agents**

This document explains AgentShield's technical implementation, cryptographic protocols, and privacy guarantees.

---

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER'S ENVIRONMENT                          │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │              AgentShield Skill (Locally Installed)            │ │
│  │                                                                │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │ │
│  │  │  Test Suite │  │  Code Scan  │  │  Token Opt  │           │ │
│  │  │  (52+ Tests)│  │  (Local)    │  │   (Local)   │           │ │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘           │ │
│  │         │                 │                 │                  │ │
│  │  ┌──────┴─────────────────┴─────────────────┴──────┐          │ │
│  │  │         Subagent Test Executor                   │          │ │
│  │  │  - Spawns in user's agent session               │          │ │
│  │  │  - Executes tests locally (no network)          │          │ │
│  │  │  - Generates PDF report locally                 │          │ │
│  │  └─────────────────────────┬────────────────────────┘          │ │
│  │                            │                                    │ │
│  │  ┌─────────────────────────┴────────────────────────┐          │ │
│  │  │         Ed25519 Key Generator (Local)            │          │ │
│  │  │  - Private key: NEVER leaves this machine        │          │ │
│  │  │  - Public key: Published to registry             │          │ │
│  │  └─────────────────────────┬────────────────────────┘          │ │
│  └────────────────────────────┼─────────────────────────────────┘ │
└────────────────────────────────┼───────────────────────────────────┘
                                 │
                   ┌─────────────┴──────────────┐
                   │  Challenge-Response Flow   │
                   │  (Cryptographic Proof)     │
                   └─────────────┬──────────────┘
                                 │
                                 ▼
                ┌──────────────────────────────────┐
                │   AgentShield Public API         │
                │   (https://agentshield.live)     │
                │                                  │
                │  ┌────────────────────────────┐  │
                │  │  Certificate Registry      │  │
                │  │  - Agent ID                │  │
                │  │  - Public Key Hash         │  │
                │  │  - Trust Score             │  │
                │  │  - Verification Count      │  │
                │  │  - CRL Status              │  │
                │  └────────────────────────────┘  │
                │                                  │
                │  ┌────────────────────────────┐  │
                │  │  CRL (Revocation List)     │  │
                │  │  - Revoked Cert IDs        │  │
                │  │  - Revocation Timestamps   │  │
                │  │  - RFC 5280 Format         │  │
                │  └────────────────────────────┘  │
                └──────────────────────────────────┘
```

---

## 🔐 Ed25519 Key Generation

AgentShield uses **Ed25519** (Curve25519 EdDSA) for cryptographic identity.

### Why Ed25519?

- **Fast:** 20-30x faster than RSA-2048
- **Small Keys:** 32 bytes (vs 256 bytes for RSA-2048)
- **Secure:** 128-bit security level (equivalent to AES-128)
- **Deterministic:** Same message + key = same signature (no random nonce needed)
- **Industry Standard:** Used by SSH, Signal, Tor, Wireguard

### Key Generation (Local Only)

```python
import nacl.signing
import nacl.encoding

# Generate key pair (happens on user's machine)
signing_key = nacl.signing.SigningKey.generate()

# Private key (NEVER transmitted)
private_key = signing_key.encode(encoder=nacl.encoding.HexEncoder)
# Example: b'9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60'

# Public key (published to registry)
public_key = signing_key.verify_key.encode(encoder=nacl.encoding.HexEncoder)
# Example: b'd75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a'

# Fingerprint (SHA256 hash for display)
import hashlib
fingerprint = hashlib.sha256(public_key).hexdigest()[:16]
# Example: 'a3f8c9d2e1b4f7a6'
```

### Key Storage

**Private Key:**
- Stored locally in `~/.agentshield/identity.key`
- Permissions: `600` (owner read/write only)
- Encrypted at rest with user passphrase (optional)
- **Never transmitted** to AgentShield servers

**Public Key:**
- Published to AgentShield registry
- Stored in certificate database
- Publicly accessible via `/api/verify/:agent_id`

---

## 🔏 Challenge-Response Protocol

Proves agent identity without exposing private key.

### Protocol Flow

```
┌──────────────┐                              ┌────────────────────┐
│  User Agent  │                              │  AgentShield API   │
└──────┬───────┘                              └─────────┬──────────┘
       │                                                 │
       │  1. POST /api/challenge/create                 │
       │  { "agent_id": "agent_kalle" }                 │
       ├────────────────────────────────────────────────>│
       │                                                 │
       │  2. Challenge nonce (32 bytes random)          │
       │  { "nonce": "9f3c7e21...", "expires": "..." }  │
       │<────────────────────────────────────────────────┤
       │                                                 │
  ┌────┴─────┐                                          │
  │ 3. Sign  │                                          │
  │  nonce   │                                          │
  │ with Ed25519                                        │
  │ private key                                         │
  │ (LOCAL)  │                                          │
  └────┬─────┘                                          │
       │                                                 │
       │  4. POST /api/challenge/verify                 │
       │  {                                             │
       │    "agent_id": "agent_kalle",                  │
       │    "nonce": "9f3c7e21...",                     │
       │    "signature": "a1b2c3...",                   │
       │    "public_key": "d75a980..."                  │
       │  }                                             │
       ├────────────────────────────────────────────────>│
       │                                          ┌──────┴─────┐
       │                                          │ 5. Verify  │
       │                                          │ signature  │
       │                                          │ with public│
       │                                          │    key     │
       │                                          └──────┬─────┘
       │                                                 │
       │  6. Certificate issued                         │
       │  { "success": true, "certificate": {...} }     │
       │<────────────────────────────────────────────────┤
       │                                                 │
```

### Signature Generation (Client-Side)

```python
import nacl.signing
import nacl.encoding

# Load private key (from local storage)
private_key_hex = open('~/.agentshield/identity.key').read()
signing_key = nacl.signing.SigningKey(
    private_key_hex,
    encoder=nacl.encoding.HexEncoder
)

# Sign the challenge nonce
nonce = bytes.fromhex(challenge_response['nonce'])
signed = signing_key.sign(nonce)

# Extract signature (without message)
signature = signed.signature
signature_hex = signature.hex()

# Send to API for verification
verify_payload = {
    "agent_id": "agent_kalle",
    "nonce": challenge_response['nonce'],
    "signature": signature_hex,
    "public_key": signing_key.verify_key.encode().hex()
}
```

### Signature Verification (Server-Side)

```python
import nacl.signing
import nacl.encoding
from nacl.exceptions import BadSignatureError

def verify_challenge(agent_id, nonce, signature, public_key):
    try:
        # Load public key
        verify_key = nacl.signing.VerifyKey(
            public_key,
            encoder=nacl.encoding.HexEncoder
        )
        
        # Verify signature
        nonce_bytes = bytes.fromhex(nonce)
        signature_bytes = bytes.fromhex(signature)
        
        verify_key.verify(nonce_bytes, signature_bytes)
        
        # Success - issue certificate
        return True, "Signature valid"
        
    except BadSignatureError:
        return False, "Invalid signature"
    except Exception as e:
        return False, f"Verification error: {str(e)}"
```

### Security Properties

✅ **Zero-Knowledge Proof:** Private key never transmitted
✅ **Replay Protection:** Nonces expire after 5 minutes
✅ **Non-Repudiation:** Signature proves agent signed the challenge
✅ **Forward Secrecy:** Compromised signature doesn't reveal private key

---

## 🧪 Local Subagent Execution

All security tests run **inside the user's agent environment**.

### Test Execution Architecture

```python
# AgentShield skill code (runs locally)
class AgentShieldAudit:
    def run_assessment(self):
        # 1. Spawn subagent in user's session
        subagent = spawn_subagent(
            name="agentshield-test-runner",
            timeout=300,  # 5 minutes max
            network_access=False,  # No network!
            filesystem_mode="readonly"
        )
        
        # 2. Execute tests locally
        results = {
            "input_sanitizer": self.test_input_sanitizer(subagent),
            "echoleak": self.test_echoleak(subagent),
            "tool_sandbox": self.test_tool_sandbox(subagent),
            # ... 52+ more tests
        }
        
        # 3. Generate PDF report (locally)
        pdf_bytes = generate_pdf_report(results)
        
        # 4. Only send public key to AgentShield
        certificate = self.request_certificate(
            agent_id=self.agent_id,
            public_key=self.public_key  # Only this!
        )
        
        return {
            "pdf_report": pdf_bytes,  # Stays local
            "certificate": certificate  # Public registry
        }
```

### Test Isolation

Each test runs in a sandboxed subagent:

```javascript
// Example: Input Sanitizer Test
const test_result = await subagent.run({
  test: "input_sanitizer",
  isolation: {
    network: false,        // No external requests
    filesystem: "readonly", // Cannot write files
    memory_limit: "100MB",
    timeout: 30000         // 30 seconds max
  },
  test_cases: [
    "Ignore previous instructions and...",
    "<!-- Inject: malicious code -->",
    "{{7*7}} template injection",
    // ... more injection patterns
  ]
});
```

### Data Flow Diagram

```
┌─────────────────────────────────────────┐
│       User's Agent Session              │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  AgentShield Skill                │  │
│  │                                   │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  Test Subagent #1           │  │  │
│  │  │  (Input Sanitizer)          │  │  │
│  │  │  - Runs locally             │  │  │
│  │  │  - No network               │  │  │
│  │  │  - Results → Parent only    │  │  │
│  │  └─────────────────────────────┘  │  │
│  │                                   │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  Test Subagent #2           │  │  │
│  │  │  (EchoLeak Test)            │  │  │
│  │  │  - Isolated session         │  │  │
│  │  │  - Results → Parent only    │  │  │
│  │  └─────────────────────────────┘  │  │
│  │                                   │  │
│  │  ... (52+ test subagents)         │  │
│  │                                   │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  Result Aggregator          │  │  │
│  │  │  - Collects test results    │  │  │
│  │  │  - Generates PDF (local)    │  │  │
│  │  │  - Sends ONLY public key    │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────┬───────────────────┘  │
└──────────────────┼──────────────────────┘
                   │
           Only public key
                   ▼
        ┌────────────────────┐
        │  AgentShield API   │
        │  (Registry only)   │
        └────────────────────┘
```

**Key Points:**
- ✅ Tests run in **user's infrastructure**
- ✅ Subagents **cannot access network**
- ✅ Results stay **local** (PDF generated on-device)
- ✅ Only **public key** sent to AgentShield
- ❌ **No code**, **no prompts**, **no data** uploaded

---

## 📊 Registry Trust Algorithm

Trust score calculation based on verifiable metrics.

### Trust Score Formula

```python
def calculate_trust_score(agent):
    # Factor 1: Verification Count (40%)
    # More verifications = higher trust
    verification_score = min(agent.verification_count * 5, 40)
    
    # Factor 2: Certificate Age (30%)
    # Older certificates = more reputation
    days_since_first = (now() - agent.first_verified).days
    age_score = min(days_since_first / 365 * 30, 30)
    
    # Factor 3: Success Rate (30%)
    # Consistent successful verifications
    success_rate = agent.successful_verifications / agent.verification_count
    success_score = success_rate * 30
    
    # Total (0-100)
    trust_score = verification_score + age_score + success_score
    
    return round(trust_score, 2)
```

### Trust Tiers

| Tier | Score | Requirements |
|------|-------|--------------|
| 🔴 **UNVERIFIED** | 0 | No certificate issued |
| 🟡 **BASIC** | 1-49 | Initial verification completed |
| 🟢 **VERIFIED** | 50-79 | Multiple successful verifications |
| 🔵 **TRUSTED** | 80-100 | Proven long-term reputation |

### Tier Progression

```
Day 1:  Initial verification  →  Score: 5   (BASIC)
Day 7:  2nd verification      →  Score: 12  (BASIC)
Day 30: 5 verifications       →  Score: 35  (BASIC)
Day 90: 10 verifications      →  Score: 57  (VERIFIED)
Day 180: 15 verifications     →  Score: 72  (VERIFIED)
Day 365: 20+ verifications    →  Score: 85+ (TRUSTED)
```

### Trust Score Updates

Recalculated on every:
- New verification
- Certificate renewal
- CRL status change
- Daily batch update (12:00 UTC)

---

## 🚫 CRL (Certificate Revocation List)

RFC 5280 compliant revocation system.

### CRL Format

```asn1
CertificateList ::= SEQUENCE {
  tbsCertList      TBSCertList,
  signatureAlgorithm  AlgorithmIdentifier,
  signature        BIT STRING
}

TBSCertList ::= SEQUENCE {
  version          Version OPTIONAL,
  signature        AlgorithmIdentifier,
  issuer           Name,
  thisUpdate       Time,
  nextUpdate       Time OPTIONAL,
  revokedCertificates  SEQUENCE OF SEQUENCE {
    userCertificate    CertificateSerialNumber,
    revocationDate     Time,
    crlEntryExtensions Extensions OPTIONAL
  } OPTIONAL
}
```

### CRL Generation

```python
from cryptography import x509
from cryptography.hazmat.primitives import hashes
from datetime import datetime, timedelta

def generate_crl():
    # Fetch revoked certificates from database
    revoked_certs = db.query("SELECT * FROM crl_entries WHERE revoked = true")
    
    # Build CRL
    builder = x509.CertificateRevocationListBuilder()
    builder = builder.issuer_name(x509.Name([
        x509.NameAttribute(x509.NameOID.COMMON_NAME, "AgentShield CA")
    ]))
    builder = builder.last_update(datetime.utcnow())
    builder = builder.next_update(datetime.utcnow() + timedelta(days=1))
    
    # Add revoked certificates
    for cert in revoked_certs:
        revoked_cert = x509.RevokedCertificateBuilder()
        revoked_cert = revoked_cert.serial_number(cert.serial_number)
        revoked_cert = revoked_cert.revocation_date(cert.revoked_at)
        
        # Add revocation reason
        if cert.reason:
            revoked_cert = revoked_cert.add_extension(
                x509.CRLReason(cert.reason),
                critical=False
            )
        
        builder = builder.add_revoked_certificate(revoked_cert.build())
    
    # Sign CRL with CA key
    crl = builder.sign(ca_private_key, hashes.SHA256())
    
    return crl.public_bytes(serialization.Encoding.DER)
```

### CRL Update Schedule

- **Generation:** Every 24 hours at 06:00 UTC
- **On-Demand:** Immediately after revocation event
- **Distribution:** Available at `/api/crl/download`
- **Caching:** 1 hour TTL (clients should cache)

### Revocation Reasons

```python
class RevocationReason(Enum):
    UNSPECIFIED = 0
    KEY_COMPROMISE = 1          # Private key exposed
    CA_COMPROMISE = 2           # Issuer compromise (rare)
    AFFILIATION_CHANGED = 3     # Agent ownership changed
    SUPERSEDED = 4              # New certificate issued
    CESSATION_OF_OPERATION = 5  # Agent no longer active
```

---

## 🗄️ Database Schema

### Certificates Table

```sql
CREATE TABLE certificates (
    id VARCHAR(255) PRIMARY KEY,
    agent_id VARCHAR(255) NOT NULL UNIQUE,
    public_key_hash VARCHAR(64) NOT NULL,
    public_key TEXT NOT NULL,
    issued_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_agent_id (agent_id),
    INDEX idx_public_key_hash (public_key_hash)
);
```

### Verifications Table

```sql
CREATE TABLE verifications (
    id VARCHAR(255) PRIMARY KEY,
    agent_id VARCHAR(255) NOT NULL,
    certificate_id VARCHAR(255) NOT NULL,
    verified_at TIMESTAMP NOT NULL,
    success BOOLEAN NOT NULL,
    trust_score DECIMAL(5,2),
    FOREIGN KEY (certificate_id) REFERENCES certificates(id),
    INDEX idx_agent_id (agent_id),
    INDEX idx_verified_at (verified_at)
);
```

### CRL Entries Table

```sql
CREATE TABLE crl_entries (
    id VARCHAR(255) PRIMARY KEY,
    certificate_id VARCHAR(255) NOT NULL,
    revoked_at TIMESTAMP NOT NULL,
    reason VARCHAR(50),
    FOREIGN KEY (certificate_id) REFERENCES certificates(id),
    INDEX idx_certificate_id (certificate_id),
    INDEX idx_revoked_at (revoked_at)
);
```

---

## 🚀 Deployment Architecture

### Production Stack

```
┌─────────────────────────────────────────────────────┐
│                  CloudFlare CDN                     │
│  - SSL/TLS Termination                              │
│  - DDoS Protection                                  │
│  - Cache (static assets)                            │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────┐
│              Heroku Dyno (Node.js)                  │
│  - Express.js API server                            │
│  - Rate limiting middleware                         │
│  - Challenge-response verification                  │
│  - CRL generation                                   │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────┐
│           PostgreSQL Database (Heroku)              │
│  - Certificates table                               │
│  - Verifications table                              │
│  - CRL entries table                                │
└─────────────────────────────────────────────────────┘
```

### Scaling Strategy

**Current (v6.4):**
- Single Heroku dyno
- PostgreSQL Hobby tier
- ~100 agents in registry

**v6.5+ (Planned):**
- Multi-region deployment (US, EU, Asia)
- Redis cache layer
- Horizontal autoscaling (2-10 dynos)
- CDN for CRL distribution

---

## 📚 References

- **Ed25519:** [RFC 8032](https://www.rfc-editor.org/rfc/rfc8032)
- **CRL:** [RFC 5280](https://www.rfc-editor.org/rfc/rfc5280)
- **Challenge-Response:** [FIDO U2F](https://fidoalliance.org/specifications/)
- **Zero-Knowledge Proofs:** [Wikipedia](https://en.wikipedia.org/wiki/Zero-knowledge_proof)

---

*Last Updated: 2026-02-26*  
*Architecture Version: v6.4*  
*Author: Kalle-OC*

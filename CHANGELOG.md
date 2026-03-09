# CHANGELOG - AgentShield v1.4.0

## v1.4.0 - TRUST HANDSHAKE PROTOCOL LAUNCH 🚀 (2026-03-09)

**MAJOR RELEASE:** Agent-to-Agent Trust Infrastructure

### 🎉 NEW FEATURES (PHASE 2)

#### Trust Handshake Protocol
**The Core Feature:** Mutual cryptographic verification between AI agents

**New Endpoints:**
1. `GET /api/verify-peer/:agent_id` - Quick trust verification
2. `POST /api/trust-handshake/initiate` - Start mutual handshake
3. `POST /api/trust-handshake/complete` - Submit Ed25519 signatures
4. `GET /api/trust-handshake/status/:id` - Check handshake progress
5. `GET /api/trust-handshake/history/:id` - View agent's track record

**What It Does:**
- Agent A verifies Agent B's trustworthiness
- Both agents mutually authenticate (Ed25519 signatures)
- System generates ephemeral session key
- Both agents receive +5 trust points
- Complete history tracked for reputation

**Use Case:**
```bash
# 1. Quick trust check
GET /api/verify-peer/agent_b?min_score=70

# 2. Initiate handshake
POST /api/trust-handshake/initiate
→ Returns handshake_id + challenges

# 3. Both agents sign challenges locally
agent_a_signature = Ed25519.sign(challenge_a)
agent_b_signature = Ed25519.sign(challenge_b)

# 4. Complete handshake
POST /api/trust-handshake/complete
→ Verifies signatures → Returns session_key

# 5. View track record
GET /api/trust-handshake/history/agent_a
→ Shows success_rate, completed handshakes
```

#### Database Schema
- New `handshakes` table with 4 performance indexes
- Trust score updates (+5 per successful handshake)
- Verification count tracking
- Success rate statistics

#### Security Features
- Ed25519 cryptographic signatures (same as certificates)
- TTL-based expiry (60 seconds to 24 hours)
- Self-handshake prevention
- Revocation checks (CRL integration)
- Certificate expiry validation

### 🔧 BUG FIXES

#### v1.3.1 (Minor)
- Fixed `verify-peer` min_score bug (now checks `security_score` instead of `trust_score`)
- Added None-safety to `is_handshake_expired()`

#### v1.3.2 (Minor)
- Added comprehensive error logging to handshake endpoints
- Try-catch blocks for better debugging

#### v1.3.3 (Minor)
- Added `/api/debug/handshake-table` endpoint
- Added `/api/admin/migrate-db` endpoint for manual migrations

#### v1.3.4-v1.3.8 (Patch)
- Fixed DateTime timezone comparison bugs (offset-naive vs offset-aware)
- Fixed double `+00:00` bug in timestamp storage
- Fixed History endpoint indentation bug
- Smart `.replace('Z', '+00:00')` only when needed

### 📊 TESTING

**Comprehensive Test Coverage (by My1stBot):**
- ✅ Invalid signatures (garbage, wrong key, mixed) → 403
- ✅ TTL validation (min 60s enforced) → 400
- ✅ Self-handshake prevention → 400
- ✅ Non-existent agents → 404
- ✅ Double-complete prevention → 409
- ✅ Full happy path (Initiate → Complete → History → Status)

**Result:** 10/11 tests PASSED (1 skipped: manual expiry test)

### 💰 PRICING IMPACT

**No changes yet** - Trust Handshake Protocol is FREE during beta.

**Future Pricing (post-launch):**
- Free tier: 5 handshakes/month
- Pro tier (€10/month): 100 handshakes/month
- Team tier (€30/month): Unlimited handshakes

**Validated Willingness to Pay:** €10/month (My1stBot)

### 📝 DOCUMENTATION

- Updated API.md with 5 new endpoints
- Updated README.md with Trust Protocol section
- Added Integration Guide (Python examples)
- Updated ClawHub SKILL.md with handshake support

### 🙏 CREDITS

**Special Thanks:**
- My1stBot for systematic testing, detailed bug reports, and patience through 8 bugfix iterations

---

## v1.2.1 - PHASE 1 COMPLETION (2026-03-07)

**CRITICAL FIX:** Client-submitted scores now respected
- Server accepts local audit scores (Client-First Model)
- Fixed score discrepancy bug (reported by My1stBot)

**My1stBot Feedback:**
- "Ready for Beta Users!"
- "For the Trust Handshake Protocol, I'd pay €20/month"

---

## v1.2.0 - Enhanced Audit + CRL (2026-02-26)

### New Features
- Certificate Revocation List (CRL) - RFC 5280 compliant
- Public Trust Registry with search
- Challenge-Response Protocol (Ed25519)
- 52 Attack Vectors in LiveTestEngine

### Endpoints
- `/api/crl`, `/api/crl/download`, `/api/crl/revoke`
- `/api/registry/agents`, `/api/registry/search`
- `/api/agent-audit/challenge`, `/api/agent-audit/complete`

---

## v1.0.0 - Initial Release (2026-02-19)

### Core Features
- Token Optimizer with ROI calculation
- Code Security Scanner (SQLi, XSS, Command Injection)
- Full Agent Audit with Ed25519 certificates
- PDF Reports (7 pages)
- Security Tier System (VULNERABLE → BASIC → PROTECTED → HARDENED)

### Pricing
- $0.50 Token Optimizer
- $0.10 Code Scan
- $2.50 Full Audit
- $2.90 Bundle (all 3)

### Promotional Codes
- BETA5: Unlimited audits
- LAUNCH1-10: 10 scans each

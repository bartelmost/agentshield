# Changelog - AgentShield

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.23] - 2026-03-24

### Fixed
- **Critical: API URL Bug in Trust Handshake** 🐛
  - File: `complete_handshake.py`
  - Issue: `https://agentshield.live/api` + `/api/...` = `/api/api/` (404 errors)
  - Fix: Changed to `https://agentshield.live` (without `/api` suffix)
  - Impact: Trust Handshake Protocol now works correctly
  - Thanks to **My1stBot** for testing and reporting!

- **Dependencies Installation** 📦
  - Added explicit `pip3 install -r requirements.txt` instruction to SKILL.md
  - Prevents `cryptography` and `requests` import errors on fresh installs
  - Addresses user feedback about missing dependencies

- **Non-Interactive Mode** 🤖
  - Added `--yes` / `-y` flag to `initiate_audit.py`
  - Usage: `python3 initiate_audit.py --auto --yes`
  - Enables CI/CD pipelines and automated testing workflows
  - Skips confirmation prompts when confidence is high

### Improved
- **Code Documentation** 💡
  - Added clarifying comment in `agentshield_tester.py` line 322
  - Explains that `exec/eval` are **search patterns**, not actual code execution
  - Addresses false-positive from security scanners

### Technical Details
**API Endpoint Changes:**
- ❌ Old: `AGENTSHIELD_API = "https://agentshield.live/api"`
- ✅ New: `AGENTSHIELD_API = "https://agentshield.live"`
- Reason: Code already appends `/api/...` paths

**Files Changed:**
- `complete_handshake.py` (API URL fix)
- `initiate_audit.py` (added `--yes` flag)
- `SKILL.md` (dependencies documentation)
- `agentshield_tester.py` (clarifying comment)
- `clawhub.json` (version bump)

### Impact
- ✅ Out-of-the-box functionality for all users
- ✅ Trust Handshake Protocol fully operational
- ✅ Better CI/CD integration support
- ✅ Improved code clarity for security reviewers

---

## [1.0.22] - 2026-03-11

### Fixed
- **Hardcoded API Endpoint**
  - Changed `complete_handshake.py` from Heroku URL to domain-aligned endpoint
  - From: `https://agentshield-api-bartel-fe94823ceeea.herokuapp.com/api`
  - To: `https://agentshield.live/api`
  - Resolves OpenClaw scanner flag about external Heroku endpoint

### Added
- **Data Transmission Transparency** (SKILL.md)
  - Explicit JSON payload examples
  - "What is NOT sent" documentation
  - API endpoint specifications (HTTPS, TLS 1.2+)

- **Consent Flow Documentation** (SKILL.md)
  - File read prompts: "Read IDENTITY.md? [Y/n]"
  - Privacy-First mode: `AGENTSHIELD_NO_AUTO_DETECT=1`

- **PRIVACY.md** - Comprehensive data handling guide
  - What data is read (IDENTITY.md, SOUL.md)
  - What data is sent (name, platform, public key, scores)
  - What is NOT sent (private keys, prompts, workspace)
  - Manual mode instructions

### Changed
- Version number updated across all metadata files

---

## [1.0.21] - 2026-03-09

### Security
- Enhanced input sanitization patterns
- Improved unicode attack detection
- Updated threat categorization

---

## [1.0.20] - 2026-03-05

### Added
- Trust Handshake Protocol (Phase 1)
- `handshake.py` - Initiate trust handshakes
- `complete_handshake.py` - Complete challenge-response
- Mutual verification between agents

### Improved
- Audit performance optimizations
- Better error messages
- Cleaner CLI output

---

## [1.0.19] - 2026-02-28

### Added
- 77 Security Tests (52 live + 25 static)
- Live attack testing engine
- Response analyzer with AI scoring

### Changed
- Moved from 5 placeholder tests to full test suite
- Updated scoring algorithm
- New tier system: VULNERABLE → BASIC → VERIFIED → TRUSTED → HARDENED

---

## [1.0.0] - 2026-02-24

### Added
- Initial ClawHub release
- Ed25519 cryptographic identity
- Basic security audit (5 tests)
- Certificate signing
- Auto-detection from IDENTITY.md/SOUL.md
- Peer verification

---

## Versioning Strategy

- **Major (X.0.0):** Breaking API changes
- **Minor (1.X.0):** New features, backward compatible
- **Patch (1.0.X):** Bug fixes, documentation updates

---

## Links

- **ClawHub:** https://clawhub.com/skills/agentshield-audit
- **GitHub:** https://github.com/bartelmost/agentshield
- **Website:** https://agentshield.live
- **Issues:** https://github.com/bartelmost/agentshield/issues

---

**Last Updated:** 2026-03-24

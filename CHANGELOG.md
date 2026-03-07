# AgentShield Changelog

All notable changes to AgentShield are documented here.

---

## [1.2.0] - 2026-03-07

### 🎯 Major Release: Complete Security Testing Suite

**Added:**
- **77 Comprehensive Security Tests** (`agentshield_tester.py`)
  - 25 static security tests (Input Sanitizer, Output DLP, Tool Sandbox, EchoLeak, Secret Scanner, Supply Chain)
  - 52 live attack vectors (Direct Override, Role Hijacking, Encoding, Multi-Language, Context Manipulation, Social Engineering, Prompt Leaks)
  - Complete test documentation ([TESTING.md](TESTING.md))
  - JSON output with scoring system (0-100)
  - Tier classification (MINIMAL_RISKS → RISKS_DETECTED)

**Changed:**
- **Official API Endpoint:** All references updated from Heroku development URL to `https://agentshield.live/api`
- **Unified Versioning:** Switched from v6.x to semantic versioning (v1.2.0)
- Documentation updated throughout for consistency

**Improved:**
- Production-ready testing capability
- NO placeholders - all tests with real checking logic
- Standalone test usage (works without AgentShield API)
- Comprehensive documentation across all files

---

## [1.1.1] - 2026-03-07

### Changed
- **API URL Migration:** Updated all endpoints from Heroku development URL to official `agentshield.live/api`
- All Python scripts updated with new default endpoint
- Documentation reflects official API throughout

---

## [1.0.1] - 2026-03-06

### Fixed
- **ClawHub Security Feedback:**
  - Removed silent environment variable scanning
  - Removed consent bypass (`--yes` flag)
  - API endpoint clearly marked as DEV/BETA
  - Improved privacy documentation

---

## [1.0.0] - 2026-02-24

### Initial Release

**Core Features:**
- Ed25519 cryptographic certificates for AI agents
- Human-in-the-Loop consent flow
- Complete local bundle (no external code fetching)
- Challenge-response authentication protocol
- Public trust registry
- Certificate Revocation List (CRL)

**Security:**
- Zero knowledge architecture
- Private keys never leave local environment
- Explicit user consent required for file access
- Minimal data transmission (public key only)

**Documentation:**
- Complete API documentation
- Installation guides
- Security policy
- Developer transparency document

---

## Version History Summary

| Version | Date | Key Features |
|---------|------|--------------|
| **1.2.0** | 2026-03-07 | **77 Security Tests**, Official API |
| 1.1.1 | 2026-03-07 | API URL Migration |
| 1.0.1 | 2026-03-06 | ClawHub Security Fixes |
| 1.0.0 | 2026-02-24 | Initial Release |

---

## Deprecated Versions

### v6.x Series (Internal Development)
- v6.5 - Free tier implementation (internal)
- v6.4 - CRL + Registry release (internal)
- Earlier versions were development iterations

**Note:** Version numbering was unified to semantic versioning (1.x.x) starting with public release.

---

## Upgrade Paths

### From v1.0.x → v1.2.0
**No breaking changes.** All existing features work as before.

**New capabilities:**
- Run standalone security tests
- Access 77-test comprehensive suite
- Use official API endpoint

**Migration:**
```bash
# Update repository
git pull origin main

# Optional: Update API endpoint in environment
export AGENTSHIELD_API="https://agentshield.live/api"

# Run new tests
python agentshield_tester.py --config agent_config.json --prompt system_prompt.txt
```

---

## Upcoming Features

### v1.3.0 (Planned)
- Real-time live attack testing (interactive agent testing)
- Enhanced CRL with delta updates
- Registry API rate limiting improvements
- WebAuthn certificate integration

### v2.0.0 (Roadmap)
- Multi-signature certificates (consortium trust)
- Hardware security module (HSM) support
- Regulatory compliance reports (EU AI Act, GDPR)
- Agent mesh trust networks

---

## Breaking Changes

**None yet.** AgentShield maintains backward compatibility.

---

## Security Advisories

**None.** No security vulnerabilities have been reported.

To report security issues: See [SECURITY.md](SECURITY.md)

---

**Maintained by:** Kalle-OC (@bartelmost)  
**Contact:** ratgeberpro@gmail.com  
**Last Updated:** 2026-03-07

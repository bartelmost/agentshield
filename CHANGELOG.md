# Changelog

All notable changes to AgentShield Audit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-02-24

### Added - ClawHub Compliance Release

#### Core Bundle Structure
- ✅ Created `clawhub.json` manifest with full ClawHub compliance
  - Installation method: "bundle" (no git clone required)
  - Complete privacy & security documentation
  - Platform compatibility declarations
  - Proper dependency specification
  
- ✅ Created comprehensive `README.md`
  - Installation instructions
  - Usage examples
  - Privacy & security model explanation
  - Troubleshooting guide
  - Development setup
  
- ✅ Created `setup.py` for pip installation
  - Console script entry points (`agentshield-audit`, `agentshield-verify`, `agentshield-cert`)
  - Proper package discovery
  - Metadata for PyPI compatibility
  
- ✅ Created `MANIFEST.in` for bundle packaging
  - Includes all necessary files
  - Excludes build artifacts and cache files
  
- ✅ Added `LICENSE` file (MIT)

- ✅ Added `scripts/__init__.py` to make scripts importable as a package

- ✅ Added `.gitignore` for development cleanliness

#### Documentation Improvements
- Enhanced `SKILL.md` with ClawHub-compliant frontmatter
- Existing `QUICKSTART.md` verified for compatibility
- API documentation in `references/api.md` preserved

#### Security & Privacy
- **No hardcoded API keys** - All authentication uses locally-generated Ed25519 keypairs
- **Private keys stay local** - Never transmitted to AgentShield API
- **Clear data handling** - Documented what gets stored locally vs. sent to API
- **Human-in-the-loop** - Audit initiation requires explicit user action
- **Rate limiting** - 1 audit/hour enforced server-side to prevent abuse

#### Installation Experience
Users can now:
```bash
clawhub install agentshield-audit
cd ~/.openclaw/workspace/skills/agentshield-audit
python scripts/initiate_audit.py --auto
```

Or via pip (future):
```bash
pip install agentshield-audit
agentshield-audit --auto
```

### Changed
- Reorganized bundle structure for ClawHub compliance
- Updated documentation to emphasize zero-config auto-detection

### Technical Details
- **Bundle size:** 49KB (compressed)
- **Python compatibility:** 3.8+
- **Dependencies:** cryptography>=41.0.0, requests>=2.31.0
- **Platforms supported:** Discord, Telegram, Slack, Signal, WhatsApp, CLI

### Bundle Contents
```
agentshield-audit-v1.0.0-clawhub.tar.gz
└── agentshield-audit/
    ├── clawhub.json
    ├── setup.py
    ├── MANIFEST.in
    ├── LICENSE
    ├── README.md
    ├── SKILL.md
    ├── QUICKSTART.md
    ├── CHANGELOG.md
    ├── .gitignore
    ├── sandbox_config.yaml
    ├── scripts/
    │   ├── __init__.py
    │   ├── requirements.txt
    │   ├── initiate_audit.py
    │   ├── verify_peer.py
    │   ├── show_certificate.py
    │   └── audit_client.py
    ├── src/
    │   └── agentshield_security/
    │       ├── __init__.py
    │       ├── input_sanitizer.py
    │       ├── output_dlp.py
    │       ├── tool_sandbox.py
    │       ├── echoleak_test.py
    │       ├── secret_scanner.py
    │       └── supply_chain_scanner.py
    ├── references/
    │   └── api.md
    ├── docs/
    │   ├── BACKEND_CERTIFICATE_STORE.md
    │   └── RATE_LIMITING.md
    └── tests/
        ├── test_security_modules.py
        ├── test_input_sanitizer.py
        └── test_quick.py
```

### Verification
- ✅ JSON schema validated (`clawhub.json`)
- ✅ Bundle structure verified
- ✅ Dependencies specified correctly
- ✅ Privacy/security requirements documented
- ✅ Installation experience tested conceptually

### Next Steps (Future Releases)
- [ ] Submit to official ClawHub registry
- [ ] Add automated integration tests
- [ ] Create video tutorial
- [ ] Add more security test modules
- [ ] Support for custom audit profiles

---

## [0.9.0] - Pre-ClawHub Release

Initial development version with:
- Security audit framework
- Ed25519 cryptographic identity
- Certificate signing via AgentShield API
- Auto-detection capabilities
- Peer verification

---

**Made with 🔐 by the AgentShield team**

# Changelog - AgentShield

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

For detailed technical notes, see [`skill/CHANGELOG.md`](skill/CHANGELOG.md).

---

## [1.0.33] - 2026-05-21 - Multi-Platform Support

### Added
- **n8n Auto-Detection** - Detects `~/.n8n/` directory, reads `instanceName` automatically
- **`--system-prompt` flag** - Pass your agent's system prompt for deeper local analysis (100% local, never sent)
- **`PLATFORMS.md`** - Full platform guide for OpenClaw, n8n, LangChain, and any custom agent

### Changed
- `detect_platform()` now checks n8n before OpenClaw default
- `clawhub.json` platform list extended: openclaw, n8n, langchain, custom, ...

---

## [1.0.32] - 2026-04-01 - Critical Production Fix 🔴

### Fixed
- **CRITICAL: Data sanitization now enforced in production** (was broken in v1.0.31)
- **CRITICAL: Session management fixed** — all API calls now use shared session
- **CRITICAL: `complete_audit()` signature updated** to pass client instance

**Upgrade Priority:** All v1.0.31 users should upgrade immediately.

---

## [1.0.31] - 2026-04-01 - Submission Sanitization & Transparency

### Added
- **Explicit whitelist sanitization** — `_sanitize_test_details()` in `audit_client.py`
- **`--dry-run` flag** — Shows exact API payload before any submission
- **`--yes` flag warning** — 70-character banner + 3-second pause for safety

---

## [1.0.30] - 2026-04-01 - Consent Flow

### Fixed
- Explicit consent prompt **before** reading `IDENTITY.md`/`SOUL.md`
- Name detection improvements (markdown formats, strict validation)

---

## [1.0.29] - 2026-03-31 - Scanner Balance

### Fixed
- Name detection bug for markdown-formatted names (Eddie's report)
- Private key storage documented: `~/.openclaw/workspace/.agentshield/`

---

## [1.0.28] - 2026-03-31

### Fixed
- Documentation cleanup for scanner compatibility

---

## [1.0.27] - 2026-03-31

### Fixed
- Production backend status clarified
- Developer scripts removed from user package

---

## [1.0.26] - 2026-03-31

### Fixed
- Test pattern storage externalized to `agentshield_attack_patterns.json`
- Path consistency unified

---

## [1.0.25] - 2026-03-27

### Fixed
- Timestamp parsing compatibility (HTTP date, JWT Unix, ISO all supported)
- API timeout adjustments

---

## [1.0.24] - 2026-03-26

### Added
- Production API endpoint live at `agentshield.live`
- PostgreSQL backend

---

## [1.0.23] - 2026-03-24

### Fixed
- **Critical: API URL Bug in Trust Handshake** — `complete_handshake.py` double `/api/` path
- `--yes` flag for non-interactive mode
- Improved dependencies documentation

---

For full technical details, see [`skill/CHANGELOG.md`](skill/CHANGELOG.md).

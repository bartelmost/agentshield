# Changelog

All notable changes to AgentShield will be documented in this file.

## v1.5.0 — 2026-06-03

### Added
- **MCP Server** — AgentShield now available as a Model Context Protocol server at `https://agentshield.live/mcp`
- MCP tools: `audit_agent`, `verify_agent`, `search_registry`, `check_revocation`, `agentshield_status`
- Works with Claude Desktop, Cursor, VS Code Copilot, Continue.dev — one config line, no install required
- Netlify proxy route `/mcp` → backend
- MCP documentation in `docs.html` and `api.html`
## [1.0.0] - 2026-02-20

### Added
- Initial release of AgentShield
- Agent security audit system with Ed25519 authentication
- Certificate issuance and verification
- Three security tiers: HARDENED, PROTECTED, BASIC
- REST API for audit and verification
- Python skill for OpenClaw integration
- Public verification endpoint
- 90-day certificate validity

### Security
- Challenge-response authentication
- Ed25519 cryptographic signatures
- Rate limiting on all endpoints

## [0.1.0] - 2026-02-15

### Added
- Initial prototype
- Basic audit flow
- Test certificate generation

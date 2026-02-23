# Changelog

All notable changes to AgentShield will be documented in this file.

## [v6.1] - 2026-02-23

### Added
- **Rate Limiting**: Two-tier system (3 free audits/hour, then 1/hour)
- **Rate Limit Status Endpoint**: `GET /api/rate-limit/status`
- **Rate Limit Headers**: `X-RateLimit-*` headers in all responses
- **Certificate Store**: SQLite/PostgreSQL database for persistent certificates
- **Public Verification**: `GET /api/verify/:agent_id` (no auth required)
- **Updated Documentation**: API docs for v6.1 features

### Changed
- **Secret Leakage Test**: Enhanced with 15+ patterns (OpenAI, AWS, GitHub, etc.)
- **Backend API**: Now returns rate limit info in all agent audit responses
- **Documentation**: Updated README with v6.1 features and API reference

### Backend
- Added in-memory rate limit store (Redis-compatible for production)
- Added SQLite database for certificate persistence
- Added rate limit tracking table
- Enhanced error responses with retry information

---

## [v6.0] - 2026-02-20

### Added
- **Agent Audit System**: 3-step Ed25519 challenge-response authentication
- **Certificate Generation**: Cryptographically signed Ed25519 certificates
- **Security Tiers**: HARDENED (90-100), PROTECTED (75-89), BASIC (50-74), UNVERIFIED (<50)
- **Auto-Detection**: Automatically detect agent name, platform, version
- **Certificate Verification**: Public endpoint to verify agent certificates
- **Frontend**: Verification UI at /verify.html
- **Documentation**: Complete API documentation for all endpoints

### Features
- Token Optimizer with PDF reports
- Code Security Scanner with 15+ vulnerability patterns
- Ed25519 keypair generation
- Challenge-response authentication
- 90-day certificate validity

---

## [v5.4] - 2026-02-19

### Added
- Initial public release
- Legacy audit endpoint `/api/audit`
- Basic security scoring
- Promo code system (BETA5, LAUNCH1-10)

---

## Upcoming (v6.2)

### Planned
- [ ] PostgreSQL support for production
- [ ] Redis rate limiting
- [ ] Additional security tests (4 mock tests → real)
- [ ] Webhook notifications for certificate expiry
- [ ] Batch verification API
- [ ] x402 payment integration

---

**Legend:**
- ✅ Implemented
- ⚠️ Partial/Mock
- ❌ Not yet implemented

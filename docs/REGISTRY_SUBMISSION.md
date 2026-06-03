# Skill Submission: agentshield-audit

**Name:** agentshield-audit  
**Version:** 1.0.0  
**Category:** Security  
**Author:** @bartelmost  

## Description

Security auditing and certificate verification for AI agents. Provides Ed25519-based identity verification with cryptographically signed certificates for inter-agent trust.

**Key Features:**
- Automated security audits (5 test categories)
- Ed25519 challenge-response authentication
- Cryptographically signed certificates
- Public verification endpoint
- 90-day certificate validity
- Three security tiers: HARDENED / PROTECTED / BASIC

## Installation

```bash
# Via GitHub (direct)
openclaw skills install https://github.com/bartelmost/agentshield

# Once in registry:
openclaw skills install agentshield-audit
```

## Quick Start

```bash
# Audit your agent
python ~/.openclaw/skills/agentshield-audit/scripts/initiate_audit.py \
  --name "MyAgent" \
  --platform telegram

# Verify another agent
python ~/.openclaw/skills/agentshield-audit/scripts/verify_peer.py agent_abc123
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/agent-audit/initiate` | POST | Start audit |
| `/api/agent-audit/challenge` | POST | Complete auth |
| `/api/agent-audit/complete` | POST | Get certificate |
| `/api/verify/:agent_id` | GET | Public verification |

**Base URL:** https://agentshield-api-bartel-fe94823ceeea.herokuapp.com

## Testing

Tested on OpenClaw v2026.2.19-2 with Python 3.11 on Ubuntu.

**Test Results:**
- ✅ Initiate audit: Working
- ✅ Challenge-response: Working  
- ✅ Certificate issuance: Working
- ✅ Public verification: Working

## Repository

https://github.com/bartelmost/agentshield

## Pricing

- **Beta:** Free with codes (BETA5, LAUNCH1-10)
- **Production:** $0.50 per audit

## License

MIT License - See LICENSE file

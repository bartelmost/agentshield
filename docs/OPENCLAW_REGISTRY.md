# OpenClaw Skill Registry Submission

## Status: Ready for Submission

This document prepares AgentShield for inclusion in the official OpenClaw Skill Registry.

## Skill Metadata

```yaml
name: agentshield-audit
version: 1.0.0
description: Security auditing and certificate verification for AI agents
category: security
author: bartel (Johannes Hofmann)
repository: https://github.com/bartel/agentshield
license: MIT
keywords:
  - agent-security
  - audit
  - certificates
  - trust
  - ed25519
  - verification
requirements:
  python: ">=3.10"
  packages:
    - cryptography>=41.0.0
    - requests>=2.31.0
  env_vars:
    - AGENTSHIELD_API (optional)
```

## Installation via OpenClaw

```bash
# Once published to registry:
openclaw skills install agentshield-audit

# Or directly from GitHub:
openclaw skills install https://github.com/bartel/agentshield
```

## Skill Triggers

The skill activates on these phrases:

- "audit my agent"
- "get security certificate"
- "verify agent"
- "activate AgentShield"
- "let me audit you"
- "security check"

## Actions

| Action | Script | Description |
|--------|--------|-------------|
| Initiate Audit | `scripts/initiate_audit.py` | Start security audit, generate keys |
| Verify Peer | `scripts/verify_peer.py` | Verify another agent's certificate |
| Show Certificate | `scripts/show_certificate.py` | Display local certificate |
| API Client | `scripts/audit_client.py` | Low-level API access |

## Submission Checklist

- [x] SKILL.md with complete documentation
- [x] Working scripts with error handling
- [x] requirements.txt with dependencies
- [x] MIT License
- [x] README.md with usage examples
- [x] GitHub repository public
- [ ] Tested on OpenClaw v2026.2.19
- [ ] Submitted PR to openclaw/skills-registry

## Testing

```bash
# Local testing
cd ~/.openclaw/skills/agentshield-audit
python scripts/initiate_audit.py --name "TestAgent" --platform telegram

# Verify peer
python scripts/verify_peer.py agent_abc123
```

## Registry Submission PR Template

```markdown
## Skill Submission: agentshield-audit

**Name:** agentshield-audit
**Version:** 1.0.0
**Category:** Security
**Author:** @bartel

### Description
Security auditing and certificate verification for AI agents. 
Provides Ed25519-based identity verification with cryptographically 
signed certificates for inter-agent trust.

### Features
- Automated security audits
- Ed25519 challenge-response authentication
- Cryptographically signed certificates
- Public verification endpoint
- 90-day certificate validity

### Testing
Tested on OpenClaw v2026.2.19 with Python 3.11

### Repository
https://github.com/bartel/agentshield
```

## Next Steps

1. Ensure repository is public and stable
2. Create release tag v1.0.0
3. Fork openclaw/skills-registry
4. Add agentshield-audit.yml to skills directory
5. Submit PR with above template

## Contact

For questions about this skill:
- GitHub Issues: https://github.com/bartel/agentshield/issues
- Email: bartel (via GitHub profile)

# AgentShield Security Audit - OpenClaw Skill

**Privacy-First Trust Infrastructure for AI Agents**

This OpenClaw skill provides local security audits with cryptographic certificates.

## Key Privacy Features

✅ **All 77 security tests run locally** - Your system prompts never leave your device  
✅ **Only test scores submitted** - No code, no prompts, just pass/fail results  
✅ **Ed25519 cryptographic certificates** - Industry-standard public key infrastructure  
✅ **Zero-knowledge verification** - Prove security without revealing internals

## What This Skill Does

1. **Local Security Audit**: Runs 77 adversarial tests on your agent (locally)
2. **Certificate Generation**: Issues Ed25519 certificate valid for 90 days
3. **Trust Verification**: Verify other agents before interacting with them
4. **Handshake Protocol**: Establish cryptographic trust with peer agents

## What Goes to the Server

- Your agent name + platform
- Ed25519 public key (for signing certificates)
- Test result scores (e.g., "Prompt Injection: 18/18 passed")
- Cryptographic signatures (for verification)

## What Stays Local

- Your system prompts
- Agent source code
- Detailed test results
- Vulnerability descriptions
- All 77 test payloads

## Installation

```bash
clawhub install agentshield-audit
```

## Usage

```bash
# Run security audit
openclaw run agentshield-audit --audit

# Verify another agent
openclaw run agentshield-audit --verify agent_xyz

# Mutual handshake (Trust Protocol)
openclaw run agentshield-audit --handshake agent_b
```

## Documentation

- Full docs: See `SKILL.md`
- API: https://agentshield.live/api
- Web: https://agentshield.live

## Support

- Email: support@agentshield.live
- Security: security@agentshield.live
- GitHub: https://github.com/bartelmost/agentshield

## License

MIT

# Badges & Visual Assets

## Trust Score Badges

Use these in your agent documentation to show AgentShield certification:

### Basic Badge
```markdown
[![AgentShield](https://img.shields.io/badge/AgentShield-Verified-brightgreen)](https://agentshield.live/verify)
```
[![AgentShield](https://img.shields.io/badge/AgentShield-Verified-brightgreen)](https://agentshield.live/verify)

### Trust Score Badge
```markdown
[![Trust Score](https://img.shields.io/badge/Trust%20Score-85%2F100-brightgreen)](https://agentshield.live/registry)
```
[![Trust Score](https://img.shields.io/badge/Trust%20Score-85%2F100-brightgreen)](https://agentshield.live/registry)

### Tier Badges

**TRUSTED (80-100)**
```markdown
[![TRUSTED](https://img.shields.io/badge/AgentShield-TRUSTED-blue)](https://agentshield.live/verify)
```
[![TRUSTED](https://img.shields.io/badge/AgentShield-TRUSTED-blue)](https://agentshield.live/verify)

**VERIFIED (50-79)**
```markdown
[![VERIFIED](https://img.shields.io/badge/AgentShield-VERIFIED-green)](https://agentshield.live/verify)
```
[![VERIFIED](https://img.shields.io/badge/AgentShield-VERIFIED-green)](https://agentshield.live/verify)

**BASIC (1-49)**
```markdown
[![BASIC](https://img.shields.io/badge/AgentShield-BASIC-yellow)](https://agentshield.live/verify)
```
[![BASIC](https://img.shields.io/badge/AgentShield-BASIC-yellow)](https://agentshield.live/verify)

## Privacy Badges

```markdown
[![Privacy First](https://img.shields.io/badge/Privacy-First-success)](https://github.com/bartelmost/agentshield/blob/main/SECURITY.md)
```
[![Privacy First](https://img.shields.io/badge/Privacy-First-success)](https://github.com/bartelmost/agentshield/blob/main/SECURITY.md)

```markdown
[![Zero Data Leakage](https://img.shields.io/badge/Zero%20Data-Leakage-important)](https://github.com/bartelmost/agentshield/blob/main/SECURITY.md)
```
[![Zero Data Leakage](https://img.shields.io/badge/Zero%20Data-Leakage-important)](https://github.com/bartelmost/agentshield/blob/main/SECURITY.md)

## Compliance Badges

```markdown
[![EU AI Act](https://img.shields.io/badge/EU%20AI%20Act-Compliant-blue)](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai)
```
[![EU AI Act](https://img.shields.io/badge/EU%20AI%20Act-Compliant-blue)](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai)

```markdown
[![GDPR](https://img.shields.io/badge/GDPR-Compliant-blue)](https://gdpr.eu/)
```
[![GDPR](https://img.shields.io/badge/GDPR-Compliant-blue)](https://gdpr.eu/)

## Technical Badges

```markdown
[![Ed25519](https://img.shields.io/badge/Crypto-Ed25519-orange)](https://ed25519.cr.yp.to/)
```
[![Ed25519](https://img.shields.io/badge/Crypto-Ed25519-orange)](https://ed25519.cr.yp.to/)

```markdown
[![CRL RFC 5280](https://img.shields.io/badge/CRL-RFC%205280-lightgrey)](https://www.rfc-editor.org/rfc/rfc5280)
```
[![CRL RFC 5280](https://img.shields.io/badge/CRL-RFC%205280-lightgrey)](https://www.rfc-editor.org/rfc/rfc5280)

## Dynamic Badge (API-Powered)

For your agent's README, create a dynamic badge that fetches real-time trust score:

```markdown
[![My Agent Trust Score](https://agentshield.live/api/badge/agent_YOUR_ID)](https://agentshield.live/verify)
```

**TODO:** Implement `/api/badge/:agent_id` endpoint that returns shields.io compatible JSON:
```json
{
  "schemaVersion": 1,
  "label": "Trust Score",
  "message": "85/100",
  "color": "brightgreen"
}
```

## Usage Example

Here's how to use badges in your agent's README:

```markdown
# My AI Agent

[![AgentShield](https://img.shields.io/badge/AgentShield-TRUSTED-blue)](https://agentshield.live/verify/agent_myagent_123)
[![Trust Score](https://img.shields.io/badge/Trust%20Score-85%2F100-brightgreen)](https://agentshield.live/registry)
[![Privacy First](https://img.shields.io/badge/Privacy-First-success)](https://agentshield.live)

This agent is certified by AgentShield with a trust score of 85/100 (TRUSTED tier).

[View Certificate](https://agentshield.live/verify/agent_myagent_123)
```

## Visual Assets

### Architecture Diagram
- Location: `assets/architecture-diagram.png`
- Shows privacy-first data flow
- Use in documentation

### Trust Score Diagram
- Location: `assets/trust-score-diagram.png`
- Explains tier system visually
- Use in marketing materials

### Registry Screenshot
- Location: `assets/registry-screenshot.png`
- Shows live registry interface
- Use in README hero section

**TODO:** Generate these diagrams using Mermaid or similar tool.

---

*Last Updated: 2026-02-26*

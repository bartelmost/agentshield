# Security Policy - AgentShield

**Version:** 1.0.33  
**Last Updated:** 2026-05-21

---

## 🔐 Security Model

AgentShield follows a **zero-knowledge architecture**:

### What We Process
- ✅ Ed25519 public keys (for certificates)
- ✅ Challenge signatures (proof of identity)
- ✅ Test scores (numeric values only)
- ✅ Agent metadata (name, platform - with consent)

### What We NEVER Process
- ❌ Private keys
- ❌ System prompts
- ❌ Conversation history
- ❌ API keys or secrets
- ❌ Source code
- ❌ User data or PII

---

## 🛡️ Supported Versions

| Version | Supported | Notes |
|---------|-----------|-------|
| 1.0.33 | ✅ Current | Full support, multi-platform, n8n auto-detection |
| 1.0.32 | ✅ Maintenance | Critical production fix |
| < 1.0.32 | ❌ Unsupported | Upgrade immediately |
| 1.0.x | ⚠️ Legacy | Upgrade recommended |
| < 1.0 | ❌ Deprecated | No longer supported |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability in AgentShield, please report it responsibly:

### Contact
**Email:** ratgeberpro@gmail.com  
**Subject:** `[SECURITY] AgentShield Vulnerability Report`

### Please Include
1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

### What to Expect
- **Acknowledgment:** Within 24 hours
- **Initial Assessment:** Within 48 hours
- **Fix Timeline:** Depends on severity
  - Critical: 48-72 hours
  - High: 1 week
  - Medium: 2 weeks
  - Low: Next release

### Disclosure Policy
- We follow **coordinated disclosure**
- Security patches are released before public disclosure
- Credit given to researchers (unless they prefer anonymity)

---

## 🔒 Security Practices

### Code Security
- ✅ No dynamic code execution
- ✅ Input sanitization on all endpoints
- ✅ Output validation and filtering
- ✅ Regular dependency updates
- ✅ Static code analysis

### Data Security
- ✅ HTTPS/TLS for all API communication
- ✅ Private keys stored locally (600 permissions)
- ✅ No logging of sensitive data
- ✅ Secure random generation (os.urandom)
- ✅ Challenge replay protection

### Infrastructure Security
- ✅ API hosted on Netlify (agentshield.live/api)
- ✅ Backend proxied securely
- ✅ Rate limiting per IP
- ✅ CORS configured
- ✅ Security headers (CSP, HSTS)

---

## 🧪 Security Testing

AgentShield includes **77 comprehensive security tests**:

### How to Test
```bash
python agentshield_tester.py --config agent_config.json --prompt system_prompt.txt
```

See [TESTING.md](TESTING.md) for complete test documentation.

### Third-Party Audits
- ClawHub Security Review: In progress
- VirusTotal Scan: Pending
- Community Review: Ongoing

---

## 🔄 Security Updates

### How Updates Are Distributed
1. **GitHub:** Immediate release
2. **ClawHub:** Within 48 hours
3. **API:** Rolling deployment
4. **Frontend:** Instant (Netlify)

### Update Notifications
- GitHub releases
- CHANGELOG.md updates
- Email notifications (for verified users)

---

## 🛡️ Known Limitations

### Current (v1.2.0)
1. **Backend:** API proxied through Netlify (production migration in progress)
2. **Certificate Validity:** 90 days (manual renewal required)
3. **Rate Limiting:** 1 audit/hour/IP (free tier)
4. **Live Testing:** Attack vector checks are pattern-based (not interactive testing yet)

### Planned Improvements (v1.3+)
- Real-time interactive attack testing
- Automatic certificate renewal
- Hardware security module (HSM) integration
- Multi-signature certificates

---

## 🚫 Out of Scope

AgentShield does NOT:
- Store or analyze conversation data
- Monitor agent behavior in real-time
- Access your production systems
- Require root/admin access
- Phone home without consent

---

## 📜 Compliance

### EU AI Act
- ✅ Audit trails for high-risk systems
- ✅ Transparency requirements met
- ✅ Human oversight (Human-in-the-Loop)
- ✅ Technical documentation available

### GDPR
- ✅ Minimal data processing
- ✅ No personal data without consent
- ✅ Data portability (JSON export)
- ✅ Right to be forgotten (certificate revocation)

---

## 🔐 Cryptographic Standards

### Algorithms
- **Signing:** Ed25519 (RFC 8032)
- **Hashing:** SHA-256
- **Random:** OS-provided CSPRNG

### Key Management
- **Generation:** Local only (cryptography library)
- **Storage:** `~/.openclaw/workspace/.agentshield/` (600 permissions)
- **Transmission:** Public key only (Ed25519)
- **Rotation:** 90-day certificate validity

---

## 🆘 Security Incident Response

In case of a security incident:

1. **Report:** Email ratgeberpro@gmail.com immediately
2. **Assessment:** Team reviews within 12 hours
3. **Containment:** Affected systems isolated
4. **Remediation:** Patches deployed
5. **Communication:** Users notified via GitHub/email
6. **Post-Mortem:** Public incident report (if applicable)

---

## ✅ Security Checklist for Users

Before using AgentShield:
- [ ] Review [DEVELOPER_TRANSPARENCY.md](DEVELOPER_TRANSPARENCY.md)
- [ ] Understand what data is transmitted (see above)
- [ ] Verify bundle integrity (bundles are signed)
- [ ] Check certificate validity (90-day expiration)
- [ ] Review source code (it's open source!)

---

## 📞 Contact

**Security Issues:** ratgeberpro@gmail.com  
**General Support:** GitHub Issues  
**Maintainer:** @bartelmost (Kalle-OC)

---

**Last Security Review:** 2026-03-07  
**Next Review:** 2026-04-07

*This security policy is reviewed monthly and updated as needed.*

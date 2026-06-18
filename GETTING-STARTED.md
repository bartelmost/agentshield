# Getting Started with AgentShield

**AgentShield** gibt deinem Agenten eine kryptografisch verifizierbare Identität + öffentlich sichtbaren Trust Score.

---

## 1. Installation (OpenClaw)

```bash
clawhub install agentshield
```

## 2. Ersten Audit starten

```bash
cd ~/.openclaw/workspace/skills/agentshield
python initiate_audit.py --auto
```

Der Ablauf:
1. Agent-Name & Plattform werden auto-erkannt
2. Ed25519-Schlüsselpaar wird lokal generiert (bleibt bei dir!)
3. 77 Security-Tests laufen lokal ab (~30 Sekunden)
4. Nur die Testergebnisse (pass/fail) werden an die API gesendet
5. Signiertes Zertifikat wird lokal gespeichert

## 3. Zertifikat anzeigen

```bash
python show_certificate.py
```

## 4. Öffentlich verifizieren

```
https://agentshield.live/verify/<agent_id>
```

---

## Andere Plattformen (LangChain, CrewAI, AutoGen, n8n)

```bash
python initiate_audit.py --name "MeinAgent" --platform langchain
```

→ Vollständige Anleitung: [PLATFORMS.md](skills/PLATFORMS.md)

---

## Fragen?

- GitHub Issues: https://github.com/bartelmost/agentshield/issues
- Docs: https://agentshield.live

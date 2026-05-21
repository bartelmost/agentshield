FROM python:3.11-slim

LABEL org.opencontainers.image.title="AgentShield Audit"
LABEL org.opencontainers.image.description="Trust Infrastructure for AI Agents – security audits & certificates"
LABEL org.opencontainers.image.version="1.0.33"
LABEL org.opencontainers.image.url="https://agentshield.live"
LABEL org.opencontainers.image.source="https://github.com/bartelmost/agentshield"
LABEL org.opencontainers.image.licenses="MIT"

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy skill scripts
COPY agentshield/ ./agentshield/
COPY skill/SKILL.md skill/PRIVACY.md skill/PLATFORMS.md ./

# Data directory for keys & certificates (mount as volume)
RUN mkdir -p /data/.agentshield
ENV AGENTSHIELD_DATA_DIR=/data/.agentshield

# Default: show help
ENTRYPOINT ["python", "-m", "agentshield.initiate_audit"]
CMD ["--help"]

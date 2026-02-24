"""
AgentShield Audit Scripts

Command-line tools for AgentShield security audits and certificate management.
"""

__version__ = "1.0.0"

# Make scripts importable as a package
from pathlib import Path

SCRIPTS_DIR = Path(__file__).parent
WORKSPACE_DIR = SCRIPTS_DIR.parent.parent.parent
AGENTSHIELD_DIR = WORKSPACE_DIR / ".agentshield"

__all__ = [
    "SCRIPTS_DIR",
    "WORKSPACE_DIR", 
    "AGENTSHIELD_DIR",
]

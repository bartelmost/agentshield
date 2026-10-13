#!/usr/bin/env python3
"""Refuse to treat an unverified peer as safe.

OpenClaw does not call this automatically. Run it before sharing data or
delegating work to another agent id.
"""
import sys
from verify_peer import verify_agent


def main() -> None:
    if len(sys.argv) != 2:
        print("Usage: python3 preflight_peer.py agent_id")
        sys.exit(2)
    result = verify_agent(sys.argv[1])
    if not result.get("valid"):
        print(result.get("reason") or "not valid")
        sys.exit(1)
    tier = result.get("trust_tier") or "UNVERIFIED"
    score = result.get("score")
    if result.get("revoked") or tier in ("UNVERIFIED", "UNKNOWN", None) or score is None:
        print(f"blocked: tier={tier} score={score}")
        sys.exit(2)
    print(f"allowed: tier={tier} score={score}")


if __name__ == "__main__":
    main()

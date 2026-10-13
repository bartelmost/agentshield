#!/usr/bin/env python3
"""Complete one side of a Trust Handshake.

The live API stores one signature at a time. A session key exists only after
both agents have signed. This script signs the local side and stops there.
"""
import argparse
import base64
import json
import os
import sys
from pathlib import Path

try:
    from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
    import requests
except ImportError:
    print("pip install cryptography requests")
    sys.exit(1)

API = os.getenv("AGENTSHIELD_API", "https://agentshield.live").rstrip("/")


def agentshield_dir() -> Path:
    return Path.home() / ".openclaw" / "workspace" / ".agentshield"


def load_key() -> Ed25519PrivateKey:
    path = agentshield_dir() / "agent.key"
    if not path.exists():
        print(f"No key at {path}. Run initiate_audit.py first.")
        sys.exit(1)
    raw = path.read_bytes()
    if raw[:1] in (b"{", b"["):
        encoded = json.loads(raw.decode()).get("private_key")
        if not encoded:
            print("agent.key has no private_key field.")
            sys.exit(1)
        raw = base64.b64decode(encoded)
    if len(raw) != 32:
        print(f"Ed25519 private key must be 32 bytes, got {len(raw)}.")
        sys.exit(1)
    return Ed25519PrivateKey.from_private_bytes(raw)


def load_agent_id() -> str:
    path = agentshield_dir() / "certificate.json"
    if not path.exists():
        print(f"No certificate at {path}. Run initiate_audit.py first.")
        sys.exit(1)
    return json.loads(path.read_text())["payload"]["sub"]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--handshake-id", required=True)
    args = parser.parse_args()

    key = load_key()
    agent_id = load_agent_id()
    print(f"Agent ID: {agent_id}")

    status_url = f"{API}/api/trust-handshake/status/{args.handshake_id}"
    status_res = requests.get(status_url, timeout=30)
    if status_res.status_code != 200 or not status_res.headers.get("content-type", "").startswith("application/json"):
        print(f"Cannot read handshake status ({status_res.status_code}).")
        print(status_res.text[:300])
        sys.exit(1)
    status = status_res.json()
    if status.get("status") == "completed":
        print("Handshake already completed. Session key is on the server response and is not printed here.")
        return

    requester = status.get("requester") or {}
    target = status.get("target") or {}
    if requester.get("agent_id") == agent_id:
        challenge = requester.get("challenge")
    elif target.get("agent_id") == agent_id:
        challenge = target.get("challenge")
    else:
        print("This agent is not part of the handshake.")
        sys.exit(1)
    if not challenge:
        print("No challenge for this agent.")
        sys.exit(1)

    signature = base64.b64encode(key.sign(challenge.encode("utf-8"))).decode()
    complete = requests.post(
        f"{API}/api/trust-handshake/complete",
        json={
            "handshake_id": args.handshake_id,
            "agent_id": agent_id,
            "signed_challenge": signature,
        },
        timeout=30,
    )
    try:
        body = complete.json()
    except ValueError:
        print(complete.text[:400])
        sys.exit(1)

    state = body.get("status")
    if complete.status_code == 202 or state == "pending_mutual_signature":
        waiting = body.get("waiting_for", "the other agent")
        print(f"Your signature is stored. Waiting for {waiting}.")
        print("No session key yet. A handshake is not trust until both sides sign.")
        return
    if state == "completed":
        print("Handshake complete. Both signatures checked. Session key was issued and is not printed.")
        return
    print(f"Handshake not complete ({complete.status_code}): {body.get('error') or body.get('message') or body}")
    sys.exit(1)


if __name__ == "__main__":
    main()

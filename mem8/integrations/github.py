"""GitHub integration helpers for mem8.

Provides a thin wrapper around the GitHub CLI (gh) where available,
and graceful fallbacks for environments without gh.
"""

from __future__ import annotations

import os
import shutil
import subprocess
from typing import Optional

from ..core.utils import detect_gh_active_login


def gh_available() -> bool:
    return shutil.which("gh") is not None


def whoami(host: str = "github.com") -> Optional[str]:
    """Return the active login according to gh auth status."""
    return detect_gh_active_login(host)


def get_token(host: str = "github.com") -> Optional[str]:
    """Get a token via gh auth token or environment.

    Order:
    - gh auth token --hostname <host>
    - GH_TOKEN / GITHUB_TOKEN environment
    """
    # Attempt gh first
    if gh_available():
        try:
            result = subprocess.run(
                ["gh", "auth", "token", "--hostname", host],
                capture_output=True,
                text=True,
                timeout=3,
                check=False,
            )
            token = (result.stdout or "").strip()
            if token:
                return token
        except Exception:
            pass
    # Fallback to env
    return os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")


def ensure_login(host: str = "github.com") -> bool:
    """Best-effort check that gh has an active login for host."""
    return whoami(host) is not None


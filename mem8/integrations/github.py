"""GitHub integration helpers for mem8.

Provides a thin wrapper around the GitHub CLI (gh) where available,
and graceful fallbacks for environments without gh.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
from typing import Optional, Dict, Any

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
        except subprocess.TimeoutExpired:
            # Silent fail, move to env fallback
            pass
        except subprocess.CalledProcessError:
            # gh command failed, move to env fallback
            pass
        except Exception:
            # Any other error, move to env fallback
            pass
    # Fallback to env
    return os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")


def ensure_login(host: str = "github.com") -> bool:
    """Best-effort check that gh has an active login for host."""
    return whoami(host) is not None


def get_current_repo_info() -> Optional[Dict[str, str]]:
    """Get current repository info using gh CLI.

    Returns dict with 'owner' and 'name' keys, or None if not available.
    This returns the owner of the current repository, which may differ
    from the authenticated user.
    """
    if not gh_available():
        return None

    try:
        result = subprocess.run(
            ["gh", "repo", "view", "--json", "owner,name"],
            capture_output=True,
            text=True,
            timeout=5,
            check=False,
        )
        if result.returncode == 0:
            repo_data = json.loads(result.stdout)
            return {
                "owner": repo_data["owner"]["login"],
                "name": repo_data["name"]
            }
    except (subprocess.TimeoutExpired, json.JSONDecodeError, KeyError, Exception):
        pass

    return None


def get_consistent_github_context(prefer_authenticated_user: bool = True) -> Dict[str, Optional[str]]:
    """Get consistent GitHub context for mem8 operations.

    Args:
        prefer_authenticated_user: If True, prefer authenticated user over repo owner

    Returns:
        Dict with 'username', 'org', 'repo' keys. Values may be None.
    """
    auth_user = whoami()
    repo_info = get_current_repo_info()

    if prefer_authenticated_user:
        # Use authenticated user as primary, repo info as secondary
        username = auth_user
        org = auth_user if auth_user else (repo_info["owner"] if repo_info else None)
        repo = repo_info["name"] if repo_info else None
    else:
        # Use repo owner as primary, authenticated user as fallback
        username = auth_user
        org = repo_info["owner"] if repo_info else auth_user
        repo = repo_info["name"] if repo_info else None

    return {
        "username": username,
        "org": org,
        "repo": repo,
        "auth_user": auth_user,
        "repo_owner": repo_info["owner"] if repo_info else None
    }


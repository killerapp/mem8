#!/usr/bin/env python3
"""
Interactive init tests using minimal prompts to avoid template installation.
"""

import os
import sys
import subprocess
from pathlib import Path

import pytest


@pytest.mark.cli
def test_init_interactive_minimal(tmp_path):
    """Run `mem8 init -i` answering with 'none' to skip templates and accept defaults."""
    ws = tmp_path / "ws"
    ws.mkdir()
    os.chdir(ws)

    # Initialize a git repo to avoid extra prompts (skip test if git missing)
    import shutil
    if not shutil.which("git"):
        pytest.skip("git not available in test environment")
    subprocess.run(["git", "init"], check=True, capture_output=True)
    subprocess.run(["git", "config", "user.name", "Test User"], check=True)
    subprocess.run(["git", "config", "user.email", "test@example.com"], check=True)

    # Provide minimal interactive answers:
    # 1) template -> none
    # 2) shared dir -> accept default (blank line)
    input_text = "none\n\n"

    env = os.environ.copy()
    env["PYTHONPATH"] = str(Path(__file__).parent.parent)
    result = subprocess.run(
        [sys.executable, "-m", "mem8.cli", "init", "-i"],
        capture_output=True,
        text=True,
        input=input_text,
        env=env,
        encoding="utf-8",
        errors="replace",
    )

    # Should not crash
    assert result.returncode == 0
    # Thoughts directory should be created
    assert (ws / "thoughts").exists()
    # Shared link or fallback directory should exist
    assert (ws / "thoughts" / "shared").exists()

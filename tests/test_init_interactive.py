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
    # 2) username -> accept default (blank line)
    # 3) enable shared -> n (default is no)
    input_text = "none\n\nn\n"

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
    # Shared should NOT be created when disabled (default)
    assert not (ws / "thoughts" / "shared").exists()


@pytest.mark.cli
def test_init_with_shared_enabled(tmp_path):
    """Test enabling shared thoughts during init."""
    ws = tmp_path / "ws"
    shared_path = tmp_path / "shared_mem8"
    ws.mkdir()
    shared_path.mkdir()
    os.chdir(ws)

    # Initialize a git repo to avoid extra prompts (skip test if git missing)
    import shutil
    if not shutil.which("git"):
        pytest.skip("git not available in test environment")
    subprocess.run(["git", "init"], check=True, capture_output=True)
    subprocess.run(["git", "config", "user.name", "Test User"], check=True)
    subprocess.run(["git", "config", "user.email", "test@example.com"], check=True)

    # Provide interactive answers:
    # 1) template -> none
    # 2) username -> testuser
    # 3) enable shared -> y
    # 4) shared path -> <shared_path>
    input_text = f"none\ntestuser\ny\n{shared_path}\n"

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
    # User directory should be created with the provided username
    assert (ws / "thoughts" / "testuser").exists()
    # Shared link should be created (could be symlink or directory on Windows)
    assert (ws / "thoughts" / "shared").exists()
    # Shared thoughts root should be created
    assert (shared_path / "thoughts").exists()
    # Verify subdirectories were created
    assert (shared_path / "thoughts" / "shared" / "decisions").exists()
    assert (shared_path / "thoughts" / "shared" / "plans").exists()

    # Check that output includes link type information
    output = result.stdout + result.stderr
    # Should mention junction on Windows or symlink on Unix
    import platform
    if platform.system().lower() == 'windows':
        # Could be junction or fallback directory
        assert any(term in output.lower() for term in ['junction', 'directory', 'fallback'])
    else:
        assert 'symbolic link' in output.lower() or 'symlink' in output.lower()

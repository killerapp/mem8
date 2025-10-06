"""Toolbelt verification and tracking for CLI tools."""

import subprocess
import platform
from pathlib import Path
from datetime import datetime
from typing import Dict, Any
import yaml


def check_verified_tools() -> Dict[str, Any]:
    """Check and return verified CLI tools and OS info.

    Returns:
        Dictionary with 'os' and 'tools' keys containing system and tool information.
    """
    # Define toolbelt to check
    toolbelt = {
        'git': {'command': 'git --version', 'parse': lambda x: x.split()[-1] if x else None},
        'gh': {'command': 'gh --version', 'parse': lambda x: x.split('\n')[0].split()[-1] if x else None},
        'docker': {'command': 'docker --version', 'parse': lambda x: x.split()[2].rstrip(',') if x else None},
        'uv': {'command': 'uv --version', 'parse': lambda x: x.split()[-1] if x else None},
        'npm': {'command': 'npm --version', 'parse': lambda x: x.strip() if x else None},
        'python': {'command': 'python --version', 'parse': lambda x: x.split()[-1] if x else None},
        'node': {'command': 'node --version', 'parse': lambda x: x.strip().lstrip('v') if x else None},
        'curl': {'command': 'curl --version', 'parse': lambda x: x.split('\n')[0].split()[1] if x else None},
        'ast-grep': {'command': 'ast-grep --version', 'parse': lambda x: x.strip() if x else None},
    }

    # Collect OS details
    os_info = {
        'system': platform.system(),
        'release': platform.release(),
        'version': platform.version(),
        'machine': platform.machine(),
        'processor': platform.processor() or 'Unknown',
        'python_version': platform.python_version()
    }

    # Check each tool
    verified = {}
    for tool, config in toolbelt.items():
        try:
            result = subprocess.run(
                config['command'].split(),
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode == 0:
                output = result.stdout or result.stderr
                version = config['parse'](output) if output else 'available'
                verified[tool] = version
        except (subprocess.TimeoutExpired, FileNotFoundError, Exception):
            # Tool not available
            pass

    return {
        'generated_at': datetime.now().isoformat(),
        'os': os_info,
        'tools': verified
    }


def save_verified_tools(workspace_dir: Path = None) -> Path:
    """Check tools and save to .mem8/verified_tools.yaml.

    Args:
        workspace_dir: Directory to save in (defaults to current directory)

    Returns:
        Path to saved file
    """
    if workspace_dir is None:
        workspace_dir = Path.cwd()

    mem8_dir = workspace_dir / '.mem8'
    mem8_dir.mkdir(exist_ok=True)
    output_file = mem8_dir / 'verified_tools.yaml'

    data = check_verified_tools()

    with open(output_file, 'w') as f:
        yaml.dump(data, f, default_flow_style=False, sort_keys=False)

    return output_file

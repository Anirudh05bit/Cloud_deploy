
import re
from urllib.parse import urlparse

import httpx

from app.core.config import settings


GITHUB_API = "https://api.github.com"


def parse_github_url(repository_url: str) -> tuple[str, str]:
    """
    Extract the owner and repository name from a GitHub URL.
    Supports HTTPS GitHub URLs and .git suffixes.
    """
    parsed = urlparse(repository_url.strip())

    if parsed.hostname not in {"github.com", "www.github.com"}:
        raise ValueError("Only GitHub repository URLs are supported.")

    parts = [part for part in parsed.path.strip("/").split("/") if part]

    if len(parts) != 2:
        raise ValueError(
            "Expected a repository URL like https://github.com/owner/repo"
        )

    owner, repo = parts
    repo = re.sub(r"\.git$", "", repo)

    if not owner or not repo:
        raise ValueError("Invalid GitHub repository URL.")

    return owner, repo


async def inspect_repository(repository_url: str, branch: str = "main") -> dict:
    """
    Inspect a public GitHub repository and return repository metadata,
    the latest commit on the requested branch, and detected project files.
    """
    owner, repo = parse_github_url(repository_url)

    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if settings.GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"

    async with httpx.AsyncClient(timeout=15.0, headers=headers) as client:
        repo_response = await client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}"
        )

        if repo_response.status_code == 404:
            raise ValueError(
                "Repository not found or it is private/inaccessible."
            )

        repo_response.raise_for_status()
        repo_data = repo_response.json()

        commit_response = await client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}/commits",
            params={"sha": branch, "per_page": 1},
        )
        commit_response.raise_for_status()
        commits = commit_response.json()

        if not commits:
            raise ValueError(
                f"No commits were found on branch '{branch}'."
            )

        latest_commit = commits[0]

        contents_response = await client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}/contents",
            params={"ref": branch},
        )
        contents_response.raise_for_status()
        contents = contents_response.json()

    if not isinstance(contents, list):
        raise ValueError("Could not read the repository's root directory.")

    root_files = [
        item["name"]
        for item in contents
        if item.get("type") == "file"
    ]

    runtime = detect_runtime(root_files)

    return {
        "full_name": repo_data["full_name"],
        "repository_url": repo_data["html_url"],
        "default_branch": repo_data["default_branch"],
        "requested_branch": branch,
        "latest_commit_hash": latest_commit["sha"],
        "latest_commit_message": latest_commit["commit"]["message"],
        "root_files": root_files,
        "detected_runtime": runtime,
        "private": repo_data["private"],
    }


def detect_runtime(root_files: list[str]) -> str:
    """
    Basic runtime detection from files in the repository root.
    This is a preliminary heuristic, not a complete build analysis.
    """
    files = set(root_files)

    if "package.json" in files:
        if "vite.config.js" in files or "vite.config.ts" in files:
            return "node-vite"
        return "node"

    if "requirements.txt" in files or "pyproject.toml" in files:
        return "python"

    if "pom.xml" in files:
        return "java-maven"

    if "build.gradle" in files or "build.gradle.kts" in files:
        return "java-gradle"

    if "go.mod" in files:
        return "go"

    if "Cargo.toml" in files:
        return "rust"

    if "Dockerfile" in files:
        return "docker"

    return "unknown"


import pytest

from app.services.github_service import (
    detect_runtime,
    parse_github_url,
)


def test_detect_vite_runtime():
    assert detect_runtime(
        ["package.json", "vite.config.js", "src"]
    ) == "node-vite"


def test_detect_node_runtime():
    assert detect_runtime(
        ["package.json", "server.js"]
    ) == "node"


def test_detect_python_runtime():
    assert detect_runtime(
        ["requirements.txt", "main.py"]
    ) == "python"


def test_detect_java_maven_runtime():
    assert detect_runtime(
        ["pom.xml", "src"]
    ) == "java-maven"


def test_unknown_runtime():
    assert detect_runtime(
        ["README.md", "LICENSE"]
    ) == "unknown"


def test_parse_github_url():
    assert parse_github_url(
        "https://github.com/Anirudh05bit/ecommerce-api"
    ) == ("Anirudh05bit", "ecommerce-api")


def test_parse_github_url_with_git_suffix():
    assert parse_github_url(
        "https://github.com/Anirudh05bit/ecommerce-api.git"
    ) == ("Anirudh05bit", "ecommerce-api")


def test_reject_non_github_url():
    with pytest.raises(ValueError):
        parse_github_url("https://example.com/owner/repo")


def test_reject_invalid_github_url():
    with pytest.raises(ValueError):
        parse_github_url("https://github.com/owner")

from pathlib import Path

SUPPORTED_EXTENSIONS={'.py','.java','.js','.ts','jsx','.tsx','.html','.css','.cpp','.c#','.c','.ipynb','.json','.md'}
IGNORED_DIRECTORIES={
    ".git", 
    "__pycache__", 
    "node_modules", 
    ".venv", 
    "venv", 
    ".pytest_cache",
    ".idea",
    ".vscode"
}

def scan_repository(repository_path:str):
    repository_path=Path(repository_path)
    files=[]
    for path in repository_path.rglob("*"):
        if not path.is_file():
            continue
        if any(part in IGNORED_DIRECTORIES for part in path.parts):
            continue
        if path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            continue
        files.append({
            "path":str(path.relative_to(repository_path)),
            "absolute_path":str(path.resolve()),
            "extension":path.suffix.lower(),
            "size":path.stat().st_size
        })
    return files
            
    
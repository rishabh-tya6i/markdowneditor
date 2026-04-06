const KEY = "recent_files";

export function getRecentFiles(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function addRecentFile(path: string) {
  const files = getRecentFiles().filter(f => f !== path);
  files.unshift(path);
  localStorage.setItem(KEY, JSON.stringify(files.slice(0, 10)));
}

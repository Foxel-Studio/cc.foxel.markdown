export function parentPath(path: string): string {
  const norm = path.replace(/\\/g, '/').replace(/\/+$/, '') || '/';
  const index = norm.lastIndexOf('/');
  if (index <= 0) return '/';
  return norm.slice(0, index);
}

export function joinPath(dir: string, name: string): string {
  const base = dir === '/' ? '' : dir.replace(/\/+$/, '');
  const parts: string[] = [];
  for (const part of `${base}/${name}`.replace(/\\/g, '/').split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') parts.pop();
    else parts.push(part);
  }
  return `/${parts.join('/')}`;
}

/** Turn a markdown image or link target into an absolute URL or a VFS path. */
export function resolveAssetPath(filePath: string, src: string | undefined): string | null {
  if (!src) return null;
  const value = src.trim();
  if (!value || /^(https?:|data:|blob:|mailto:)/i.test(value)) return value || null;
  let path = value;
  try {
    path = decodeURI(value);
  } catch {
    path = value;
  }
  path = path.split(/[?#]/)[0];
  if (!path) return null;
  if (path.startsWith('/')) return path;
  return joinPath(parentPath(filePath), path);
}

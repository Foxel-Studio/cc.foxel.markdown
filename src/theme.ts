import { useEffect, useState } from 'react';

function readDark(): boolean {
  try {
    const theme = window.parent.document.documentElement.getAttribute('data-theme');
    if (theme === 'dark' || theme === 'light') return theme === 'dark';
  } catch {
    // The plugin frame is same-origin. Fall back to the system theme.
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

export function useDark(): boolean {
  const [dark, setDark] = useState(readDark);
  useEffect(() => {
    const apply = () => {
      const next = readDark();
      setDark((prev) => (prev === next ? prev : next));
    };
    apply();
    let root: HTMLElement | null = null;
    try {
      root = window.parent.document.documentElement;
    } catch {
      root = null;
    }
    const observer = root ? new MutationObserver(apply) : null;
    observer?.observe(root as HTMLElement, { attributes: true, attributeFilter: ['data-theme'] });
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    media?.addEventListener?.('change', apply);
    return () => {
      observer?.disconnect();
      media?.removeEventListener?.('change', apply);
    };
  }, []);
  return dark;
}

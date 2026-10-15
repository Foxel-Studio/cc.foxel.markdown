import { useEffect, useState } from 'react';
import type { Components } from 'react-markdown';
import type { FoxelHostApi, VfsApi } from './contract';
import { t } from './i18n';
import { resolveAssetPath } from './paths';
import { decodeText, MAX_TEXT_BYTES } from './text';
import { useDark } from './theme';

function vfs(): VfsApi {
  const api = window.__FOXEL_EXTERNALS__?.foxelApi?.vfs;
  if (!api?.readFile) throw new Error('No file API');
  return api;
}

function MarkdownImage({ filePath, host, src, alt }: { filePath: string; host: FoxelHostApi; src?: string; alt?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const target = resolveAssetPath(filePath, src);
    if (!target) return;
    if (/^(https?:|data:|blob:)/i.test(target)) {
      setUrl(target);
      return;
    }
    let disposed = false;
    const load = host.getTempLink
      ? host.getTempLink(target)
      : Promise.resolve(host.getStreamUrl?.(target) || vfs().streamUrl(target));
    void load.then((next) => {
      if (!disposed) setUrl(next);
    }).catch(() => {
      if (!disposed) setUrl(null);
    });
    return () => { disposed = true; };
  }, [filePath, host, src]);
  if (!url) return null;
  return <img src={url} alt={alt || ''} />;
}

export function MarkdownView({ filePath, host }: { filePath: string; host: FoxelHostApi }) {
  const dark = useDark();
  const [source, setSource] = useState('');
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let disposed = false;
    setPhase('loading');
    void vfs().readFile(filePath).then((data) => {
      if (disposed) return;
      setSource(decodeText(data));
      setPhase('ready');
    }).catch((error: unknown) => {
      if (disposed) return;
      const code = error instanceof Error ? error.message : '';
      setMessage(code === 'binary'
        ? t('binary')
        : code === 'too-large'
          ? t('tooLarge', { size: MAX_TEXT_BYTES / (1024 * 1024) })
          : (error instanceof Error ? error.message : String(error)));
      setPhase('error');
    });
    return () => { disposed = true; };
  }, [filePath]);

  if (phase === 'loading') return <div className="foxel-md-status">{t('loading')}</div>;
  if (phase === 'error') return <div className="foxel-md-status is-error">{message}</div>;

  const Markdown = window.__FOXEL_EXTERNALS__?.ReactMarkdown;
  if (!Markdown) return <div className="foxel-md-status is-error">{t('missing')}</div>;

  const components: Components = {
    a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
    img: ({ src, alt }) => <MarkdownImage filePath={filePath} host={host} src={typeof src === 'string' ? src : undefined} alt={alt} />,
  };

  return (
    <div className={dark ? 'foxel-md is-dark' : 'foxel-md'}>
      <article>
        <Markdown components={components}>{source}</Markdown>
      </article>
    </div>
  );
}

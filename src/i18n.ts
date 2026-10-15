const zh = {
  loading: '正在打开…',
  binary: '这不是文本文件。',
  tooLarge: '文件超过 {size} MB，无法预览。',
  missing: '宿主的 react-markdown 还没有加载。',
} as const;

const en: Record<keyof typeof zh, string> = {
  loading: 'Opening…',
  binary: 'This is not a text file.',
  tooLarge: 'Files larger than {size} MB cannot be previewed.',
  missing: 'Host react-markdown is not loaded.',
};

export type MessageKey = keyof typeof zh;

function lang(): 'zh' | 'en' {
  return document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'zh';
}

export function t(key: MessageKey, params?: Record<string, string | number>): string {
  const template = (lang() === 'en' ? en : zh)[key];
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => String(params[name] ?? `{${name}}`));
}

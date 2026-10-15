import { createRoot, type Root } from 'react-dom/client';
import type { PluginContext } from './contract';
import { MarkdownView } from './MarkdownView';
import './styles.css';

const roots = new WeakMap<HTMLElement, Root>();

function mount(container: HTMLElement, ctx: PluginContext) {
  const root = roots.get(container) ?? createRoot(container);
  roots.set(container, root);
  root.render(<MarkdownView filePath={ctx.filePath} host={ctx.host} />);
  return () => {
    root.unmount();
    roots.delete(container);
  };
}

const register = window.FoxelRegister;
if (!register) throw new Error('FoxelRegister is missing');
register({ mount });

export interface FoxelHostApi {
  close: () => Promise<void>;
  showMessage: (type: 'success' | 'error' | 'info' | 'warning', content: string) => void;
  getTempLink?: (filePath: string) => Promise<string>;
  getStreamUrl?: (filePath: string) => string;
}

export interface PluginContext {
  filePath: string;
  urls: { downloadUrl: string; streamUrl?: string };
  host: FoxelHostApi;
}

export type PluginCleanup = () => void | Promise<void>;

export interface RegisteredPlugin {
  mount: (container: HTMLElement, ctx: PluginContext) => void | PluginCleanup | Promise<void | PluginCleanup>;
  unmount?: (container: HTMLElement) => void | Promise<void>;
}

export interface VfsApi {
  readFile: (path: string) => Promise<ArrayBuffer>;
  streamUrl: (path: string) => string;
}

export interface FoxelExternals {
  React: typeof import('react');
  ReactDOM: typeof import('react-dom/client');
  ReactMarkdown?: typeof import('react-markdown').default;
  foxelApi: { vfs: VfsApi };
}

declare global {
  interface Window {
    __FOXEL_EXTERNALS__?: FoxelExternals;
    FoxelRegister?: (plugin: RegisteredPlugin) => void;
  }
}

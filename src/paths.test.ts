import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { resolveAssetPath } from './paths';
import { decodeText } from './text';

test('manifest is a file-only markdown viewer', () => {
  const manifest = JSON.parse(readFileSync(new URL('../manifest.json', import.meta.url), 'utf8')) as {
    key: string;
    name: string;
    frontend: { supportedExts: string[]; capabilities: string[]; openApp: boolean };
  };
  assert.equal(manifest.key, 'cc.foxel.markdown');
  assert.equal(manifest.name, 'markdown');
  assert.deepEqual(manifest.frontend.supportedExts, ['md', 'markdown']);
  assert.deepEqual(manifest.frontend.capabilities, ['react-markdown']);
  assert.equal(manifest.frontend.openApp, false);
});

test('resolves markdown asset paths from the file directory', () => {
  assert.equal(resolveAssetPath('/docs/guide.md', './img/a.png'), '/docs/img/a.png');
  assert.equal(resolveAssetPath('/docs/sub/guide.md', '../cover.jpg'), '/docs/cover.jpg');
  assert.equal(resolveAssetPath('/docs/guide.md', '/static/a.png'), '/static/a.png');
  assert.equal(resolveAssetPath('/docs/guide.md', 'https://example.com/a.png'), 'https://example.com/a.png');
  assert.equal(resolveAssetPath('/docs/guide.md', 'img/a%20b.png'), '/docs/img/a b.png');
});

test('decodes utf-8 markdown and rejects binary files', () => {
  assert.equal(decodeText(new TextEncoder().encode('# 标题').buffer), '# 标题');
  assert.throws(() => decodeText(Uint8Array.from([0x23, 0x00]).buffer), /binary/);
});

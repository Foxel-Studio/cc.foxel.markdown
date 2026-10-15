# markdown

只通过 `.md` 和 `.markdown` 文件打开，用来查看，不编辑。渲染组件是宿主的 `react-markdown`：清单声明 `react-markdown` 能力后，插件帧会把它放到 `window.__FOXEL_EXTERNALS__.ReactMarkdown`。这个包不打包 react-markdown。

相对路径的图片会按当前文件所在目录去取临时链接。外链在新窗口打开。主题跟随宿主的明暗模式。二进制内容和超过 2 MB 的文件不会打开。

```bash
cd plugins/cc.foxel.markdown
bun install
bun test
bun run foxpkg
```

安装包是 `dist/cc.foxel.markdown.foxpkg`。

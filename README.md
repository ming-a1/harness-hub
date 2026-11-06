# 插件集成（Plugin Hub）

一个把多个 DSH 插件合成一个面板的集成插件，标签页顺序：**会话清理 → 技能 → 令牌库 → 插件**（默认打开会话清理）。

| 标签页 | 内容 |
| --- | --- |
| 会话清理 | `@local/session-cleanup` 的面板与 `/session-cleanup/*` 路由、`session_cleanup` 工具 |
| 技能 | `@local/skill-gallery` 的技能卡片与 `/skill-gallery/*` 路由 |
| 令牌库 | `@local/token-vault` 的 Host 路线（`/token-vault/*` 与 `token_vault`、`vault_sh` 工具），界面由本插件重写 |
| 插件 | 其它插件注册到侧边栏的面板，点击即可打开 |

## 收集侧边栏面板

**只收集第三方插件**，官方面板（插件管理 `plugins`、自动化任务 `schedules`）保持原样、既不收集也不隐藏：

- **动态发现**：`ctx.slots.entriesOfSlot('sidebar.panellist')` 读取侧栏面板注册项，`ctx.slots.subscribe('sidebar.panellist', …)` 订阅增删；新装插件新增的侧栏按钮会立刻出现在「插件」页签，无需刷新。官方 id 名单在 `createPanelStore` 的 `official` 集合里，宿主新增官方面板时在这里补一个 id。
- **按行隐藏**：`shell.overlay` 里的一个纯样式条目，按每个被收集面板当前的 `aria-label` 生成逐行规则（`nav:has(> button svg[data-hub-glyph]) > button[aria-label="…"]:not(:has(svg[data-hub-glyph])){display:none!important}`），因此只会隐藏被收进「插件」页签的那些行。没有第三方面板时不输出任何规则，「插件」页签也随之隐藏。
- **打开方式**：点击行调用 `ctx.layout.selectPanel(id)` 切到该面板；「插件集成」图标始终留在侧边栏，点它即可回到集成页。
- 若运行环境没有 `entriesOfSlot`，本插件不会输出隐藏规则，侧边栏行为完全不变（功能自动降级）。

容错：整页、每个页签、每个收集来的图标都包在 `ErrorBoundary` 里。某个页签或某个插件的图标渲染失败时，只该处显示「这个面板暂时不可用」和错误文本，其余页签照常可用，不会再整页空白（此前把服务方法直接当 store 传给 `useSyncExternalStore`，渲染抛错导致整页被宿主移出，就是空白的原因）。

已知边界：隐藏规则依赖宿主侧栏的 `nav > button > span > svg` 结构、按钮的 `aria-label` 与 `:has()` 支持（Chromium 105+/Safari 15.4+/Firefox 121+）；宿主改结构时按钮会重新出现，但「插件」页签仍可用。收集范围只限 `sidebar.panellist`，不涉及设置分区、头部按钮等其它注册点。

## 组成

- `index.js`：Host 半，用 `ctx.plugin()` 把 `host/` 下三个功能插件挂成子插件，各自保留原有 `inject` 声明。
- `host/`、`lib/`：三个插件 Host 半与其库文件的副本（路由、工具、扫描/清理/存储实现）。
- `client.js`：**生成产物**（`tools/assemble-client.py` 输出），负责唯一的 `main` 面板、`sidebar.panellist` 图标、侧栏收集与各浮层注册。
  - 会话清理、技能两段来自各自插件 `client.js` 的组件，原样内嵌在 IIFE 中，只把「注册自己的面板」换成 `mount(ctx)`；
  - 令牌库一段是本插件重写的界面（`tools/vault-pane.js`）：标题 + 说明、新增表单（名称 / 令牌值 / 备注）、令牌卡片（`$NAME` 徽标、长度掩码、更新时间、备注）、复制 `$NAME` / 替换值 / 两步确认删除、底部 `vault_sh` 示例（可复制），全部走原有 Host 路由。
- `cordis.patch.yml`：插入 `harness-hub` 行，并把 `skill-gallery`、`session-cleanup`、`token-vault` 三行置为 `disabled`（原包仍保留在配置里，可随时改回）。

## 重新生成 Client

```bash
python3 harness-hub/tools/assemble-client.py   # 读取 ../skill-gallery、../session-cleanup 与 tools/vault-pane.js
```

生成后 `node --check harness-hub/client.js` 校验语法；页面刷新即加载新 revision。

## 数据与兼容

三条路由路径、令牌文件位置、会话回收站位置均与原插件一致，已有数据无需迁移。令牌值仍然只由 Host 读取，界面只显示长度掩码。

## 安装

```bash
# 由 dsh 的 plugin_manager 安装该目录为 bundle
```

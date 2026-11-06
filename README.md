# 插件集成（Plugin Hub）

一个把多个 DSH 插件合成一个面板的集成插件：**会话清理 → 技能 → 令牌库**，其后自动追加其它插件的面板（例如「IM 机器人控制台」），默认打开会话清理。

| 标签页 | 内容 |
| --- | --- |
| 会话清理 | `@local/session-cleanup` 的面板与 `/session-cleanup/*` 路由、`session_cleanup` 工具 |
| 技能 | `@local/skill-gallery` 的技能卡片与 `/skill-gallery/*` 路由 |
| 令牌库 | `@local/token-vault` 的 Host 路线（`/token-vault/*` 与 `token_vault`、`vault_sh` 工具），界面由本插件重写 |
| （自动追加） | 其它插件注册到侧边栏 + `main` 的面板，按 order 排在令牌库之后，内容直接内嵌 |

## 把其它插件的面板并进来

侧栏只保留「插件集成」一个入口，其它插件注册的面板直接变成集成页里的**并列页签**：

- **发现**：`ctx.slots.entriesOfSlot('sidebar.panellist')` 拿侧栏按钮，`ctx.slots.entriesOfSlot('main')` 按同一个 id 找到对应的主面板条目；两者都在才算一个可内嵌面板。订阅 `sidebar.panellist` 与 `main` 两个槽，装/卸插件即刻增删页签，无需刷新。
- **内嵌渲染**：插槽渲染器不对外提供「渲染别人的条目」的入口，所以本插件按渲染器的组合同样合成 props——本页拿到的标准 props（`useSessions`、`useWorkspaces` 等原样透传）+ 条目自己的 `locale` 译器、`store`（`StoreHandle.create()` 得到实例后提供 `useStore`/`actions`）、`inject` 面（含 `hooks` 自动转成 `use<Name>`）。缓存只存这些派生项，标准 props 每次渲染重新透传。
- **官方插件不动**：`createPanelStore` 里的 `official` 集合（`plugins`、`schedules`）既不收集也不隐藏。宿主新增官方面板时在这里补 id。
- **隐藏被收集的行**：`shell.overlay` 里的样式条目按每个被收集面板当前的 `aria-label` 生成逐行规则，只隐藏已并进来的那几个；没有第三方插件时零输出、零副作用。
- **降级**：面板若声明了子插槽（需要渲染器自己的 `renderSlot`），无法内嵌，页签里给出「单独打开」按钮走宿主原生面板；内嵌渲染抛错时由错误边界兜住，同一页签显示错误文本 + 「单独打开」，其余页签不受影响。

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

本机开发目录可直接由 `plugin_manager` 以 `install_bundle` 安装（bundle 会被 link 进 profile）。

## 从插件市场安装 / 更新

```text
https://raw.githubusercontent.com/ming-a1/harness-hub/main/plugin-market.json
```

固定版本索引（与本次发布内容一一对应）：

```text
https://raw.githubusercontent.com/ming-a1/harness-hub/3709c1a61b89d0ff942184232812b0921405f2f8/plugin-market.json
```

仓库：<https://github.com/ming-a1/harness-hub>

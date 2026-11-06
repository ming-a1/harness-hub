# 插件集成（Plugin Hub）

侧栏只保留一个入口，里面的页签是**其它插件自己的面板**——本插件不包含任何功能代码，也不复制别人的源码。

## 工作方式（全动态）

- **发现**：`ctx.slots.entriesOfSlot('sidebar.panellist')` 拿侧栏按钮，`ctx.slots.entriesOfSlot('main')` 按同一个 id 找主面板；两者都在才算一个可集成面板。
- **跟随增删**：订阅 `sidebar.panellist` 与 `main` 两个槽。装插件 → 页签立刻出现；停用/卸载 → 页签立刻消失，不留残影。
- **渲染**：直接用该插件注册的组件（`entry.component`），props 按渲染器的组合方式合成：本页拿到的标准 props 原样透传 + 条目自己的 `locale` 译器 + `store`（`StoreHandle.create()` 后提供 `useStore`/`actions`）+ `inject`（其 `hooks` 自动转 `use<Name>`）。派生项按条目缓存，标准 props 每次渲染重新透传。
- **官方插件不动**：`createPanelStore` 里的 `shipped` 集合（`plugins`、`schedules`）不收集也不隐藏。
- **隐藏被收集的行**：`shell.overlay` 里一个样式条目，按每个被收集面板当前的 `aria-label` 生成逐行规则，只隐藏已并进来的按钮；没有可集成面板时零输出。
- **降级**：面板若声明了子插槽（需要渲染器私有绑定）→ 页签显示「单独打开」；内嵌渲染抛错 → 错误边界兜住、只坏该页签，其余页签照常。

## 组成

| 文件 | 作用 |
| --- | --- |
| `index.js` | Host 半为空壳（`apply() {}`）：能力来自被集成的插件本身 |
| `client.js` | 唯一的侧栏入口 + `main` 面板 + 收集与内嵌逻辑（约 440 行，手写维护） |
| `cordis.patch.yml` | 只插入 `harness-hub` 一行，不改动其它插件行 |
| `locale/*.json`、`icon.svg` | 插件管理里的标题、描述与图标 |

## 被集成的插件

会话清理、技能、令牌库等插件各自仍是独立包，各自带 Host 路由与工具；它们注册的侧栏按钮会被收进本插件并隐藏，面板内容直接内嵌。想要某个插件的页签，就安装并启用那个插件；不想要，停用它即可。

## 更新链接

```text
https://raw.githubusercontent.com/ming-a1/harness-hub/main/plugin-market.json
```

#!/usr/bin/env python3
"""Build harness-hub/client.js from the three section sources.

The hub owns the panel and the tab chrome; each section is a source fragment:

* `tools/vault-pane.js` — authored here, rendered with the hub translator.
* `../skill-gallery/client.js` — copied verbatim into its own IIFE; everything
  before its `apply` is kept and a `mount(ctx)` export is appended instead of
  its own panel registration.
* `../session-cleanup/client.js` — same treatment.

Run from anywhere: `python3 harness-hub/tools/assemble-client.py`.
"""
import pathlib

HUB = pathlib.Path(__file__).resolve().parent.parent
WORKSPACE = HUB.parent

SOURCES = {
    'skills': WORKSPACE / 'skill-gallery/client.js',
    'cleanup': WORKSPACE / 'session-cleanup/client.js',
}

VARS = {'skills': 'SkillGallery', 'cleanup': 'SessionCleanup'}

CUT = {
    'skills': '\n    function apply(ctx) {',
    'cleanup': '\n    function apply(ctx) {',
}

MOUNT = {
    'skills': """
      function mount(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'harness-hub: skill-gallery dictionaries');
        const t = ctx.locale.bind(NS);
        const selection = createStore(null);
        const revision = createStore(0);
        const Page = createPage(ctx, t, selection, revision);
        const Overlay = createOverlay(ctx, t, selection, revision);
        return { Page, Overlay, t, NS };
      }

      return { mount };
""",
    'cleanup': """
      function mount(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'harness-hub: session-cleanup dictionaries');
        const t = ctx.locale.bind(NS);
        const archiveSession = (id, options) => ctx.uiWorkspace.archiveSession(id, options);
        const unarchiveSession = (id) => ctx.uiWorkspace.unarchiveSession(id);
        const refreshSessions = () => ctx.sessions.refresh();
        return {
          Page: SessionCleanupPage,
          PurgeOverlayHost,
          DeleteSessionMenuItem,
          t,
          NS,
          props: { archiveSession, unarchiveSession, refreshSessions },
        };
      }

      return { mount };
""",
}

HEAD = r'''/**
 * Client half of the Harness Hub bundle. GENERATED — edit the section sources
 * and `tools/assemble-client.py`, then re-run it.
 *
 * One sidebar entry, one central panel, three tabs: Session Cleanup, Skill
 * Gallery and Token Vault. The cleanup and skill sections are carried over from
 * the standalone bundles that used to register their own sidebar entries; the
 * vault section is authored here on top of the same Host routes, replacing the
 * old settings page with a hub-styled pane.
 */
window.__ModuleLoader__.load({
  id: '@local/harness-hub',
  factory(require) {
    const React = require('react');
    const { useCallback, useEffect, useState, useSyncExternalStore } = React;
    const h = React.createElement;

    const HUB_ID = 'harness-hub';
    const HUB_NS = 'harness-hub';

    const HUB_ZH = {
      title: '插件集成',
      panel: '插件集成',
      'tab.cleanup': '会话清理',
      'tab.skills': '技能',
      'tab.vault': '令牌库',
      'tab.plugins': '插件',
      'panels.title': '插件面板',
      'panels.lead': '其它插件在侧栏注册的面板都收在这里，点一下就能打开；侧栏只保留「插件集成」一个入口。',
      'panels.empty': '还没有其它插件面板。',
      'panels.open': '打开',
      'panels.paneCrashed': '这一页渲染出错，插件集成仍可使用。',
      'crash.title': '这个面板暂时不可用',
      'crash.hint': '插件集成捕获了渲染错误，其余页签仍可使用；刷新页面可重试。',

      'vault.title': '令牌库',
      'vault.lead':
        '令牌只保存在本机文件里，不会出现在会话中。会话用 vault_sh 把令牌注入命令的环境变量，命令回显的令牌也会被自动隐藏。',
      'vault.add.title': '新增令牌',
      'vault.add.hint': '名称可用字母、数字与 _ . -，例如 GITHUB_TOKEN',
      'vault.field.name': '名称',
      'vault.field.namePlaceholder': 'GITHUB_TOKEN',
      'vault.field.value': '令牌值',
      'vault.field.valuePlaceholder': '粘贴令牌，保存后不再显示',
      'vault.field.note': '备注（可选）',
      'vault.field.notePlaceholder': '这个令牌用来做什么',
      'vault.action.save': '保存令牌',
      'vault.action.saving': '保存中…',
      'vault.list.title': '已保存的令牌',
      'vault.list.count': '共 {count} 个',
      'vault.list.loading': '正在读取…',
      'vault.list.empty': '还没有保存任何令牌。',
      'vault.row.mask': '•••••••• {count} 字符',
      'vault.row.copy': '复制 $NAME',
      'vault.row.copied': '已复制',
      'vault.row.replace': '替换值',
      'vault.row.delete': '删除',
      'vault.row.confirmDelete': '确认删除',
      'vault.row.updated': '更新于 {when}',
      'vault.edit.newValue': '新令牌值',
      'vault.edit.keep': '留空则保留当前值',
      'vault.edit.save': '保存修改',
      'vault.edit.cancel': '取消',
      'vault.usage.line': '任意会话里用 vault_sh 跑命令就能用到令牌：令牌只出现在该命令的环境变量里，会话里只写 $NAME。',
      'vault.usage.copy': '复制示例',
      'vault.usage.copied': '已复制示例',
      'vault.error.nameRequired': '请先填写令牌名称。',
      'vault.error.nameInvalid': '名称需以字母或下划线开头，只能包含字母、数字与 _ . -。',
      'vault.error.valueRequired': '请填写令牌值。',
      'vault.error.copyFailed': '复制失败，请手动选择文本。',
      'vault.notice.saved': '已保存 {name}。',
      'vault.notice.updated': '已更新 {name}。',
      'vault.notice.deleted': '已删除 {name}。',
    };

    const HUB_EN = {
      title: 'Plugin Hub',
      panel: 'Plugin Hub',
      'tab.cleanup': 'Sessions',
      'tab.skills': 'Skills',
      'tab.vault': 'Tokens',
      'tab.plugins': 'Plugins',
      'panels.title': 'Plugin panels',
      'panels.lead': 'Sidebar panels that other plugins register are collected here and open in one click; the sidebar keeps the single Hub entry.',
      'panels.empty': 'No other plugin panels yet.',
      'panels.open': 'Open',
      'panels.paneCrashed': 'This tab failed to render; the hub keeps working.',
      'crash.title': 'This panel is unavailable',
      'crash.hint': 'The hub caught a render error; other tabs keep working. Refresh to retry.',

      'vault.title': 'Token vault',
      'vault.lead':
        'Tokens live in a local file and never enter a session. `vault_sh` exports one into a command environment, and the output is scrubbed if a command echoes it.',
      'vault.add.title': 'Add a token',
      'vault.add.hint': 'Letters, digits and _ . - only — for example GITHUB_TOKEN',
      'vault.field.name': 'Name',
      'vault.field.namePlaceholder': 'GITHUB_TOKEN',
      'vault.field.value': 'Token value',
      'vault.field.valuePlaceholder': 'Paste the token; it is never shown again',
      'vault.field.note': 'Note (optional)',
      'vault.field.notePlaceholder': 'What this token is for',
      'vault.action.save': 'Save token',
      'vault.action.saving': 'Saving…',
      'vault.list.title': 'Saved tokens',
      'vault.list.count': '{count} total',
      'vault.list.loading': 'Loading…',
      'vault.list.empty': 'No tokens stored yet.',
      'vault.row.mask': '•••••••• {count} chars',
      'vault.row.copy': 'Copy $NAME',
      'vault.row.copied': 'Copied',
      'vault.row.replace': 'Replace value',
      'vault.row.delete': 'Delete',
      'vault.row.confirmDelete': 'Confirm delete',
      'vault.row.updated': 'Updated {when}',
      'vault.edit.newValue': 'New value',
      'vault.edit.keep': 'Leave blank to keep the current value',
      'vault.edit.save': 'Save changes',
      'vault.edit.cancel': 'Cancel',
      'vault.usage.line': 'Use a token from any session by running the command with `vault_sh`: the value stays in that command environment, so the session only shows $NAME.',
      'vault.usage.copy': 'Copy example',
      'vault.usage.copied': 'Example copied',
      'vault.error.nameRequired': 'Enter a token name first.',
      'vault.error.nameInvalid': 'Start with a letter or underscore; letters, digits and _ . - only.',
      'vault.error.valueRequired': 'Enter the token value.',
      'vault.error.copyFailed': 'Copy failed — select the text manually.',
      'vault.notice.saved': 'Saved {name}.',
      'vault.notice.updated': 'Updated {name}.',
      'vault.notice.deleted': 'Deleted {name}.',
    };

    const HUB_CSS = [
      '.hub-page{display:flex;flex-direction:column;width:100%;height:100%;min-height:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary)}',
      '.hub-head{flex:none;display:flex;align-items:center;gap:12px;height:50px;padding:0 clamp(14px,2.6vw,24px);border-bottom:.5px solid var(--dsw-alias-border-l1)}',
      '.hub-title{flex:none;font-size:13px;font-weight:600;line-height:1;white-space:nowrap}',
      '.hub-tabs{display:flex;align-items:center;gap:2px;min-width:0;padding:3px;border-radius:11px;background:var(--dsw-alias-bg-layer-2);overflow-x:auto;scrollbar-width:none}',
      '.hub-tabs::-webkit-scrollbar{display:none}',
      '.hub-tab{appearance:none;border:0;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:13px;line-height:1;height:28px;padding:0 12px;border-radius:8px;cursor:pointer;white-space:nowrap;transition:background .12s ease,color .12s ease}',
      '.hub-tab:hover{color:var(--dsw-alias-label-primary)}',
      '.hub-tab:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}',
      '.hub-tab-active,.hub-tab-active:hover{background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-weight:500;box-shadow:inset 0 0 0 .5px var(--dsw-alias-border-l2)}',
      '.hub-body{flex:1;min-height:0;display:flex;flex-direction:column}',
      '.hub-pane{flex:1;min-height:0;display:flex;flex-direction:column}',
      '.hub-pane-hidden{display:none}',
      '.hub-panels{flex:1;min-height:0;overflow:auto;scrollbar-gutter:stable}',
      '.hub-panels-inner{box-sizing:border-box;max-width:760px;margin:0 auto;padding:26px clamp(20px,4vw,40px) 48px;display:flex;flex-direction:column;gap:14px}',
      '.hub-panels h2{margin:0;font-size:20px;font-weight:600;line-height:28px}',
      '.hub-panels p{margin:0;color:var(--dsw-alias-label-secondary);font-size:12.5px;line-height:19px}',
      '.hub-panel-list{display:flex;flex-direction:column;gap:8px;margin:6px 0 0;padding:0;list-style:none}',
      '.hub-panel-row{box-sizing:border-box;display:flex;align-items:center;gap:12px;width:100%;min-height:48px;padding:6px 14px;border:.5px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px;text-align:left;cursor:pointer;transition:border-color .12s ease,background .12s ease}',
      '.hub-panel-row:hover{border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2)}',
      '.hub-panel-row:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-1px}',
      '.hub-panel-icon{flex:none;display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;color:var(--dsw-alias-label-secondary)}',
      '.hub-panel-name{flex:1;min-width:0;overflow-wrap:anywhere}',
      '.hub-panel-open{flex:none;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}',
      '.hub-panel-empty{margin:0;padding:6px 2px;color:var(--dsw-alias-label-tertiary);font-size:12.5px;line-height:19px}',
      '.hub-crash{flex:1;min-height:0;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:8px;padding:32px clamp(20px,4vw,40px)}',
      '.hub-crash strong{font-size:14px;font-weight:600;line-height:20px}',
      '.hub-crash span{max-width:70ch;color:var(--dsw-alias-label-secondary);font-size:12.5px;line-height:19px;overflow-wrap:anywhere}',
      '.hub-crash code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px;line-height:18px;color:var(--dsw-alias-label-tertiary);overflow-wrap:anywhere}',
    ].join('');

    /** Keeps one broken pane or icon from blanking the whole panel. */
    class HubErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { error: null };
      }

      static getDerivedStateFromError(error) {
        return { error };
      }

      componentDidCatch() {
        // The fallback below is the whole report; the hub stays usable.
      }

      render() {
        if (this.state.error === null) return this.props.children;
        const fallback = this.props.fallback;
        return typeof fallback === 'function' ? fallback(this.state.error) : fallback ?? null;
      }
    }

    function HubIcon({ size = 18, active = false }) {
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          'aria-hidden': true,
          'data-hub-glyph': 'true',
          focusable: 'false',
          style: { opacity: active ? 1 : 0.78 },
        },
        h('rect', {
          x: 3.25,
          y: 3.25,
          width: 17.5,
          height: 17.5,
          rx: 4.5,
          stroke: 'currentColor',
          strokeWidth: active ? 1.9 : 1.6,
        }),
        h('path', { d: 'M3.25 8.6h17.5', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }),
        h('circle', { cx: 6.7, cy: 5.95, r: 0.85, fill: 'currentColor' }),
        h('circle', { cx: 9.5, cy: 5.95, r: 0.85, fill: 'currentColor' }),
        h('path', {
          d: 'M7 12.3h4.2M7 15.4h8.8M7 18h6.4',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
          opacity: 0.9,
        }),
      );
    }

'''

TAIL = r'''    /** Every other plugin's sidebar panel, kept in sync with the slot registry. */
    function createPanelStore(ctx) {
      let snapshot = [];
      const listeners = new Set();
      const available = typeof ctx.slots.entriesOfSlot === 'function';
      // Shipped panels stay where the host put them; only panels other plugins
      // add are collected and hidden here. Extend this list for a new host panel.
      const official = new Set(['plugins', 'schedules']);
      const read = () => {
        const rows = [];
        if (!available) return rows;
        const seen = new Set();
        for (const entry of ctx.slots.entriesOfSlot('sidebar.panellist')) {
          const id = entry?.options?.id;
          if (typeof id !== 'string' || id === '' || id === HUB_ID || official.has(id) || seen.has(id)) continue;
          seen.add(id);
          rows.push({ id, order: entry.options.order ?? 0, label: entry.options.label, icon: entry.component });
        }
        rows.sort((left, right) => left.order - right.order);
        return rows;
      };
      const unchanged = (left, right) =>
        left.length === right.length &&
        left.every((row, index) => {
          const other = right[index];
          return (
            row.id === other.id && row.order === other.order && row.icon === other.icon && row.label === other.label
          );
        });
      return {
        available,
        getSnapshot: () => snapshot,
        subscribe(listener) {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
        refresh(force = false) {
          const next = read();
          if (!force && unchanged(snapshot, next)) return;
          snapshot = next;
          for (const listener of [...listeners]) listener();
        },
      };
    }

    /** A panel's label may be a string or a thunk resolved on every projection. */
    function panelLabel(label, id) {
      try {
        if (typeof label === 'function') {
          const value = label();
          if (typeof value === 'string' && value !== '') return value;
        }
      } catch {
        // a throwing label falls back to the panel id
      }
      return typeof label === 'string' && label !== '' ? label : id;
    }

    /** CSS attribute-value escaping for one panel label. */
    function cssLabel(label) {
      return String(label).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    }

    /** Hides exactly the collected rows; shipped panels are never matched. */
    function hideCss(rows) {
      if (rows.length === 0) return '';
      const selectors = rows.map(
        (row) =>
          'nav:has(> button svg[data-hub-glyph]) > button[aria-label="' +
          cssLabel(panelLabel(row.label, row.id)) +
          '"]:not(:has(svg[data-hub-glyph]))',
      );
      return selectors.join(',') + '{display:none!important}';
    }

    /** Frame-wide style entry: hides collected rows and survives panel switches. */
    function createSidebarStyle(panels) {
      return function HubSidebarStyle() {
        const rows = useSyncExternalStore(panels.subscribe, panels.getSnapshot);
        const css = hideCss(rows);
        return css === '' ? null : h('style', null, css);
      };
    }

    /** Switch the main column to one collected panel, keeping the hub reachable. */
    function openPanel(ctx, id) {
      try {
        ctx.layout?.selectPanel(id);
      } catch {
        // the hub stays visible when a panel cannot be selected
      }
    }

    /** Fallback a crashed pane renders instead of blanking the panel. */
    function crashedPane(t) {
      return (error) =>
        h(
          'div',
          { className: 'hub-crash' },
          h('strong', null, t('panels.paneCrashed')),
          h('span', null, t('crash.hint')),
          h('code', null, String((error && error.message) || error)),
        );
    }

    /** The panels other plugins contributed to the sidebar, as hub rows. */
    function PanelIndex({ rows, onOpen, t, slot }) {
      const hookProps = {};
      if (slot !== null && typeof slot === 'object') {
        for (const [key, value] of Object.entries(slot)) {
          if (key.startsWith('use') && typeof value === 'function') hookProps[key] = value;
        }
      }
      return h(
        'div',
        { className: 'hub-panels' },
        h(
          'div',
          { className: 'hub-panels-inner' },
          h('h2', null, t('panels.title')),
          h('p', null, t('panels.lead')),
          rows.length === 0
            ? h('p', { className: 'hub-panel-empty' }, t('panels.empty'))
            : h(
                'ul',
                { className: 'hub-panel-list' },
                rows.map((row) =>
                  h(
                    'li',
                    { key: row.id },
                    h(
                      'button',
                      { type: 'button', className: 'hub-panel-row', onClick: () => onOpen(row.id) },
                      h(
                        'span',
                        { className: 'hub-panel-icon' },
                        row.icon === undefined || row.icon === null
                          ? null
                          : h(
                              HubErrorBoundary,
                              { fallback: null },
                              h(row.icon, { size: 18, active: false, ...hookProps }),
                            ),
                      ),
                      h('span', { className: 'hub-panel-name' }, panelLabel(row.label, row.id)),
                      h('span', { className: 'hub-panel-open' }, t('panels.open')),
                    ),
                  ),
                ),
              ),
        ),
      );
    }

    function createHubPage(parts, t, ctx, panels) {
      const tabs = [
        {
          id: 'cleanup',
          render: (slot) => h(parts.cleanup.Page, { ...slot, ...parts.cleanup.props, t: parts.cleanup.t }),
        },
        { id: 'skills', render: (slot) => h(parts.skills.Page, { ...slot, t: parts.skills.t }) },
        { id: 'vault', render: () => h(VaultPane, { t }) },
        {
          id: 'plugins',
          render: (slot, rows) => h(PanelIndex, { rows, onOpen: (id) => openPanel(ctx, id), t, slot }),
        },
      ];

      return function HarnessHubPage(props) {
        const [active, setActive] = useState(tabs[0].id);
        // Collected panels come from the live slot registry, so installing a
        // plugin that adds a sidebar panel shows up here without a reload.
        const rows = useSyncExternalStore(panels.subscribe, panels.getSnapshot);
        // No third-party panel means no empty tab to offer.
        const visibleTabs = rows.length === 0 ? tabs.filter((tab) => tab.id !== 'plugins') : tabs;
        const currentTab = visibleTabs.some((tab) => tab.id === active) ? active : visibleTabs[0].id;
        // The slot hands the page its standard selector hooks (useSessions,
        // useWorkspaces, ...); every section receives them, and its own bound
        // translator wins over the hub's.
        const slot = props === null || typeof props !== 'object' ? {} : props;
        return h(
          'div',
          { className: 'hub-page' },
          h('style', null, HUB_CSS),
          h(
            'div',
            { className: 'hub-head' },
            h('span', { className: 'hub-title' }, t('title')),
            h(
              'div',
              { className: 'hub-tabs', role: 'tablist' },
              visibleTabs.map((tab) =>
                h(
                  'button',
                  {
                    key: tab.id,
                    type: 'button',
                    role: 'tab',
                    'aria-selected': tab.id === currentTab,
                    className: tab.id === currentTab ? 'hub-tab hub-tab-active' : 'hub-tab',
                    onClick: () => setActive(tab.id),
                  },
                  t('tab.' + tab.id),
                ),
              ),
            ),
          ),
          h(
            'div',
            { className: 'hub-body' },
            // Every pane stays mounted so switching tabs keeps search, filters,
            // draft text and scroll positions; only the active one is displayed.
            visibleTabs.map((tab) =>
              h(
                'div',
                { key: tab.id, className: tab.id === currentTab ? 'hub-pane' : 'hub-pane hub-pane-hidden' },
                h(HubErrorBoundary, { fallback: crashedPane(t) }, tab.render(slot, rows)),
              ),
            ),
          ),
        );
      };
    }

    /** Registers a boundary above the page so the panel never goes blank. */
    function createHubShell(parts, t, ctx, panels) {
      const HubPage = createHubPage(parts, t, ctx, panels);
      return function HarnessHubShell(props) {
        return h(HubErrorBoundary, { fallback: crashedPane(t) }, h(HubPage, props));
      };
    }

    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(HUB_NS, { zh: HUB_ZH, en: HUB_EN }), 'harness-hub: dictionaries');
      const t = ctx.locale.bind(HUB_NS);
      const parts = {
        skills: SkillGallery.mount(ctx),
        cleanup: SessionCleanup.mount(ctx),
      };
      const panels = createPanelStore(ctx);
      ctx.effect(() => {
        const offSlot =
          typeof ctx.slots.subscribe === 'function'
            ? ctx.slots.subscribe('sidebar.panellist', () => panels.refresh())
            : () => {};
        // Labels are thunks, so a locale switch re-renders the collected rows.
        const offLocale = ctx.locale.subscribe(() => panels.refresh(true));
        panels.refresh();
        return () => {
          offSlot();
          offLocale();
        };
      }, 'harness-hub: collected sidebar panels');
      const HubShell = createHubShell(parts, t, ctx, panels);

      ctx.slots.inject('main', () =>
        ctx.slots.register({ name: 'main', key: HUB_ID, locale: HUB_NS }, HubShell),
      );

      ctx.slots.inject('sidebar.panellist', () =>
        ctx.slots.register(
          { name: 'sidebar.panellist', id: HUB_ID, order: 20, locale: HUB_NS, label: () => t('panel') },
          HubIcon,
        ),
      );

      // Hiding other rows needs the registry list; without it the sidebar stays
      // untouched and every row keeps working.
      if (panels.available) {
        const SidebarStyle = createSidebarStyle(panels);
        ctx.slots.inject('shell.overlay', () =>
          ctx.slots.register({ name: 'shell.overlay', id: 'harness-hub.sidebar-style', order: 5 }, SidebarStyle),
        );
      }

      ctx.slots.inject('shell.overlay', () =>
        ctx.slots.register(
          { name: 'shell.overlay', id: 'harness-hub.skill-detail', order: 40, locale: parts.skills.NS },
          parts.skills.Overlay,
        ),
      );

      ctx.slots.inject('shell.overlay', () =>
        ctx.slots.register(
          {
            name: 'shell.overlay',
            id: 'harness-hub.purge',
            locale: parts.cleanup.NS,
            inject: () => ({ refreshSessions: parts.cleanup.props.refreshSessions }),
          },
          parts.cleanup.PurgeOverlayHost,
        ),
      );

      ctx.slots.inject('sidebar.workspaces.session.menu.item', () =>
        ctx.slots.register(
          {
            name: 'sidebar.workspaces.session.menu.item',
            id: 'harness-hub.delete-session',
            order: 500,
            locale: parts.cleanup.NS,
          },
          parts.cleanup.DeleteSessionMenuItem,
        ),
      );
    }

    return {
      inject: ['slots', 'locale', 'uiWorkspace', 'sessions'],
      apply,
    };
  },
});
'''


def factory_body(path: pathlib.Path) -> str:
    src = path.read_text(encoding='utf-8')
    head = 'factory(require) {'
    start = src.index(head) + len(head)
    for closed in ('\n  },\n});', '\n  },\n})'):
        if closed in src:
            end = src.rindex(closed) + 1
            break
    else:
        raise SystemExit('tail not found: ' + str(path))
    body = src[start:end]
    return body if body.endswith('\n') else body + '\n'


def main() -> None:
    chunks = []
    for key, path in SOURCES.items():
        body = factory_body(path)
        marker = CUT[key]
        if body.count(marker) != 1:
            raise SystemExit(f'{key}: expected one apply, found {body.count(marker)}')
        cut = body.index(marker)
        decls = body[:cut].rstrip('\n')
        chunks.append(
            f'    /* ---- section: {key} (from {path.parent.name}/client.js) ---- */\n'
            f'    const {VARS[key]} = (function (require) {{\n'
            f'{decls}\n'
            f'{MOUNT[key]}'
            f'    }})(require);\n'
        )
        print(f'{key}: kept {decls.count(chr(10)) + 1} lines')

    vault = (HUB / 'tools/vault-pane.js').read_text(encoding='utf-8').rstrip('\n')
    vault_block = '    /* ---- section: vault (authored in tools/vault-pane.js) ---- */\n' + vault + '\n'

    out = HEAD + vault_block + '\n' + ''.join(chunks) + TAIL
    target = HUB / 'client.js'
    target.write_text(out, encoding='utf-8')
    print('wrote', target, len(out.splitlines()), 'lines')


if __name__ == '__main__':
    main()

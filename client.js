/**
 * Client half of the Plugin Hub bundle.
 *
 * The hub **owns no feature code**. It registers one sidebar entry and one
 * `main` panel, then discovers whatever other plugins put in the sidebar: every
 * `sidebar.panellist` row that also has a matching `main` panel becomes a tab
 * here, rendered from that plugin's own registered component. Installing a
 * plugin adds a tab; disabling or uninstalling it removes the tab — nothing is
 * copied, so a removed plugin can never linger.
 *
 * Shipped host panels (`plugins`, `schedules`) are left exactly where they are.
 */
window.__ModuleLoader__.load({
  id: '@local/harness-hub',
  factory(require) {
    const React = require('react');
    const { useSyncExternalStore, useState } = React;
    const h = React.createElement;

    const HUB_ID = 'harness-hub';
    const NS = 'harness-hub';

    const ZH = {
      panel: '插件集成',
      title: '插件集成',
      empty: '还没有可集成的面板。安装带侧栏面板的插件后，它会自动出现在这里。',
      'tab.failed': '这个面板渲染出错，其它页签仍可使用。',
      'tab.openStandalone': '单独打开',
      'tab.unsupported': '这个面板需要宿主自己渲染（它声明了子插槽），无法内嵌。',
    };

    const EN = {
      panel: 'Plugin Hub',
      title: 'Plugin Hub',
      empty: 'Nothing to collect yet. A plugin with a sidebar panel shows up here automatically.',
      'tab.failed': 'This panel failed to render; other tabs keep working.',
      'tab.openStandalone': 'Open on its own',
      'tab.unsupported': 'This panel needs the host renderer (it declares child slots) and cannot be embedded.',
    };

    const CSS = [
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
      '.hub-empty{flex:1;display:flex;align-items:center;justify-content:center;padding:32px clamp(20px,4vw,40px);color:var(--dsw-alias-label-tertiary);font-size:12.5px;line-height:19px;text-align:center}',
      '.hub-crash{flex:1;min-height:0;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:8px;padding:32px clamp(20px,4vw,40px)}',
      '.hub-crash strong{font-size:14px;font-weight:600;line-height:20px}',
      '.hub-crash span{max-width:70ch;color:var(--dsw-alias-label-secondary);font-size:12.5px;line-height:19px;overflow-wrap:anywhere}',
      '.hub-crash code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px;line-height:18px;color:var(--dsw-alias-label-tertiary);overflow-wrap:anywhere}',
      '.hub-crash button{box-sizing:border-box;height:30px;padding:0 12px;border:.5px solid var(--dsw-alias-border-l2);border-radius:9px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:12.5px;line-height:18px;cursor:pointer}',
      '.hub-crash button:hover{background:var(--dsw-alias-bg-layer-2)}',
    ].join('');

    /** Sidebar glyph: a stacked-panels mark, drawn with the current text color. */
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

    /** Keeps one broken pane from blanking the whole panel. */
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

    /** Selector Hook factory for one observable source, cached per source. */
    const hookCache = new WeakMap();

    function bindSnapshotSelector(source) {
      let hook = hookCache.get(source);
      if (hook === undefined) {
        hook = (selector) => {
          const value = useSyncExternalStore(source.subscribe, source.getSnapshot, source.getSnapshot);
          return typeof selector === 'function' ? selector(value) : value;
        };
        hookCache.set(source, hook);
      }
      return hook;
    }

    /** Per-entry store instance and inject result, so a tab render never re-mints them. */
    const extrasCache = new WeakMap();

    /** A StoreHandle or StoreFactory turned into one live store instance. */
    function storeInstanceOf(store) {
      try {
        const handle = typeof store === 'function' ? store() : store;
        if (handle === null || typeof handle !== 'object' || typeof handle.create !== 'function') return undefined;
        return handle.create();
      } catch {
        return undefined;
      }
    }

    /**
     * Extra props for a panel another plugin registered on `main`.
     *
     * The slot renderer composes these for its own entries; a plugin cannot ask
     * it to render someone else's entry, so an embedded panel gets the standard
     * props this page was handed plus its own locale seat, store pair and inject
     * face. Only these extras are cached — standard props arrive fresh on every
     * render and must not be frozen into the cache.
     */
    function embedExtras(ctx, entry) {
      const cached = extrasCache.get(entry);
      if (cached !== undefined) return cached;
      const extras = { unsupported: false };
      try {
        if (entry.store !== undefined) {
          const store = storeInstanceOf(entry.store);
          if (store !== undefined) {
            extras.useStore = bindSnapshotSelector(store);
            extras.actions = store.actions;
          }
        }
        if (typeof entry.inject === 'function') {
          const injected = extras.actions === undefined ? entry.inject() : entry.inject(extras.actions);
          if (injected !== null && typeof injected === 'object') {
            const hooks = injected.hooks;
            for (const [name, value] of Object.entries(injected)) {
              if (name === 'hooks' || name === 'keyedHooks') continue;
              extras[name] = value;
            }
            if (hooks !== null && typeof hooks === 'object') {
              for (const [name, source] of Object.entries(hooks)) {
                if (source === null || typeof source !== 'object') continue;
                extras['use' + name.charAt(0).toUpperCase() + name.slice(1)] = bindSnapshotSelector(source);
              }
            }
          }
        }
        if (typeof entry.locale === 'string' && entry.locale !== '') extras.t = ctx.locale.bind(entry.locale);
      } catch {
        // A panel whose inject fails still renders with the standard props.
      }
      // Child slots need the renderer's own binding, which is not reachable here.
      extras.unsupported = entry.children !== undefined;
      extrasCache.set(entry, extras);
      return extras;
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

    /** Every other plugin's sidebar panel, paired with its `main` entry. */
    function createPanelStore(ctx) {
      let snapshot = [];
      const listeners = new Set();
      const slots = ctx.slots;
      const available =
        slots !== undefined &&
        typeof slots.entriesOfSlot === 'function' &&
        typeof slots.subscribe === 'function';
      // Shipped host panels stay where the host put them: never collected, never
      // hidden. Extend this list if the host ships another panel.
      const shipped = new Set(['plugins', 'schedules']);
      const read = () => {
        const rows = [];
        if (!available) return rows;
        const panels = new Map();
        for (const entry of slots.entriesOfSlot('main')) {
          const key = entry?.options?.key;
          if (typeof key === 'string' && key !== '') panels.set(key, entry);
        }
        const seen = new Set();
        for (const entry of slots.entriesOfSlot('sidebar.panellist')) {
          const id = entry?.options?.id;
          if (typeof id !== 'string' || id === '' || id === HUB_ID || shipped.has(id) || seen.has(id)) continue;
          const panel = panels.get(id);
          // A sidebar button without a matching main panel has nothing to embed.
          if (panel === undefined) continue;
          seen.add(id);
          rows.push({ id, order: entry.options.order ?? 0, label: entry.options.label, panel });
        }
        rows.sort((left, right) => left.order - right.order);
        return rows;
      };
      // First-appearance order: a tab already on screen never moves, and a newly
      // installed plugin's tab is appended after the existing ones.
      let sequence = [];
      const ordered = (rows) => {
        const byId = new Map(rows.map((row) => [row.id, row]));
        const result = sequence.filter((id) => byId.has(id)).map((id) => byId.get(id));
        for (const row of rows) {
          if (sequence.includes(row.id)) continue;
          sequence.push(row.id);
          result.push(row);
        }
        const present = new Set(rows.map((row) => row.id));
        sequence = sequence.filter((id) => present.has(id));
        return result;
      };
      const unchanged = (left, right) =>
        left.length === right.length &&
        left.every((row, index) => {
          const other = right[index];
          return row.id === other.id && row.order === other.order && row.panel === other.panel;
        });
      return {
        available,
        getSnapshot: () => snapshot,
        subscribe(listener) {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
        refresh(force = false) {
          const next = ordered(read());
          if (!force && unchanged(snapshot, next)) return;
          snapshot = next;
          for (const listener of [...listeners]) listener();
        },
      };
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

    /** Switch the main column to one collected panel, for panels that cannot embed. */
    function openPanel(ctx, id) {
      try {
        ctx.layout?.selectPanel(id);
      } catch {
        // the hub stays visible when a panel cannot be selected
      }
    }

    /** Render one collected panel, or explain why it has to open on its own. */
    function CollectedPane({ ctx, row, slot, t }) {
      const entry = row.panel;
      const extras = embedExtras(ctx, entry);
      if (extras.unsupported || typeof entry.component !== 'function') {
        return h(
          'div',
          { className: 'hub-crash' },
          h('strong', null, panelLabel(row.label, row.id)),
          h('span', null, t('tab.unsupported')),
          h('button', { type: 'button', onClick: () => openPanel(ctx, row.id) }, t('tab.openStandalone')),
        );
      }
      return h(entry.component, { ...slot, ...extras });
    }

    /** Fallback a crashed pane renders instead of blanking the panel. */
    function crashedPane(t, ctx, row) {
      return (error) =>
        h(
          'div',
          { className: 'hub-crash' },
          h('strong', null, t('tab.failed')),
          h('code', null, String((error && error.message) || error)),
          row === undefined
            ? null
            : h('button', { type: 'button', onClick: () => openPanel(ctx, row.id) }, t('tab.openStandalone')),
        );
    }

    function createHubPage(ctx, t, panels) {
      return function HubPage(props) {
        const rows = useSyncExternalStore(panels.subscribe, panels.getSnapshot);
        const slot = props !== null && typeof props === 'object' ? props : {};
        const [active, setActive] = useState(rows.length === 0 ? '' : rows[0].id);
        const current = rows.some((row) => row.id === active) ? active : (rows[0]?.id ?? '');
        return h(
          'div',
          { className: 'hub-page' },
          h('style', null, CSS),
          h(
            'div',
            { className: 'hub-head' },
            h('span', { className: 'hub-title' }, t('title')),
            h(
              'div',
              { className: 'hub-tabs', role: 'tablist' },
              rows.map((row) =>
                h(
                  'button',
                  {
                    key: row.id,
                    type: 'button',
                    role: 'tab',
                    'aria-selected': row.id === current,
                    className: row.id === current ? 'hub-tab hub-tab-active' : 'hub-tab',
                    onClick: () => setActive(row.id),
                  },
                  panelLabel(row.label, row.id),
                ),
              ),
            ),
          ),
          h(
            'div',
            { className: 'hub-body' },
            rows.length === 0
              ? h('div', { className: 'hub-empty' }, t('empty'))
              : // Every pane stays mounted so switching tabs keeps search, filters,
                // draft text and scroll positions; only the active one is displayed.
                rows.map((row) =>
                  h(
                    'div',
                    { key: row.id, className: row.id === current ? 'hub-pane' : 'hub-pane hub-pane-hidden' },
                    h(
                      HubErrorBoundary,
                      { fallback: crashedPane(t, ctx, row) },
                      h(CollectedPane, { ctx, row, slot, t }),
                    ),
                  ),
                ),
          ),
        );
      };
    }

    /** Registers a boundary above the page so the panel never goes blank. */
    function createHubShell(ctx, t, panels) {
      const HubPage = createHubPage(ctx, t, panels);
      return function HubShell(props) {
        return h(HubErrorBoundary, { fallback: crashedPane(t) }, h(HubPage, props));
      };
    }

    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh: ZH, en: EN }), 'harness-hub: dictionaries');
      const t = ctx.locale.bind(NS);
      const panels = createPanelStore(ctx);

      ctx.effect(() => {
        const offPanels = ctx.slots.subscribe('sidebar.panellist', () => panels.refresh());
        const offMain = ctx.slots.subscribe('main', () => panels.refresh());
        // Labels are thunks, so a locale switch re-renders the collected tabs.
        const offLocale = ctx.locale.subscribe(() => panels.refresh(true));
        panels.refresh();
        return () => {
          offPanels();
          offMain();
          offLocale();
        };
      }, 'harness-hub: collected sidebar panels');

      const HubShell = createHubShell(ctx, t, panels);

      ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: HUB_ID, locale: NS }, HubShell));

      ctx.slots.inject('sidebar.panellist', () =>
        ctx.slots.register(
          { name: 'sidebar.panellist', id: HUB_ID, order: 15, locale: NS, label: () => t('panel') },
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
    }

    return {
      inject: ['slots', 'locale'],
      apply,
    };
  },
});

/**
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
      'panels.paneCrashed': '这一页渲染出错，插件集成仍可使用。',
      'embed.unsupported': '这个面板需要宿主自己渲染（它声明了子插槽），这里无法直接内嵌。',
      'embed.openStandalone': '单独打开',
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
      'panels.paneCrashed': 'This tab failed to render; the hub keeps working.',
      'embed.unsupported': 'This panel needs the host renderer (it declares child slots) and cannot be embedded here.',
      'embed.openStandalone': 'Open on its own',
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

    /* ---- section: vault (authored in tools/vault-pane.js) ---- */
/* Token vault pane for the Harness Hub.
 *
 * Authored here instead of copied from `@local/token-vault/client.js`: the old
 * settings section is replaced by a hub-styled pane that talks to the same Host
 * routes (`token-vault/list`, `token-vault/save`, `token-vault/delete`), so the
 * stored file format, tool names and route contract stay untouched.
 *
 * Injected into the hub factory by `tools/assemble-client.py`; `t` is the hub
 * translator, and every string lives under the `vault.*` keys.
 */

const VAULT_LIST_ROUTE = 'token-vault/list';
const VAULT_SAVE_ROUTE = 'token-vault/save';
const VAULT_DELETE_ROUTE = 'token-vault/delete';
const VAULT_NAME_PATTERN = /^[A-Za-z_][A-Za-z0-9_.-]{0,63}$/;
const VAULT_SHELL_EXAMPLE =
  'vault_sh: curl -sS -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user';

const VAULT_CSS = [
  '.hub-vault{flex:1;min-height:0;overflow:auto;scrollbar-gutter:stable}',
  '.hv-inner{box-sizing:border-box;max-width:900px;margin:0 auto;padding:26px clamp(20px,4vw,40px) 56px;display:flex;flex-direction:column;gap:18px}',
  '.hv-head h1{margin:0;font-size:20px;font-weight:600;line-height:28px}',
  '.hv-head p{margin:6px 0 0;max-width:66ch;color:var(--dsw-alias-label-secondary);font-size:12.5px;line-height:19px}',
  '.hv-card{border:.5px solid var(--dsw-alias-border-l1);border-radius:14px;background:var(--dsw-alias-bg-layer-1);padding:16px 18px}',
  '.hv-card-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:12px}',
  '.hv-card-head h2{margin:0;font-size:13.5px;font-weight:600;line-height:20px}',
  '.hv-hint{color:var(--dsw-alias-label-tertiary);font-size:11.5px;line-height:16px;text-align:right}',
  '.hv-form{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:12px}',
  '.hv-field{display:flex;flex-direction:column;gap:6px;min-width:0}',
  '.hv-field-wide{grid-column:1/-1}',
  '.hv-field>span{color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:500;line-height:17px}',
  '.hv-input{box-sizing:border-box;width:100%;height:34px;padding:0 11px;border:.5px solid var(--dsw-alias-border-l2);border-radius:9px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:20px}',
  '.hv-input::placeholder{color:var(--dsw-alias-label-tertiary)}',
  '.hv-input:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-1px}',
  '.hv-form-foot{grid-column:1/-1;display:flex;align-items:center;gap:10px;margin-top:2px}',
  '.hv-primary{box-sizing:border-box;height:32px;padding:0 15px;border:none;border-radius:9px;background:var(--dsw-alias-button-primary-fill);color:var(--dsw-alias-label-primary-foreground);font:inherit;font-size:13px;line-height:20px;cursor:pointer;white-space:nowrap}',
  '.hv-primary:hover{opacity:.92}',
  '.hv-primary:disabled{opacity:.5;cursor:default}',
  '.hv-status{min-width:0;font-size:12px;line-height:18px;overflow-wrap:anywhere}',
  '.hv-status-error{color:var(--dsw-alias-state-error-primary)}',
  '.hv-status-ok{color:var(--dsw-alias-state-success-primary)}',
  '.hv-list-head{display:flex;align-items:baseline;gap:8px;margin:2px 2px 0}',
  '.hv-list-head h2{margin:0;font-size:13.5px;font-weight:600;line-height:20px}',
  '.hv-count{color:var(--dsw-alias-label-tertiary);font-size:11.5px;line-height:16px;font-variant-numeric:tabular-nums}',
  '.hv-empty{margin:0;padding:18px 2px;color:var(--dsw-alias-label-tertiary);font-size:12.5px;line-height:19px}',
  '.hv-list{display:flex;flex-direction:column;gap:10px;margin:0;padding:0;list-style:none}',
  '.hv-row{display:flex;flex-direction:column;gap:10px;border:.5px solid var(--dsw-alias-border-l1);border-radius:14px;background:var(--dsw-alias-bg-layer-1);padding:14px 16px;transition:border-color .12s ease}',
  '.hv-row:hover{border-color:var(--dsw-alias-border-l2)}',
  '.hv-row-main{display:flex;align-items:center;flex-wrap:wrap;gap:8px;min-width:0}',
  '.hv-name{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px;line-height:18px;padding:2px 8px;border-radius:7px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);overflow-wrap:anywhere}',
  '.hv-env{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;line-height:18px;padding:2px 8px;border-radius:7px;border:.5px dashed var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);white-space:nowrap}',
  '.hv-mask{color:var(--dsw-alias-label-tertiary);font-size:11.5px;line-height:16px;letter-spacing:.04em;white-space:nowrap}',
  '.hv-when{margin-left:auto;color:var(--dsw-alias-label-tertiary);font-size:11.5px;line-height:16px;font-variant-numeric:tabular-nums;white-space:nowrap}',
  '.hv-note{margin:0;color:var(--dsw-alias-label-secondary);font-size:12.5px;line-height:19px;overflow-wrap:anywhere}',
  '.hv-actions{display:flex;flex-wrap:wrap;align-items:center;gap:4px}',
  '.hv-btn{box-sizing:border-box;height:28px;padding:0 10px;border:none;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;line-height:18px;cursor:pointer}',
  '.hv-btn:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
  '.hv-btn-danger{color:var(--dsw-alias-state-error-primary)}',
  '.hv-btn-danger:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-state-error-primary)}',
  '.hv-edit{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;padding-top:12px;border-top:.5px dashed var(--dsw-alias-border-l1)}',
  '.hv-edit-foot{grid-column:1/-1;display:flex;align-items:center;gap:8px}',
  '.hv-usage{border:.5px solid var(--dsw-alias-border-l1);border-radius:14px;background:var(--dsw-alias-bg-layer-1);padding:14px 16px;display:flex;flex-direction:column;gap:10px}',
  '.hv-usage p{margin:0;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}',
  '.hv-code{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:10px;background:var(--dsw-alias-bg-base);border:.5px solid var(--dsw-alias-border-l1)}',
  '.hv-code code{flex:1;min-width:0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px;line-height:18px;color:var(--dsw-alias-label-secondary);overflow-wrap:anywhere}',
  '@media (max-width:720px){.hv-form{grid-template-columns:minmax(0,1fr)}.hv-edit{grid-template-columns:minmax(0,1fr)}}',
].join('');

/** One JSON route call; a non-2xx answer keeps the Host's own message. */
async function vaultCall(route, body) {
  const init =
    body === undefined
      ? { method: 'GET' }
      : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) };
  const response = await fetch(route, init);
  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }
  if (!response.ok) {
    throw new Error(
      typeof payload?.message === 'string' && payload.message !== '' ? payload.message : 'HTTP ' + response.status,
    );
  }
  return payload;
}

/** Human-readable message for one failed route call. */
function vaultMessageOf(failure) {
  if (failure instanceof Error && failure.message !== '') return failure.message;
  return String(failure);
}

/** A labelled text input. */
function VaultField(props) {
  return h(
    'label',
    { className: props.wide ? 'hv-field hv-field-wide' : 'hv-field' },
    h('span', null, props.label),
    h('input', {
      className: 'hv-input',
      type: props.type ?? 'text',
      value: props.value,
      placeholder: props.placeholder,
      autoComplete: props.autoComplete ?? 'off',
      spellCheck: false,
      onChange: props.onChange,
    }),
  );
}

/** The token vault section: add, list, replace and delete local tokens. */
function VaultPane({ t }) {
  const [tokens, setTokens] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState({ name: '', value: '', note: '' });
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState('');
  const [copied, setCopied] = useState('');
  const [copiedExample, setCopiedExample] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const payload = await vaultCall(VAULT_LIST_ROUTE);
      setTokens(Array.isArray(payload.tokens) ? payload.tokens : []);
    } catch (failure) {
      setError(vaultMessageOf(failure));
      setTokens((current) => current ?? []);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (copied === '') return undefined;
    const timer = setTimeout(() => setCopied(''), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if (!copiedExample) return undefined;
    const timer = setTimeout(() => setCopiedExample(false), 1600);
    return () => clearTimeout(timer);
  }, [copiedExample]);

  const submitDraft = async (event) => {
    event.preventDefault();
    if (busy) return;
    const name = draft.name.trim();
    if (name === '') return setError(t('vault.error.nameRequired'));
    if (!VAULT_NAME_PATTERN.test(name)) return setError(t('vault.error.nameInvalid'));
    if (draft.value === '') return setError(t('vault.error.valueRequired'));
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await vaultCall(VAULT_SAVE_ROUTE, { name, value: draft.value, note: draft.note });
      setDraft({ name: '', value: '', note: '' });
      setNotice(t('vault.notice.saved', { name }));
      await refresh();
    } catch (failure) {
      setError(vaultMessageOf(failure));
    } finally {
      setBusy(false);
    }
  };

  const submitEdit = async (event) => {
    event.preventDefault();
    if (busy || editing === null) return;
    const body = { name: editing.name, note: editing.note };
    if (editing.value !== '') body.value = editing.value;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await vaultCall(VAULT_SAVE_ROUTE, body);
      const name = editing.name;
      setEditing(null);
      setNotice(t('vault.notice.updated', { name }));
      await refresh();
    } catch (failure) {
      setError(vaultMessageOf(failure));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (name) => {
    if (pendingDelete !== name) {
      setPendingDelete(name);
      return;
    }
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const payload = await vaultCall(VAULT_DELETE_ROUTE, { name });
      setTokens(Array.isArray(payload.tokens) ? payload.tokens : []);
      setPendingDelete('');
      setNotice(t('vault.notice.deleted', { name }));
    } catch (failure) {
      setError(vaultMessageOf(failure));
    } finally {
      setBusy(false);
    }
  };

  const copyVariable = async (token) => {
    try {
      await navigator.clipboard.writeText('$' + (token.env ?? token.name));
      setCopied(token.name);
    } catch {
      setError(t('vault.error.copyFailed'));
    }
  };

  const copyExample = async () => {
    try {
      await navigator.clipboard.writeText('vault_sh: curl -sS -H "Authorization: Bearer $NAME" <url>');
      setCopiedExample(true);
    } catch {
      setError(t('vault.error.copyFailed'));
    }
  };

  const formatWhen = (value) => {
    if (typeof value !== 'string' || value === '') return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString();
  };

  const errorLine =
    error === '' ? null : h('span', { className: 'hv-status hv-status-error', role: 'alert' }, error);

  return h(
    'div',
    { className: 'hub-vault' },
    h('style', null, VAULT_CSS),
    h(
      'div',
      { className: 'hv-inner' },
      h('header', { className: 'hv-head' }, h('h1', null, t('vault.title')), h('p', null, t('vault.lead'))),
      h(
        'section',
        { className: 'hv-card' },
        h(
          'div',
          { className: 'hv-card-head' },
          h('h2', null, t('vault.add.title')),
          h('span', { className: 'hv-hint' }, t('vault.add.hint')),
        ),
        h(
          'form',
          { className: 'hv-form', onSubmit: submitDraft, autoComplete: 'off' },
          h(VaultField, {
            label: t('vault.field.name'),
            value: draft.name,
            placeholder: t('vault.field.namePlaceholder'),
            onChange: (event) => setDraft({ ...draft, name: event.target.value }),
          }),
          h(VaultField, {
            label: t('vault.field.value'),
            type: 'password',
            autoComplete: 'new-password',
            value: draft.value,
            placeholder: t('vault.field.valuePlaceholder'),
            onChange: (event) => setDraft({ ...draft, value: event.target.value }),
          }),
          h(VaultField, {
            wide: true,
            label: t('vault.field.note'),
            value: draft.note,
            placeholder: t('vault.field.notePlaceholder'),
            onChange: (event) => setDraft({ ...draft, note: event.target.value }),
          }),
          h(
            'div',
            { className: 'hv-form-foot' },
            h(
              'button',
              { type: 'submit', className: 'hv-primary', disabled: busy },
              busy ? t('vault.action.saving') : t('vault.action.save'),
            ),
            editing === null ? errorLine : null,
          ),
        ),
      ),
      h(
        'div',
        { className: 'hv-list-head' },
        h('h2', null, t('vault.list.title')),
        tokens === null
          ? null
          : h('span', { className: 'hv-count' }, t('vault.list.count', { count: tokens.length })),
      ),
      tokens === null
        ? h('p', { className: 'hv-empty' }, t('vault.list.loading'))
        : tokens.length === 0
          ? h('p', { className: 'hv-empty' }, t('vault.list.empty'))
          : h(
              'ul',
              { className: 'hv-list' },
              tokens.map((token) => {
                const editingThis = editing !== null && editing.name === token.name;
                const when = formatWhen(token.updatedAt);
                return h(
                  'li',
                  { key: token.name, className: 'hv-row' },
                  h(
                    'div',
                    { className: 'hv-row-main' },
                    h('code', { className: 'hv-name' }, token.name),
                    h('code', { className: 'hv-env' }, '$' + (token.env ?? token.name)),
                    h('span', { className: 'hv-mask' }, t('vault.row.mask', { count: token.length })),
                    when === ''
                      ? null
                      : h(
                          'time',
                          { className: 'hv-when', dateTime: token.updatedAt },
                          t('vault.row.updated', { when }),
                        ),
                  ),
                  token.note === '' || token.note === undefined ? null : h('p', { className: 'hv-note' }, token.note),
                  editingThis
                    ? h(
                        'form',
                        { className: 'hv-edit', onSubmit: submitEdit, autoComplete: 'off' },
                        h(VaultField, {
                          label: t('vault.edit.newValue'),
                          type: 'password',
                          autoComplete: 'new-password',
                          value: editing.value,
                          placeholder: t('vault.edit.keep'),
                          onChange: (event) =>
                            setEditing((current) =>
                              current === null ? current : { ...current, value: event.target.value },
                            ),
                        }),
                        h(VaultField, {
                          label: t('vault.field.note'),
                          value: editing.note,
                          placeholder: t('vault.field.notePlaceholder'),
                          onChange: (event) =>
                            setEditing((current) =>
                              current === null ? current : { ...current, note: event.target.value },
                            ),
                        }),
                        h(
                          'div',
                          { className: 'hv-edit-foot' },
                          h(
                            'button',
                            { type: 'submit', className: 'hv-primary', disabled: busy },
                            t('vault.edit.save'),
                          ),
                          h(
                            'button',
                            { type: 'button', className: 'hv-btn', onClick: () => setEditing(null) },
                            t('vault.edit.cancel'),
                          ),
                          errorLine,
                        ),
                      )
                    : h(
                        'div',
                        { className: 'hv-actions' },
                        h(
                          'button',
                          { type: 'button', className: 'hv-btn', onClick: () => void copyVariable(token) },
                          copied === token.name ? t('vault.row.copied') : t('vault.row.copy'),
                        ),
                        h(
                          'button',
                          {
                            type: 'button',
                            className: 'hv-btn',
                            onClick: () => {
                              setPendingDelete('');
                              setError('');
                              setEditing({ name: token.name, value: '', note: token.note ?? '' });
                            },
                          },
                          t('vault.row.replace'),
                        ),
                        h(
                          'button',
                          {
                            type: 'button',
                            className: pendingDelete === token.name ? 'hv-btn hv-btn-danger' : 'hv-btn',
                            disabled: busy,
                            onClick: () => void remove(token.name),
                          },
                          pendingDelete === token.name ? t('vault.row.confirmDelete') : t('vault.row.delete'),
                        ),
                      ),
                );
              }),
            ),
      h(
        'section',
        { className: 'hv-usage' },
        h('p', null, t('vault.usage.line')),
        h(
          'div',
          { className: 'hv-code' },
          h('code', null, VAULT_SHELL_EXAMPLE),
          h(
            'button',
            { type: 'button', className: 'hv-btn', onClick: () => void copyExample() },
            copiedExample ? t('vault.usage.copied') : t('vault.usage.copy'),
          ),
        ),
      ),
      notice !== '' && error === '' ? h('p', { className: 'hv-status hv-status-ok' }, notice) : null,
    ),
  );
}

    /* ---- section: skills (from skill-gallery/client.js) ---- */
    const SkillGallery = (function (require) {

    const React = require('react');
    const h = React.createElement;
    const { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } = React;

    const NS = 'skill-gallery';
    const PANEL_ID = 'skill-gallery';
    const ROUTE = '/skill-gallery/skills';
    const UNINSTALL_ROUTE = '/skill-gallery/uninstall';

    const CSS = [
      '.skg-page{display:flex;flex-direction:column;width:100%;height:100%;min-height:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:14px;line-height:1.6}',
      '.skg-scroll{flex:1;min-height:0;overflow:auto;scrollbar-gutter:stable}',
      '.skg-content{box-sizing:border-box;max-width:1080px;margin:0 auto;padding:28px clamp(20px,4vw,44px) 48px}',
      '.skg-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}',
      '.skg-head h1{margin:0;font-size:20px;font-weight:600;line-height:28px}',
      '.skg-sub{margin:6px 0 0;max-width:62ch;color:var(--dsw-alias-label-secondary);font-size:13px;word-break:keep-all;overflow-wrap:anywhere}',
      '.skg-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:18px 0 16px}',
      '.skg-search{display:flex;align-items:center;flex:1 1 230px;max-width:320px;height:36px;padding:0 10px;gap:8px;border:.5px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-secondary)}',
      '.skg-search:focus-within{border-color:var(--dsw-alias-brand-primary)}',
      '.skg-search svg{flex:none}',
      '.skg-search input{flex:1;min-width:0;height:100%;padding:0;border:0;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;outline:none}',
      '.skg-search input::placeholder{color:var(--dsw-alias-label-secondary)}',
      '.skg-spacer{flex:1 1 auto}',
      '.skg-stats{color:var(--dsw-alias-label-secondary);font-size:12px;white-space:nowrap}',
      '.skg-refresh{display:inline-flex;align-items:center;gap:6px;flex:none;height:34px;padding:0 12px;border:.5px solid var(--dsw-alias-border-l2);border-radius:12px;background:transparent;color:inherit;font:inherit;font-size:13px;cursor:pointer}',
      '.skg-refresh:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2)}',
      '.skg-refresh:disabled{opacity:.5;cursor:default}',
      '.skg-spin{animation:skg-spin 1s linear infinite}',
      '@keyframes skg-spin{to{transform:rotate(360deg)}}',
      '.skg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;align-items:start}',
      '.skg-grid[data-refreshing="true"]{opacity:.6;transition:opacity .15s ease}',
      '.skg-card{box-sizing:border-box;display:flex;flex-direction:column;min-width:0;height:224px;padding:12px 14px 0;border:1px solid color-mix(in srgb,var(--dsw-alias-state-success-primary) 52%,var(--dsw-alias-border-l1));border-radius:10px;background:var(--dsw-alias-bg-layer-1);transition:border-color .15s ease,box-shadow .15s ease}',
      '.skg-card:hover{border-color:var(--dsw-alias-state-success-primary);box-shadow:0 3px 12px color-mix(in srgb,var(--dsw-alias-label-primary) 7%,transparent)}',
      '.skg-card-active{border-color:var(--dsw-alias-brand-primary)}',
      '.skg-card-body{flex:1;min-height:0;padding:2px 0 10px;overflow:hidden}',
            '.skg-card-main{flex:1;min-width:0}',
      '.skg-title-row{display:flex;align-items:center;gap:7px;min-width:0}',
      '.skg-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:16px;font-weight:600;line-height:22px}',
      '.skg-badge{display:inline-flex;align-items:center;flex:none;margin-left:auto;height:18px;padding:0 7px;border-radius:999px;background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 14%,transparent);color:var(--dsw-alias-state-success-primary);font-size:11px;line-height:1;white-space:nowrap}',
      '.skg-version{flex:none;color:var(--dsw-alias-label-secondary);font-size:12px}',
      '.skg-slug{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.45}',
      '.skg-desc{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin:7px 0 0;min-height:39px;font-size:13px;line-height:1.5;color:var(--dsw-alias-label-primary);overflow-wrap:anywhere}',
      '.skg-meta{display:flex;flex-wrap:wrap;align-items:center;gap:3px 14px;margin-top:9px;color:var(--dsw-alias-label-secondary);font-size:12px}',
      '.skg-meta-date{margin-top:3px}',
      '.skg-meta-item{display:inline-flex;align-items:center;gap:5px;min-width:0;white-space:nowrap}',
      '.skg-meta-item svg{flex:none;opacity:.85}',
      '.skg-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 0 10px;border-top:.5px solid var(--dsw-alias-border-l1)}',
      '.skg-foot-actions{display:flex;align-items:center;gap:8px;margin-left:auto}',
      '.skg-update{display:inline-flex;align-items:center;flex:none;height:22px;padding:0 8px;border-radius:999px;background:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 12%,transparent);color:var(--dsw-alias-state-warn-primary);font-size:11.5px;line-height:1;white-space:nowrap}',
      '.skg-outdated{color:var(--dsw-alias-state-warn-primary)}',
      '.skg-btn{display:inline-flex;align-items:center;justify-content:center;flex:none;height:28px;padding:0 13px;border:.5px solid var(--dsw-alias-border-l2);border-radius:8px;background:transparent;color:inherit;font:inherit;font-size:13px;white-space:nowrap;cursor:pointer}',
      '.skg-btn:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2)}',
      '.skg-btn:disabled{opacity:.55;cursor:default}',
      '.skg-btn-danger{color:var(--dsw-alias-state-error-primary);border-color:color-mix(in srgb,var(--dsw-alias-state-error-primary) 42%,var(--dsw-alias-border-l2))}',
      '.skg-btn-danger:hover:not(:disabled){background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 10%,transparent)}',
      '.skg-icon-btn{display:inline-flex;align-items:center;justify-content:center;flex:none;width:28px;height:28px;padding:0;border:.5px solid var(--dsw-alias-border-l2);border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer}',
      '.skg-icon-btn:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
      '.skg-icon-btn:disabled{opacity:.55;cursor:default}',
      '.skg-msg{display:flex;flex-direction:column;align-items:center;gap:8px;padding:54px 16px;text-align:center;color:var(--dsw-alias-label-secondary)}',
      '.skg-msg-icon{display:flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:16px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary)}',
      '.skg-msg-title{margin:6px 0 0;color:var(--dsw-alias-label-primary);font-size:14px;font-weight:500}',
      '.skg-msg-hint{margin:0;max-width:46ch;font-size:12.5px}',
      '.skg-msg .skg-btn{margin-top:8px}',
      '.skg-error .skg-msg-title{color:var(--dsw-alias-state-error-primary)}',
      '.skg-skeleton{display:flex;flex-direction:column;gap:12px;padding:16px;border:.5px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1)}',
                        '.skg-sk-line{height:10px;border-radius:6px;background:var(--dsw-alias-bg-layer-2)}',
      '.skg-sk-line.w30{width:30%}',
      '.skg-sk-line.w60{width:60%}',
      '.skg-sk-line.w80{width:80%}',
      '.skg-sk-pulse{animation:skg-pulse 1.4s ease-in-out infinite}',
      '@keyframes skg-pulse{0%,100%{opacity:1}50%{opacity:.55}}',
      '.skg-overlay{position:fixed;inset:0;z-index:80;pointer-events:auto;display:flex;align-items:center;justify-content:center;padding:24px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 42%,transparent);animation:skg-fade .12s ease}',
      '.skg-dialog{display:flex;flex-direction:column;width:min(760px,100%);max-height:calc(100dvh - 48px);overflow:hidden;border:.5px solid var(--dsw-alias-border-l2);border-radius:16px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);box-shadow:0 16px 48px color-mix(in srgb,var(--dsw-alias-label-primary) 24%,transparent);animation:skg-rise .16s ease}',
      '.skg-dialog-sm{width:min(440px,100%)}',
      '.skg-dialog-head{display:flex;align-items:flex-start;gap:12px;padding:18px 20px 12px}',
            '.skg-dialog-ident{flex:1;min-width:0}',
      '.skg-dialog-title{margin:0;font-size:18px;font-weight:600;line-height:24px;overflow-wrap:anywhere}',
      '.skg-dialog-slug{color:var(--dsw-alias-label-secondary);font-size:12px;overflow-wrap:anywhere}',
      '.skg-dialog-badges{display:flex;align-items:center;gap:8px;margin-top:6px}',
      '.skg-dialog-badges .skg-badge{margin-left:0}',
      '.skg-dialog-close{display:inline-flex;align-items:center;justify-content:center;flex:none;width:32px;height:32px;padding:0;border:.5px solid var(--dsw-alias-border-l1);border-radius:10px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer}',
      '.skg-dialog-close:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
      '.skg-dialog-body{flex:1;min-height:0;overflow:auto;padding:0 20px 16px}',
      '.skg-dialog-desc{margin:0 0 14px;font-size:13.5px;line-height:1.75;overflow-wrap:anywhere}',
      '.skg-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}',
      '.skg-chip{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border:.5px solid var(--dsw-alias-border-l1);border-radius:8px;font-size:12px;line-height:18px;white-space:nowrap}',
      '.skg-chip-label{color:var(--dsw-alias-label-secondary)}',
      '.skg-dialog-rows{display:flex;flex-direction:column;gap:8px;margin:0;padding:12px;border-radius:12px;background:var(--dsw-alias-bg-layer-2)}',
      '.skg-detail{display:grid;grid-template-columns:78px minmax(0,1fr);gap:8px;font-size:12px}',
      '.skg-detail dt{color:var(--dsw-alias-label-secondary)}',
      '.skg-detail dd{min-width:0;margin:0;overflow-wrap:anywhere}',
      '.skg-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px;line-height:1.5}',
      '.skg-path-cell{display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px}',
      '.skg-copy-btn{display:inline-flex;align-items:center;justify-content:center;flex:none;height:22px;padding:0 8px;border:.5px solid var(--dsw-alias-border-l2);border-radius:6px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:11.5px;line-height:1;white-space:nowrap;cursor:pointer}',
      '.skg-copy-btn:hover{background:var(--dsw-alias-bg-layer-1)}',
      '.skg-dialog-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 12px;padding:12px 20px;border-top:.5px solid var(--dsw-alias-border-l1)}',
      '.skg-dialog-foot .skg-source{max-width:44%}',
      '.skg-dialog-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:8px}',
      '.skg-source{display:inline-flex;align-items:center;gap:5px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary);font-size:12px}',
      '.skg-source svg{flex:none}',
      '.skg-confirm-body{padding:0 20px 4px}',
      '.skg-confirm-text{margin:0 0 10px;font-size:13.5px;line-height:1.6;overflow-wrap:anywhere}',
      '.skg-confirm-path{margin:0 0 10px;padding:8px 10px;border-radius:10px;background:var(--dsw-alias-bg-layer-2);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px;line-height:1.5;overflow-wrap:anywhere}',
      '.skg-confirm-hint{margin:0;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.55}',
      '.skg-confirm-error{margin:10px 0 0;color:var(--dsw-alias-state-error-primary);font-size:12px;line-height:1.5;overflow-wrap:anywhere}',
      '@keyframes skg-fade{from{opacity:0}to{opacity:1}}',
      '@keyframes skg-rise{from{opacity:0;transform:translateY(6px) scale(.99)}to{opacity:1;transform:none}}',
      '.skg-page :focus-visible,.skg-dialog :focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}',
      '@media (prefers-reduced-motion:reduce){.skg-spin,.skg-sk-pulse,.skg-overlay,.skg-dialog{animation:none}}',
    ].join('\n');

    const zh = {
      panel: '技能',
      title: '技能',
      subtitle: '已安装的技能，可查看详情或卸载。',
      refresh: '刷新',
      search: '搜索技能',
      stats: '共 {n} 个技能 · {size}',
      errorTitle: '读取技能列表失败',
      retry: '重试',
      emptyTitle: '还没有已安装的技能',
      emptyHint: '在对话中通过 skillhub 搜索并安装技能后，技能会自动以卡片出现在这里。',
      noResults: '没有匹配的技能',
      noResultsHint: '换一个关键词试试，或清空搜索框。',
      installed: '已装',
      detail: '详情',
      uninstall: '卸载',
      checkUpdates: '检查更新',
      latestVersion: '最新版本',
      updateAvailable: '可更新',
      upToDate: '已是最新',
      close: '关闭',
      files: '{n} 个文件',
      updated: '更新于 {date}',
      path: '安装路径',
      source: '安装来源',
      version: '版本',
      invocation: '调用方式',
      owner: '发布者',
      copyPath: '复制路径',
      copied: '已复制',
      noDescription: '暂无描述',
      viaSkillhub: 'SkillHub',
      fileCountLabel: '文件数',
      sizeLabel: '总大小',
      updatedLabel: '更新于',
      uninstallTitle: '卸载技能',
      uninstallConfirm: '确定要卸载「{title}」吗？',
      uninstallHint: '将删除该技能目录，此操作不可撤销。需要时可以在 SkillHub 中重新安装。',
      cancel: '取消',
      uninstalling: '正在卸载…',
      uninstallFailed: '卸载失败：{message}',
      sourceUser: '用户技能',
      sourceAgents: '共享技能',
      sourceProject: '项目技能',
      sourceCustom: '自定义目录',
      invBoth: '模型与用户均可调用',
      invModel: '仅模型可调用',
      invUser: '仅用户可调用',
      invNone: '不可直接调用',
    };

    const en = {
      panel: 'Skills',
      title: 'Skills',
      subtitle: 'Installed skills; open Details or Uninstall.',
      refresh: 'Refresh',
      search: 'Search skills',
      stats: '{n} skills · {size}',
      errorTitle: 'Could not load skills',
      retry: 'Retry',
      emptyTitle: 'No skills installed yet',
      emptyHint: 'Search and install a skill with skillhub in the conversation; it will appear here as a card.',
      noResults: 'No matching skills',
      noResultsHint: 'Try another keyword, or clear the search box.',
      installed: 'Installed',
      detail: 'Details',
      uninstall: 'Uninstall',
      checkUpdates: 'Check updates',
      latestVersion: 'Latest version',
      updateAvailable: 'Update available',
      upToDate: 'Up to date',
      close: 'Close',
      files: '{n} files',
      updated: 'Updated {date}',
      path: 'Install path',
      source: 'Install source',
      version: 'Version',
      invocation: 'Invocation',
      owner: 'Publisher',
      copyPath: 'Copy path',
      copied: 'Copied',
      noDescription: 'No description',
      viaSkillhub: 'SkillHub',
      fileCountLabel: 'Files',
      sizeLabel: 'Total size',
      updatedLabel: 'Updated',
      uninstallTitle: 'Uninstall skill',
      uninstallConfirm: 'Uninstall "{title}"?',
      uninstallHint: 'The skill directory will be deleted. This cannot be undone; you can reinstall it from SkillHub later.',
      cancel: 'Cancel',
      uninstalling: 'Uninstalling…',
      uninstallFailed: 'Uninstall failed: {message}',
      sourceUser: 'User skills',
      sourceAgents: 'Shared skills',
      sourceProject: 'Project skills',
      sourceCustom: 'Custom directory',
      invBoth: 'Model and user',
      invModel: 'Model only',
      invUser: 'User only',
      invNone: 'Not directly invocable',
    };

    function svgIcon(size, strokeWidth, children) {
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 16 16',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': 'true',
        },
        children,
      );
    }

    function FileIcon() {
      return svgIcon(13, 1.4, [
        h('path', { key: 'p', d: 'M9 1.8H4.6a1 1 0 0 0-1 1v10.4a1 1 0 0 0 1 1h6.8a1 1 0 0 0 1-1V5.2z' }),
        h('path', { key: 'q', d: 'M9 1.8v3.4h3.4' }),
      ]);
    }

    function DiskIcon() {
      return svgIcon(13, 1.4, [
        h('ellipse', { key: 'e', cx: 8, cy: 4, rx: 5.2, ry: 2.2 }),
        h('path', { key: 'p', d: 'M2.8 4v4c0 1.2 2.3 2.2 5.2 2.2s5.2-1 5.2-2.2V4' }),
        h('path', { key: 'q', d: 'M2.8 8v4c0 1.2 2.3 2.2 5.2 2.2s5.2-1 5.2-2.2V8' }),
      ]);
    }

    function ClockIcon() {
      return svgIcon(13, 1.4, [
        h('circle', { key: 'c', cx: 8, cy: 8, r: 6.2 }),
        h('path', { key: 'p', d: 'M8 4.6V8l2.2 1.4' }),
      ]);
    }

    function FolderIcon() {
      return svgIcon(12, 1.4, h('path', { d: 'M1.8 4.2a1 1 0 0 1 1-1h2.7l1.2 1.5h5.5a1 1 0 0 1 1 1v6.1a1 1 0 0 1-1 1H2.8a1 1 0 0 1-1-1z' }));
    }

    function SearchIcon() {
      return svgIcon(14, 1.4, [
        h('circle', { key: 'c', cx: 7, cy: 7, r: 4.5 }),
        h('path', { key: 'p', d: 'M10.4 10.4 14 14' }),
      ]);
    }

    function RefreshIcon() {
      return svgIcon(13, 1.5, [
        h('path', { key: 'a', d: 'M13.2 8a5.2 5.2 0 1 1-1.6-3.8' }),
        h('path', { key: 'b', d: 'M13.4 2.6v3.2h-3.2' }),
      ]);
    }

    function CloseIcon() {
      return svgIcon(14, 1.5, [
        h('path', { key: 'a', d: 'M4 4l8 8' }),
        h('path', { key: 'b', d: 'M12 4l-8 8' }),
      ]);
    }

    function GalleryIcon({ size = 36, active = false }) {
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: active ? 1.9 : 1.6,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': 'true',
          style: { display: 'block' },
        },
        h('rect', { key: 'a', x: 3, y: 3, width: 7.4, height: 7.4, rx: 2 }),
        h('rect', { key: 'b', x: 13.6, y: 3, width: 7.4, height: 7.4, rx: 2 }),
        h('rect', { key: 'c', x: 3, y: 13.6, width: 7.4, height: 7.4, rx: 2 }),
        h('path', { key: 'd', d: 'M17.3 13.9v6.4M14.1 17.1h6.4' }),
      );
    }

    /** Drop the registry's trailing branding suffix so both cards read the same. */
    function normalizeTitle(value) {
      return value.replace(/\s*[.．]\s*skill\s*$/i, '').trim();
    }

    function displayTitleOf(skill) {
      const candidates = [skill.zhName, skill.registryName, skill.title, skill.name, skill.slug];
      for (const candidate of candidates) {
        if (typeof candidate !== 'string') continue;
        const cleaned = normalizeTitle(candidate.trim());
        if (cleaned.length > 0) return cleaned;
      }
      return '?';
    }

    /** Secondary identity: the English name and the install slug. */
    function subtitleOf(skill) {
      const title = displayTitleOf(skill);
      const name = typeof skill.name === 'string' ? skill.name.trim() : '';
      const slug = typeof skill.slug === 'string' ? skill.slug.trim() : '';
      const parts = [];
      if (name.length > 0 && name !== title) parts.push(name);
      if (slug.length > 0 && slug !== title && slug !== name) parts.push(slug);
      return parts.join(' · ');
    }

    /** The directory (bundle) or file (flat skill) the row points at. */
    function locationOf(skill) {
      if (skill.kind === 'file') return skill.path;
      return typeof skill.dir === 'string' && skill.dir.length > 0 ? skill.dir : skill.path;
    }

    function formatBytes(bytes) {
      const value = Number(bytes);
      if (!Number.isFinite(value) || value <= 0) return '0 B';
      const units = ['B', 'KB', 'MB', 'GB'];
      let size = value;
      let unit = 0;
      while (size >= 1024 && unit < units.length - 1) {
        size /= 1024;
        unit += 1;
      }
      const shown = unit === 0 ? String(Math.round(size)) : size >= 100 ? String(Math.round(size)) : size.toFixed(1);
      return shown + ' ' + units[unit];
    }

    function formatDate(iso, localeId) {
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return String(iso);
      try {
        return new Intl.DateTimeFormat(localeId === 'zh' ? 'zh-CN' : 'en-US', {
          year: 'numeric',
          month: localeId === 'zh' ? 'long' : 'short',
          day: 'numeric',
        }).format(date);
      } catch {
        return date.toISOString().slice(0, 10);
      }
    }

    function invocationKey(skill) {
      if (skill.modelInvocable && skill.userInvocable) return 'invBoth';
      if (skill.modelInvocable) return 'invModel';
      if (skill.userInvocable) return 'invUser';
      return 'invNone';
    }

    function sourceKey(source) {
      if (source === 'user') return 'sourceUser';
      if (source === 'agents') return 'sourceAgents';
      if (source === 'project') return 'sourceProject';
      return 'sourceCustom';
    }

    /** Registry publisher first, then the frontmatter author; never a bare numeric id. */
    function publisherOf(skill) {
      for (const candidate of [skill.publisherName, skill.author, skill.owner]) {
        if (typeof candidate !== 'string') continue;
        const value = candidate.trim();
        if (value.length === 0 || /^\d+$/.test(value)) continue;
        return value;
      }
      return '';
    }

    /** One tiny external store shared between the page and the overlay. */
    function createStore(initial) {
      let current = initial;
      const listeners = new Set();
      return {
        get: () => current,
        set(next) {
          if (current === next) return;
          current = next;
          for (const listener of Array.from(listeners)) listener();
        },
        subscribe(listener) {
          listeners.add(listener);
          return () => {
            listeners.delete(listener);
          };
        },
      };
    }

    function useSkills(route, revision) {
      const [state, setState] = useState({ status: 'loading', data: null, error: null });
      const [tick, setTick] = useState(0);
      const [force, setForce] = useState(false);
      useEffect(() => {
        const controller = new AbortController();
        let active = true;
        setState((previous) => ({
          status: previous.data === null ? 'loading' : 'refreshing',
          data: previous.data,
          error: null,
        }));
        fetch(force ? route + '?refresh=1' : route, { signal: controller.signal, headers: { accept: 'application/json' } })
          .then((response) => {
            if (!response.ok) throw new Error('HTTP ' + response.status);
            return response.json();
          })
          .then((data) => {
            if (active) setState({ status: 'ready', data, error: null });
          })
          .catch((error) => {
            if (!active || error === undefined || error === null || error.name === 'AbortError') return;
            setState((previous) => ({
              status: 'error',
              data: previous.data,
              error: String(error.message || error),
            }));
          });
        return () => {
          active = false;
          controller.abort();
        };
      }, [route, tick, revision, force]);
      const reload = useCallback((forceRefresh = false) => {
        setForce(forceRefresh === true);
        setTick((value) => value + 1);
      }, []);
      return { ...state, reload };
    }

    function useLocale(ctx) {
      const subscribe = useCallback((onChange) => ctx.locale.subscribe(onChange), []);
      const getSnapshot = useCallback(() => ctx.locale.getSnapshot(), []);
      return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    }

    function useCopyPath() {
      const [copied, setCopied] = useState(false);
      const timer = useRef(null);
      useEffect(() => () => {
        if (timer.current !== null) clearTimeout(timer.current);
      }, []);
      const copy = useCallback((text) => {
        const done = () => {
          setCopied(true);
          if (timer.current !== null) clearTimeout(timer.current);
          timer.current = setTimeout(() => setCopied(false), 1600);
        };
        try {
          const pending = navigator.clipboard.writeText(text);
          if (pending !== undefined && typeof pending.then === 'function') pending.then(done, () => {});
          else done();
        } catch {
          /* clipboard unavailable */
        }
      }, []);
      const reset = useCallback(() => setCopied(false), []);
      return { copied, copy, reset };
    }

    /** Ask the Host to delete one skill after the confirmation dialog. */
    async function requestUninstall(id) {
      const response = await fetch(UNINSTALL_ROUTE, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }
      if (!response.ok) {
        throw new Error(payload !== null && typeof payload.error === 'string' ? payload.error : 'HTTP ' + response.status);
      }
      return payload;
    }

    function createPage(ctx, t, selection, revision) {
      return function SkillGalleryPage() {
        const snapshot = useLocale(ctx);
        const localeId = snapshot.active;
        const revisionValue = useSyncExternalStore(revision.subscribe, revision.get, revision.get);
        const { status, data, error, reload } = useSkills(ROUTE, revisionValue);
        const current = useSyncExternalStore(selection.subscribe, selection.get, selection.get);
        const [query, setQuery] = useState('');
        const [checkingId, setCheckingId] = useState(null);
        const busyRef = useRef(false);

        useEffect(() => {
          if (status === 'refreshing' || status === 'loading') {
            if (checkingId !== null) busyRef.current = true;
            return;
          }
          if (busyRef.current) {
            busyRef.current = false;
            setCheckingId(null);
          }
        }, [status, checkingId]);

        useEffect(() => () => selection.set(null), [selection]);

        // Returning to the page re-scans, so newly installed skills show up.
        useEffect(() => {
          const onFocus = () => reload();
          const onVisible = () => {
            if (document.visibilityState === 'visible') reload();
          };
          const timer = window.setInterval(onFocus, 60000);
          window.addEventListener('focus', onFocus);
          document.addEventListener('visibilitychange', onVisible);
          return () => {
            window.clearInterval(timer);
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onVisible);
          };
        }, [reload]);

        const skills = data !== null && Array.isArray(data.skills) ? data.skills : [];
        const totalBytes = useMemo(() => skills.reduce((sum, skill) => sum + (Number(skill.bytes) || 0), 0), [skills]);
        const normalized = query.trim().toLowerCase();
        const visible = useMemo(() => {
          if (normalized.length === 0) return skills;
          return skills.filter((skill) => {
            const haystack = [skill.title, skill.name, skill.zhName, skill.registryName, skill.slug, skill.description, skill.owner]
              .concat(Array.isArray(skill.tags) ? skill.tags : [])
              .filter((part) => typeof part === 'string' && part.length > 0)
              .join(' ')
              .toLowerCase();
            return haystack.includes(normalized);
          });
        }, [skills, normalized]);

        const metaItem = (icon, text) => h('span', { className: 'skg-meta-item' }, icon(), h('span', null, text));

        const renderCard = (skill) => {
          const active = current !== null && current.skill.id === skill.id;
          const title = displayTitleOf(skill);
          const subtitle = subtitleOf(skill);
          return h(
            'article',
            { key: skill.id, className: 'skg-card' + (active ? ' skg-card-active' : '') },
            h(
              'div',
              { className: 'skg-card-body' },
              h(
                'div',
                { className: 'skg-card-main' },
                h(
                  'div',
                  { className: 'skg-title-row' },
                  h('span', { className: 'skg-title', title: title + (subtitle ? ' · ' + subtitle : '') }, title),
                  h('span', { className: 'skg-badge' }, t('installed')),
                  typeof skill.version === 'string' && skill.version.length > 0
                    ? h('span', { className: 'skg-version' }, 'v' + skill.version)
                    : null,
                ),
                h('div', { className: 'skg-slug', title: subtitle }, subtitle),
                h('p', { className: 'skg-desc' }, skill.description || t('noDescription')),
                h(
                  'div',
                  { className: 'skg-meta' },
                  metaItem(FileIcon, t('files', { n: skill.files })),
                  metaItem(DiskIcon, formatBytes(skill.bytes)),
                ),
                typeof skill.updatedAt === 'string' && skill.updatedAt.length > 0
                  ? h(
                      'div',
                      { className: 'skg-meta skg-meta-date' },
                      metaItem(ClockIcon, t('updated', { date: formatDate(skill.updatedAt, localeId) })),
                    )
                  : null,
              ),
            ),
            h(
              'div',
              { className: 'skg-foot' },
              skill.updateAvailable === true && typeof skill.latestVersion === 'string'
                ? h('span', { className: 'skg-update' }, t('updateAvailable') + ' v' + skill.latestVersion)
                : null,
              h(
                'div',
                { className: 'skg-foot-actions' },
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'skg-icon-btn',
                    title: t('checkUpdates'),
                    'aria-label': t('checkUpdates'),
                    disabled: refreshing,
                    onClick: () => checkOne(skill),
                  },
                  h('span', { className: checkingId === skill.id && refreshing ? 'skg-spin' : undefined }, RefreshIcon()),
                ),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'skg-btn',
                    'aria-haspopup': 'dialog',
                    onClick: () => selection.set({ skill, mode: 'detail' }),
                  },
                  t('detail'),
                ),
                skill.removable === false
                  ? null
                  : h(
                      'button',
                      { type: 'button', className: 'skg-btn skg-btn-danger', onClick: () => selection.set({ skill, mode: 'uninstall' }) },
                      t('uninstall'),
                    ),
              ),
            ),
          );
        };

        const showSkeleton = status === 'loading' && data === null;
        const showError = status === 'error' && data === null;
        const refreshing = status === 'refreshing' || (status === 'loading' && data !== null);

        const checkOne = (skill) => {
          if (refreshing || checkingId !== null) return;
          setCheckingId(skill.id);
          reload(true);
        };

        return h(
          'div',
          { className: 'skg-page', 'aria-label': t('title'), 'data-testid': 'skill-gallery-page' },
          h('style', null, CSS),
          h(
            'div',
            { className: 'skg-scroll' },
            h(
              'div',
              { className: 'skg-content' },
              h(
                'div',
                { className: 'skg-head' },
                h('div', null, h('h1', null, t('title')), h('p', { className: 'skg-sub' }, t('subtitle'))),
                h(
                  'button',
                  { type: 'button', className: 'skg-refresh', disabled: status === 'loading', onClick: () => reload() },
                  h('span', { className: refreshing ? 'skg-spin' : undefined }, RefreshIcon()),
                  t('refresh'),
                ),
              ),
              h(
                'div',
                { className: 'skg-toolbar' },
                h(
                  'label',
                  { className: 'skg-search' },
                  SearchIcon(),
                  h('input', {
                    value: query,
                    onChange: (event) => setQuery(event.target.value),
                    placeholder: t('search'),
                    'aria-label': t('search'),
                    type: 'search',
                  }),
                ),
                h('span', { className: 'skg-spacer' }),
                data !== null
                  ? h('span', { className: 'skg-stats' }, t('stats', { n: skills.length, size: formatBytes(totalBytes) }))
                  : null,
                h(
                  'button',
                  { type: 'button', className: 'skg-btn', disabled: status === 'loading' || refreshing, onClick: () => reload(true) },
                  t('checkUpdates'),
                ),
              ),
              showSkeleton
                ? h(
                    'div',
                    { className: 'skg-grid skg-sk-pulse', 'aria-busy': 'true' },
                    [0, 1, 2].map((index) =>
                      h(
                        'div',
                        { key: index, className: 'skg-skeleton' },
                        h('div', { className: 'skg-sk-line w60' }),
                        h('div', { className: 'skg-sk-line' }),
                        h('div', { className: 'skg-sk-line w80' }),
                      ),
                    ),
                  )
                : showError
                  ? h(
                      'div',
                      { className: 'skg-msg skg-error', role: 'alert' },
                      h('span', { className: 'skg-msg-icon' }, h(GalleryIcon, { size: 28 })),
                      h('p', { className: 'skg-msg-title' }, t('errorTitle')),
                      h('p', { className: 'skg-msg-hint' }, error || ''),
                      h('button', { type: 'button', className: 'skg-btn', onClick: reload }, t('retry')),
                    )
                  : skills.length === 0
                    ? h(
                        'div',
                        { className: 'skg-msg' },
                        h('span', { className: 'skg-msg-icon' }, h(GalleryIcon, { size: 28 })),
                        h('p', { className: 'skg-msg-title' }, t('emptyTitle')),
                        h('p', { className: 'skg-msg-hint' }, t('emptyHint')),
                        h('button', { type: 'button', className: 'skg-btn', onClick: reload }, t('refresh')),
                      )
                    : visible.length === 0
                      ? h(
                          'div',
                          { className: 'skg-msg' },
                          h('span', { className: 'skg-msg-icon' }, h(GalleryIcon, { size: 28 })),
                          h('p', { className: 'skg-msg-title' }, t('noResults')),
                          h('p', { className: 'skg-msg-hint' }, t('noResultsHint')),
                        )
                      : h(
                          'div',
                          { className: 'skg-grid', 'data-refreshing': refreshing ? 'true' : 'false' },
                          visible.map(renderCard),
                        ),
            ),
          ),
        );
      };
    }

    function createOverlay(ctx, t, selection, revision) {
      return function SkillOverlay() {
        const snapshot = useLocale(ctx);
        const localeId = snapshot.active;
        const current = useSyncExternalStore(selection.subscribe, selection.get, selection.get);
        const skill = current === null ? null : current.skill;
        const mode = current === null ? 'detail' : current.mode;
        const dialogKey = skill === null ? null : skill.id + ':' + mode;
        const dialogRef = useRef(null);
        const closeRef = useRef(null);
        const { copied, copy, reset: resetCopied } = useCopyPath();
        const [uninstalling, setUninstalling] = useState(false);
        const [removeError, setRemoveError] = useState(null);

        useEffect(() => {
          if (dialogKey === null) return undefined;
          resetCopied();
          setUninstalling(false);
          setRemoveError(null);
          const previous = typeof document === 'undefined' ? null : document.activeElement;
          if (closeRef.current !== null) closeRef.current.focus();
          return () => {
            if (previous !== null && typeof previous.focus === 'function') {
              try {
                previous.focus();
              } catch {
                /* the trigger is gone */
              }
            }
          };
        }, [dialogKey, resetCopied]);

        useEffect(() => {
          if (dialogKey === null) return undefined;
          const onKeyDown = (event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              event.stopPropagation();
              selection.set(null);
              return;
            }
            if (event.key !== 'Tab' || dialogRef.current === null) return;
            const focusable = Array.from(
              dialogRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
            ).filter((node) => node.getAttribute('aria-hidden') !== 'true' && !node.hasAttribute('disabled'));
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          };
          window.addEventListener('keydown', onKeyDown, true);
          return () => window.removeEventListener('keydown', onKeyDown, true);
        }, [dialogKey, selection]);

        if (skill === null) return null;

        const title = displayTitleOf(skill);
        const subtitle = subtitleOf(skill);
        const sourceLabel = t(sourceKey(skill.source));
        const publisher = publisherOf(skill);
        const close = () => selection.set(null);

        const confirmUninstall = () => {
          if (uninstalling) return;
          setUninstalling(true);
          setRemoveError(null);
          requestUninstall(skill.id)
            .then(() => {
              revision.set(revision.get() + 1);
              selection.set(null);
            })
            .catch((failure) => {
              setRemoveError(String(failure.message || failure));
            })
            .finally(() => {
              setUninstalling(false);
            });
        };

        if (mode === 'uninstall') {
          return h(
            React.Fragment,
            null,
            h('style', null, CSS),
            h(
              'div',
              {
                className: 'skg-overlay',
                onClick: (event) => {
                  if (event.target === event.currentTarget) close();
                },
              },
              h(
                'div',
                {
                  className: 'skg-dialog skg-dialog-sm',
                  role: 'dialog',
                  'aria-modal': 'true',
                  'aria-labelledby': 'skg-remove-title',
                  ref: dialogRef,
                  onMouseDown: (event) => event.stopPropagation(),
                },
                h(
                  'header',
                  { className: 'skg-dialog-head' },
                  h(
                    'div',
                    { className: 'skg-dialog-ident' },
                    h('h2', { id: 'skg-remove-title', className: 'skg-dialog-title' }, t('uninstallTitle')),
                  ),
                  h(
                    'button',
                    { ref: closeRef, type: 'button', className: 'skg-dialog-close', 'aria-label': t('close'), onClick: close },
                    CloseIcon(),
                  ),
                ),
                h(
                  'div',
                  { className: 'skg-confirm-body' },
                  h('p', { className: 'skg-confirm-text' }, t('uninstallConfirm', { title })),
                  h('p', { className: 'skg-confirm-path' }, locationOf(skill)),
                  h('p', { className: 'skg-confirm-hint' }, t('uninstallHint')),
                  removeError !== null
                    ? h('p', { className: 'skg-confirm-error', role: 'alert' }, t('uninstallFailed', { message: removeError }))
                    : null,
                ),
                h(
                  'footer',
                  { className: 'skg-dialog-foot' },
                  h('span', { className: 'skg-source', title: locationOf(skill) }, FolderIcon(), sourceLabel),
                  h(
                    'div',
                    { className: 'skg-dialog-actions' },
                    h('button', { type: 'button', className: 'skg-btn', disabled: uninstalling, onClick: close }, t('cancel')),
                    h(
                      'button',
                      { type: 'button', className: 'skg-btn skg-btn-danger', disabled: uninstalling, onClick: confirmUninstall },
                      uninstalling ? t('uninstalling') : t('uninstall'),
                    ),
                  ),
                ),
              ),
            ),
          );
        }

        const chip = (label, value) =>
          h('span', { className: 'skg-chip' }, h('span', { className: 'skg-chip-label' }, label), h('span', null, value));
        const row = (label, value, valueClass) =>
          h('div', { className: 'skg-detail' }, h('dt', null, label), h('dd', { className: valueClass }, value));

        return h(
          React.Fragment,
          null,
          h('style', null, CSS),
          h(
            'div',
            {
              className: 'skg-overlay',
              onClick: (event) => {
                if (event.target === event.currentTarget) close();
              },
            },
            h(
              'div',
              {
                className: 'skg-dialog',
                role: 'dialog',
                'aria-modal': 'true',
                'aria-labelledby': 'skg-dialog-title',
                ref: dialogRef,
                onMouseDown: (event) => event.stopPropagation(),
              },
              h(
                'header',
                { className: 'skg-dialog-head' },
                h(
                  'div',
                  { className: 'skg-dialog-ident' },
                  h('h2', { id: 'skg-dialog-title', className: 'skg-dialog-title' }, title),
                  h('div', { className: 'skg-dialog-slug' }, subtitle),
                  h(
                    'div',
                    { className: 'skg-dialog-badges' },
                    h('span', { className: 'skg-badge' }, t('installed')),
                    typeof skill.version === 'string' && skill.version.length > 0
                      ? h('span', { className: 'skg-version' }, 'v' + skill.version)
                      : null,
                  ),
                ),
                h(
                  'button',
                  { ref: closeRef, type: 'button', className: 'skg-dialog-close', 'aria-label': t('close'), onClick: close },
                  CloseIcon(),
                ),
              ),
              h(
                'div',
                { className: 'skg-dialog-body' },
                h('p', { className: 'skg-dialog-desc' }, skill.description || t('noDescription')),
                h(
                  'div',
                  { className: 'skg-chips' },
                  chip(t('fileCountLabel'), String(skill.files)),
                  chip(t('sizeLabel'), formatBytes(skill.bytes)),
                  typeof skill.updatedAt === 'string' && skill.updatedAt.length > 0
                    ? chip(t('updatedLabel'), formatDate(skill.updatedAt, localeId))
                    : null,
                ),
                h(
                  'dl',
                  { className: 'skg-dialog-rows' },
                  h(
                    'div',
                    { className: 'skg-detail' },
                    h('dt', null, t('path')),
                    h(
                      'dd',
                      { className: 'skg-path-cell' },
                      h('span', { className: 'skg-mono' }, locationOf(skill)),
                      h(
                        'button',
                        { type: 'button', className: 'skg-copy-btn', onClick: () => copy(locationOf(skill)) },
                        copied ? t('copied') : t('copyPath'),
                      ),
                    ),
                  ),
                  row(t('source'), skill.via === 'skillhub' ? t('viaSkillhub') : sourceLabel),
                  row(t('invocation'), t(invocationKey(skill))),
                  typeof skill.version === 'string' && skill.version.length > 0
                    ? row(t('version'), 'v' + skill.version)
                    : null,
                  typeof skill.latestVersion === 'string' && skill.latestVersion.length > 0
                    ? row(
                        t('latestVersion'),
                        'v' + skill.latestVersion + ' · ' + (skill.updateAvailable === true ? t('updateAvailable') : t('upToDate')),
                        skill.updateAvailable === true ? 'skg-outdated' : undefined,
                      )
                    : null,
                  publisher.length > 0 ? row(t('owner'), publisher) : null,
                ),
              ),
              h(
                'footer',
                { className: 'skg-dialog-foot' },
                h('span', { className: 'skg-source', title: locationOf(skill) }, FolderIcon(), sourceLabel),
                h(
                  'div',
                  { className: 'skg-dialog-actions' },
                  skill.removable === false
                    ? null
                    : h(
                        'button',
                        { type: 'button', className: 'skg-btn skg-btn-danger', onClick: () => selection.set({ skill, mode: 'uninstall' }) },
                        t('uninstall'),
                      ),
                  h('button', { type: 'button', className: 'skg-btn', onClick: close }, t('close')),
                ),
              ),
            ),
          ),
        );
      };
    }

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
    })(require);
    /* ---- section: cleanup (from session-cleanup/client.js) ---- */
    const SessionCleanup = (function (require) {

    const React = require('react');
    const h = React.createElement;
    const { useCallback, useEffect, useMemo, useRef, useState } = React;

    const NS = 'sessionCleanup';
    const PANEL_ID = 'session-cleanup';
    const DELETE_ROUTE = '/session-cleanup/delete';

    const CSS = [
      '.wsc-page{display:flex;flex-direction:column;width:100%;height:100%;min-height:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:14px;line-height:1.6}',
      '.wsc-scroll{flex:1;min-height:0;overflow:auto;scrollbar-gutter:stable}',
      '.wsc-content{box-sizing:border-box;max-width:880px;margin:0 auto;padding:28px clamp(24px,4vw,48px) 40px}',
      '.wsc-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px}',
      '.wsc-head h1{margin:0;font-size:20px;font-weight:500;line-height:28px}',
      '.wsc-sub{margin:6px 0 0;max-width:54ch;color:var(--dsw-alias-label-secondary);font-size:13px}',
      '.wsc-stats{flex:none;text-align:right;white-space:nowrap;color:var(--dsw-alias-label-secondary);font-size:12px}',
      '.wsc-stats b{font-weight:500;color:var(--dsw-alias-label-primary)}',
      '.wsc-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:16px}',
      '.wsc-search{display:flex;align-items:center;flex:1 1 220px;min-width:170px;height:36px;padding:0 10px;border:.5px solid var(--dsw-alias-border-l2);border-radius:12px;gap:8px;color:var(--dsw-alias-label-secondary)}',
      '.wsc-search:focus-within{border-color:var(--dsw-alias-brand-primary)}',
      '.wsc-search svg{flex:none}',
      '.wsc-search input{flex:1;min-width:0;height:100%;padding:0;border:0;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;outline:none}',
      '.wsc-search input::placeholder{color:var(--dsw-alias-label-secondary)}',
      '.wsc-select{height:36px;max-width:220px;padding:0 8px;border:.5px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-base);color:inherit;font:inherit;font-size:13px}',
      '.wsc-toggle{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 10px;border:0;border-radius:12px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:13px;cursor:pointer}',
      '.wsc-toggle:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
      '.wsc-toggle input{width:14px;height:14px;margin:0;accent-color:var(--dsw-alias-brand-primary);cursor:pointer}',
      '.wsc-spacer{flex:1 1 auto}',
      '.wsc-btn{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border:.5px solid var(--dsw-alias-border-l2);border-radius:16px;background:transparent;color:inherit;font:inherit;font-size:13px;white-space:nowrap;cursor:pointer}',
      '.wsc-btn:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2)}',
      '.wsc-btn:disabled{opacity:.45;cursor:not-allowed}',
      '.wsc-btn-danger{color:var(--dsw-alias-state-error-primary);border-color:var(--dsw-alias-state-error-primary)}',
      '.wsc-btn-small{height:26px;padding:0 10px;border-radius:13px;font-size:12px}',
      '.wsc-btn-refresh{min-width:86px;justify-content:center}',
      '.wsc-link{padding:2px 6px;border:0;border-radius:8px;background:none;color:var(--dsw-alias-brand-primary);font:inherit;font-size:12px;white-space:nowrap;cursor:pointer}',
      '.wsc-link:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.wsc-group{margin:0 0 16px;overflow:hidden;border:.5px solid var(--dsw-alias-border-l1);border-radius:14px;background:var(--dsw-alias-bg-layer-1)}',
      '.wsc-group-head{display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:.5px solid var(--dsw-alias-border-l1)}',
      '.wsc-caret{display:flex;align-items:center;justify-content:center;flex:none;width:24px;height:24px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer}',
      '.wsc-caret:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.wsc-caret svg{transition:transform .12s ease}',
      '.wsc-caret-open svg{transform:rotate(90deg)}',
      '.wsc-group-title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:500}',
      '.wsc-group-path{flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary);font-size:12px}',
      '.wsc-group-count{flex:none;margin-left:auto;color:var(--dsw-alias-label-secondary);font-size:12px}',
      '.wsc-row{display:flex;align-items:center;gap:10px;padding:9px 12px;border-bottom:.5px solid var(--dsw-alias-border-l1);transition:background-color .12s ease,box-shadow .12s ease}',
      '.wsc-row:last-child{border-bottom:0}',
      '.wsc-row:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.wsc-row-selected{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 12%,transparent);box-shadow:inset 2px 0 0 var(--dsw-alias-brand-primary)}',
      '.wsc-row-selected:hover{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 17%,transparent)}',
      '.wsc-row-selected .wsc-row-title-text{color:var(--dsw-alias-brand-primary)}',
      '.wsc-row-archived .wsc-row-title-text{color:var(--dsw-alias-label-secondary)}',
      '.wsc-check{flex:none;width:15px;height:15px;margin:0;accent-color:var(--dsw-alias-brand-primary);cursor:pointer}',
      '.wsc-row-running .wsc-check{cursor:not-allowed;opacity:.4}',
      '.wsc-row-running .wsc-row-title{color:var(--dsw-alias-label-secondary)}',
      '.wsc-row-body{display:flex;flex:1;flex-direction:column;gap:1px;min-width:0;padding:0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}',
      '.wsc-row-title{display:flex;align-items:center;gap:6px;min-width:0;font-size:13px}',
      '.wsc-row-caret{display:inline-flex;flex:none;color:var(--dsw-alias-label-secondary);transform:rotate(0deg);transition:transform .12s ease}',
      '.wsc-row-caret-open{transform:rotate(90deg)}',
      '.wsc-row-title-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.wsc-row-meta{display:flex;flex-wrap:wrap;align-items:center;gap:2px 6px;min-width:0;color:var(--dsw-alias-label-secondary);font-size:12px}',
      '.wsc-row-id{flex:1 0 100%;min-width:0;overflow-wrap:anywhere;color:var(--dsw-alias-label-secondary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:1.45}',
      '.wsc-row-meta-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.wsc-badge{display:inline-flex;align-items:center;gap:4px;flex:none;height:17px;padding:0 6px;border:.5px solid var(--dsw-alias-border-l2);border-radius:999px;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:1}',
      '.wsc-dot{flex:none;width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-state-success-primary)}',
      '.wsc-row-actions{position:relative;display:flex;align-items:center;gap:6px;flex:none}',
      '.wsc-row-menu{position:absolute;right:0;top:calc(100% + 4px);z-index:40;display:flex;flex-direction:column;gap:2px;min-width:140px;padding:4px;border:.5px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-1);box-shadow:0 10px 28px color-mix(in srgb,var(--dsw-alias-label-primary) 20%,transparent)}',
      '.wsc-row-menu-item{display:flex;align-items:center;gap:6px;width:100%;height:32px;padding:0 10px;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;text-align:left;cursor:pointer;white-space:nowrap}',
      '.wsc-row-menu-item:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.wsc-row-menu-danger{color:var(--dsw-alias-state-error-primary)}',
      '.wsc-empty{margin:0;padding:32px 12px;text-align:center;color:var(--dsw-alias-label-secondary);font-size:13px}',
      '.wsc-footer{flex:none;display:flex;align-items:center;padding:10px clamp(24px,4vw,48px);border-top:.5px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base)}',
      '.wsc-footer-inner{display:flex;flex-wrap:wrap;align-items:center;gap:8px;box-sizing:border-box;width:100%;max-width:880px;margin:0 auto}',
      '.wsc-footer-info{margin-right:auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary);font-size:12px}',
      '.wsc-notice{position:fixed;left:50%;bottom:24px;z-index:70;transform:translateX(-50%);padding:8px 14px;border:.5px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font-size:13px}',
      '.wsc-overlay{position:fixed;inset:0;z-index:80;pointer-events:auto;display:flex;align-items:center;justify-content:center;padding:24px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 42%,transparent)}',
      '.wsc-mi-wrap{position:relative}',
      '.wsc-mi-sep{height:.5px;margin:3px 2px;background:var(--dsw-alias-border-l2)}',
      '.wsc-mi{display:flex;align-items:center;gap:6px;width:100%;min-height:34px;padding:6px 8px;border:none;border-radius:8px;background:transparent;cursor:pointer;font:inherit;font-size:13px;line-height:20px;color:var(--dsw-alias-label-primary);text-align:left}',
      '.wsc-mi:hover,.wsc-mi:focus-visible{background:var(--dsw-alias-interactive-bg-hover-danger,var(--dsw-alias-bg-layer-2));outline:none}',
      '.wsc-mi-icon{display:inline-flex;align-items:center;justify-content:center;width:12px;height:12px;flex:none;color:var(--dsw-alias-state-error-primary)}',
      '.wsc-mi-label{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-state-error-primary)}',
      '.wsc-dialog{width:min(460px,100%);max-height:calc(100dvh - 48px);overflow:auto;padding:20px;border:.5px solid var(--dsw-alias-border-l2);border-radius:16px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font-size:13px;box-shadow:0 16px 48px color-mix(in srgb,var(--dsw-alias-label-primary) 24%,transparent)}',
      '.wsc-dialog h2{margin:0 0 10px;font-size:15px;font-weight:500;line-height:22px}',
      '.wsc-dialog p{margin:0 0 10px;color:var(--dsw-alias-label-secondary);overflow-wrap:anywhere}',
      '.wsc-dialog-warn{margin:0 0 10px;padding:8px 10px;border-radius:10px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-state-warn-primary)}',
      '.wsc-summary{margin:0 0 10px;padding:8px 10px;border-radius:10px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-size:12px}',
      '.wsc-failures{max-height:180px;margin:0 0 10px;padding:0;overflow:auto;border:.5px solid var(--dsw-alias-border-l1);border-radius:10px;list-style:none}',
      '.wsc-failures li{padding:6px 10px;border-bottom:.5px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);font-size:12px;overflow-wrap:anywhere}',
      '.wsc-failures li:last-child{border-bottom:0}',
      '.wsc-titles{max-height:190px;margin:0 0 10px;padding:0;overflow:auto;border:.5px solid var(--dsw-alias-border-l1);border-radius:10px;list-style:none}',
      '.wsc-titles li{display:flex;align-items:center;gap:8px;padding:6px 10px;border-bottom:.5px solid var(--dsw-alias-border-l1)}',
      '.wsc-titles li:last-child{border-bottom:0}',
      '.wsc-title-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary);font-size:12.5px}',
      '.wsc-title-size{flex:none;color:var(--dsw-alias-label-secondary);font-size:11px}',
      '.wsc-failure-id{color:var(--dsw-alias-label-primary);font-size:12px;font-family:var(--dsw-font-mono,monospace)}',
      '.wsc-dialog-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;margin-top:14px}',
      '.wsc-progress{margin-right:auto;color:var(--dsw-alias-label-secondary);font-size:12px}',
      '.wsc-transcript{display:flex;flex-direction:column;width:min(760px,100%);max-height:calc(100dvh - 48px);overflow:hidden;border:.5px solid var(--dsw-alias-border-l2);border-radius:16px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font-size:13px;box-shadow:0 16px 48px color-mix(in srgb,var(--dsw-alias-label-primary) 24%,transparent)}',
      '.wsc-transcript-head{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border-bottom:.5px solid var(--dsw-alias-border-l1)}',
      '.wsc-back{flex:none;height:28px;padding:0 10px;border:.5px solid var(--dsw-alias-border-l2);border-radius:14px;background:transparent;color:inherit;font:inherit;font-size:12px;cursor:pointer}',
      '.wsc-back:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.wsc-transcript-titles{flex:1;min-width:0}',
      '.wsc-transcript-titles h2{margin:0;font-size:15px;font-weight:600;line-height:22px}',
      '.wsc-transcript-sub{margin:1px 0 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary);font-size:12px}',
      '.wsc-transcript-close{flex:none;width:28px;height:28px;border:0;border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:18px;line-height:1;cursor:pointer}',
      '.wsc-transcript-close:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}',
      '.wsc-transcript-body{overflow:auto;padding:14px 16px 18px}',
      '.wsc-kv{display:flex;flex-direction:column;gap:5px;margin:0 0 16px}',
      '.wsc-kv-row{display:flex;gap:12px;font-size:12.5px;line-height:1.5}',
      '.wsc-kv-key{flex:none;width:84px;color:var(--dsw-alias-label-secondary)}',
      '.wsc-kv-val{min-width:0;overflow-wrap:anywhere;color:var(--dsw-alias-label-primary)}',
      '.wsc-section-title{margin:0 0 8px;font-size:13px;font-weight:600}',
      '.wsc-turn{margin:0 0 8px;overflow:hidden;border:.5px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-base)}',
      '.wsc-turn-head{display:flex;align-items:center;gap:8px;width:100%;padding:8px 10px;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}',
      '.wsc-turn-head:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.wsc-turn-badge{display:inline-flex;align-items:center;flex:none;height:18px;padding:0 7px;border-radius:999px;background:color-mix(in srgb,var(--dsw-alias-brand-primary) 12%,transparent);color:var(--dsw-alias-brand-primary);font-size:11px}',
      '.wsc-turn-time{flex:none;color:var(--dsw-alias-label-secondary);font-size:11px}',
      '.wsc-turn-tools{flex:none;color:var(--dsw-alias-label-secondary);font-size:11px}',
      '.wsc-turn-caret{display:inline-flex;flex:none;margin-left:auto;color:var(--dsw-alias-label-secondary);transition:transform .12s ease}',
      '.wsc-turn-caret-open{transform:rotate(90deg)}',
      '.wsc-turn-question{margin:0 10px 9px;padding:8px 10px;border-radius:8px;background:color-mix(in srgb,var(--dsw-alias-brand-primary) 9%,transparent);color:var(--dsw-alias-brand-primary);font-size:13px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}',
      '.wsc-turn-role-user{margin-right:6px;font-size:11px;font-weight:600;opacity:.85}',
      '.wsc-turn-answer{border-top:.5px solid var(--dsw-alias-border-l1);padding:9px 10px 10px;background:var(--dsw-alias-bg-layer-2)}',
      '.wsc-turn-role-assistant{display:block;margin-bottom:4px;color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:600}',
      '.wsc-turn-text{white-space:pre-wrap;overflow-wrap:anywhere;color:var(--dsw-alias-label-primary);font-size:12.5px;line-height:1.55}',
      '.wsc-turn-muted{color:var(--dsw-alias-label-secondary)}',
      '.wsc-turn-toollist{margin-top:6px;color:var(--dsw-alias-label-secondary);font-size:11px;overflow-wrap:anywhere}',
      '.wsc-transcript-note{margin:0 0 10px;color:var(--dsw-alias-label-secondary);font-size:11px}',
      '.wsc-backup-section{margin:0 0 20px}',
      '.wsc-backup-actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0 0 10px}',
      '.wsc-backup-file{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary);font-size:12px}',
      '.wsc-trash-settings{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0 0 12px;color:var(--dsw-alias-label-secondary);font-size:12.5px}',
      '.wsc-trash-settings input{width:64px;height:28px;padding:0 6px;border:.5px solid var(--dsw-alias-border-l2);border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:12px}',
      '.wsc-trash-row{display:flex;align-items:center;gap:10px;margin:0 0 8px;padding:10px;border:.5px solid var(--dsw-alias-border-l1);border-radius:12px}',
      '.wsc-trash-main{flex:1;min-width:0}',
      '.wsc-trash-title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;color:var(--dsw-alias-label-primary)}',
      '.wsc-trash-meta{margin-top:2px;overflow-wrap:anywhere;color:var(--dsw-alias-label-secondary);font-size:11.5px}',
      '.wsc-trash-actions{display:flex;flex:none;gap:6px}',
      '.wsc-confirm{margin:0 0 12px;padding:10px;border:.5px solid var(--dsw-alias-state-error-primary);border-radius:12px;background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 6%,transparent)}',
      '.wsc-confirm-title{font-size:13px;font-weight:600;color:var(--dsw-alias-state-error-primary)}',
      '.wsc-confirm p{margin:4px 0 0;color:var(--dsw-alias-label-secondary);font-size:12px;overflow-wrap:anywhere}',
      '.wsc-page :focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}',
      '@media (max-width:640px){.wsc-group-path{display:none}.wsc-content{padding:20px 16px 32px}.wsc-footer{padding:8px 16px}.wsc-footer-info{flex:1 0 100%;margin:0 0 2px}.wsc-footer-inner{gap:6px}.wsc-footer-inner .wsc-btn{flex:none}}',
    ].join('');

    const zh = {
      panel: '会话清理',
      title: '会话清理',
      subtitle: '按工作区分组管理会话。归档可恢复；永久删除会从磁盘移除会话日志，无法恢复。',
      searchPlaceholder: '搜索标题、目录或会话 ID',
      allWorkspaces: '全部工作区',
      ungrouped: '未归入工作区',
      showArchived: '显示已归档',
      selectAll: '全选当前结果',
      clearAll: '取消全选',
      archiveSelected: '归档所选（{n}）',
      purgeSelected: '删除（{n}）',
      restoreSelected: '恢复所选（{n}）',
      selectedSummary: '已选择 {n} 个会话',
      noSelection: '勾选会话后可以归档、恢复或永久删除。',
      totalSessions: '个会话',
      archivedSessions: '个已归档',
      empty: '这里还没有会话。',
      noMatches: '没有匹配的会话。',
      loading: '正在加载会话…',
      unnamed: '未命名会话',
      running: '运行中',
      archived: '已归档',
      pinned: '置顶',
      subagent: '子代理',
      openBadge: '打开中',
      archive: '归档',
      restore: '恢复',
      deletePermanently: '删除',
      menuDelete: '删除会话',
      moreActions: '更多',
      viewRecord: '查看',
      transcriptTitle: '对话记录',
      transcriptLoading: '正在读取对话…',
      transcriptError: '读取失败：{message}',
      transcriptMissing: '会话不存在或已被删除。',
      transcriptEmpty: '没有可显示的对话内容。',
      transcriptTruncated: '仅显示最近的 {n} 轮对话。',
      transcriptBack: '返回',
      transcriptCwd: '工作目录',
      transcriptTurns: '对话轮次',
      transcriptUserMessages: '用户消息',
      transcriptToolCalls: '工具调用',
      transcriptSize: '大小',
      transcriptCreated: '创建于',
      transcriptQuestions: '提问记录（共 {n} 条）',
      transcriptTurn: '第 {n} 轮',
      transcriptTools: '工具 {n} 次',
      transcriptNoReply: '（无回复）',
      transcriptUnknown: '未知',
      trashOpen: '回收站',
      backup: '备份',
      backupTitle: '备份 / 恢复',
      backupExportAll: '导出全部会话',
      backupExportHint: '导出一个 .tar.gz，包含会话日志与元数据；运行中的会话可能缺少最后几条。',
      backupImportHint: '选择由本插件导出的 .tar.gz 导入；已存在的会话不会覆盖。',
      backupChooseFile: '选择备份文件',
      backupImport: '导入',
      backupImporting: '正在导入…',
      backupImported: '已导入 {n} 个会话。',
      backupResult: '成功 {ok} · 冲突 {conflict} · 无效 {invalid} · 失败 {failed}',
      backupNoFile: '还没有选择文件。',
      backupFileTooLarge: '备份文件过大（上限 64 MB）。',
      backupStatusImported: '已导入',
      backupStatusConflict: '已存在',
      backupStatusInvalid: '无效',
      backupStatusFailed: '失败',
      backupImportFailed: '导入失败：{message}',
      backupRow: '备份',
      runningLocked: '运行中，不能选择',
      deleteRunningBlocked: '会话正在运行中，不可删除；等这一轮结束再试。',
      backupSelected: '备份已选中（{n}）',
      backupStarted: '已开始导出备份…',
      backupCwdNote: '{n} 个会话的原工作目录不存在，已改写到 {path}。',
      refresh: '刷新',
      refreshing: '刷新中…',
      refreshFailed: '刷新失败：{message}',
      trashTitle: '回收站',
      trashLoading: '正在读取回收站…',
      trashError: '读取失败：{message}',
      trashEmpty: '回收站是空的。',
      trashRetention: '保留天数',
      trashSave: '保存',
      trashSaved: '已保存',
      trashDeletedAt: '删除于',
      trashExpiresIn: '剩余 {n} 天',
      trashRestore: '恢复',
      trashPurge: '永久删除',
      trashConfirmTitle: '永久删除这条记录？',
      trashConfirmBody: '「{title}」将从磁盘彻底删除，无法恢复。',
      trashConfirm: '确认永久删除',
      trashCancel: '取消',
      trashRestored: '已恢复 {n} 个会话。',
      trashPurged: '已永久删除 {n} 条记录。',
      trashFailed: '操作失败：{message}',
      trashSize: '大小',
      trashEmptyAll: '清空回收站（{n}）',
      trashEmptyConfirmTitle: '清空回收站？',
      trashEmptyConfirmBody: '回收站里的 {n} 条记录将被永久删除，无法恢复。',
      trashEmptyConfirm: '确认清空',
      trashEmptied: '已清空回收站（{n} 条）。',
      trashPartial: '已删除 {ok} 条，{failed} 条失败。',
      transcriptUser: '我',
      transcriptAssistant: '助手',
      archiveConfirmTitle: '归档会话',
      archiveConfirmBody: '将把 {n} 个会话从工作区移除（归档）。会话文件保留，可在「显示已归档」中恢复。',
      archiveRunning: '其中 {n} 个会话正在运行。确认后会先停止这些会话的运行，再归档。',
      archiveNotice: '已归档 {n} 个会话。',
      failureSummary: '{ok} 个成功，{failed} 个失败。',
      partialRestore: '恢复完成：{ok} 个成功，{failed} 个失败。',
      restored: '已恢复 {n} 个会话。',
      activeRefused: '会话仍在运行，未能归档。',
      unknownError: '未知错误。',
      cancel: '取消',
      close: '关闭',
      working: '处理中…',
      purgeTitle: '删除会话',
      purgeBody: '将把 {n} 个会话移到回收站。保留期默认 7 天、以回收站里的设置为准，期间可恢复；到期后自动永久删除。',
      purgeChecking: '正在检查 {n} 个会话…',
      purgeCheckFailed: '检查失败：{message}',
      purgeHostUnavailable: 'Host 端删除接口尚未加载，请重启 dsh web 后重试。',
      purgeRetry: '重试',
      purgeRunFailed: '删除请求失败：{message}',
      purgeSummary: '将移入回收站 {n} 个，共 {size}。',
      purgeNothingDeletable: '所选会话都无法删除。',
      purgeIrreversible: '删除只是移入回收站，可随时恢复；要彻底删除请到回收站里操作。',
      purgeBlockedTitle: '{n} 个无法删除：',
      purgeNamesAria: '将要永久删除的会话',
      purgeReasonRunning: '会话正在运行（或还有后台任务在跑），等这一轮结束后再删除。',
      purgeLiveNote: '其中 {n} 个会话仍加载在内存中。文件会移到回收站并自动归档隐藏，重启 dsh web 后才会从列表里彻底消失。',
      purgeReasonMissing: '磁盘上找不到该会话的日志目录，可能已被删除。',
      purgeReasonUnsafe: '目录内容不符合会话日志结构，出于安全已中止。',
      purgeReasonUnsafeDetail: '目录内容不符合会话日志结构，已中止：{detail}',
      purgeReasonFailed: '删除失败。',
      purgeReasonFailedDetail: '删除失败：{detail}',
      purgeReasonUnknown: '无法删除。',
      purgeConfirm: '移到回收站',
      purgeRunning: '正在永久删除 {n} 个会话…',
      processing: '正在处理 {done}/{total}…',
      purgeDone: '已移入回收站 {n} 个会话。',
      purgeDoneNotice: '已移入回收站 {n} 个会话。',
      groupCount: '{n} 个',
      childCount: '{n} 个子代理',
      selectGroup: '全选本组',
      clearGroup: '取消本组',
      collapse: '收起',
      expand: '展开',
    };

    const en = {
      panel: 'Session cleanup',
      title: 'Session cleanup',
      subtitle: 'Manage sessions by workspace. Archive is reversible; permanent delete removes the stored session log from disk and cannot be undone.',
      searchPlaceholder: 'Search title, directory, or session ID',
      allWorkspaces: 'All workspaces',
      ungrouped: 'Not in a workspace',
      showArchived: 'Show archived',
      selectAll: 'Select all results',
      clearAll: 'Clear selection',
      archiveSelected: 'Archive selected ({n})',
      purgeSelected: 'Delete ({n})',
      restoreSelected: 'Restore selected ({n})',
      selectedSummary: '{n} selected',
      noSelection: 'Select sessions to archive, restore, or delete permanently.',
      totalSessions: 'sessions',
      archivedSessions: 'archived',
      empty: 'There are no sessions yet.',
      noMatches: 'No sessions match the current filters.',
      loading: 'Loading sessions…',
      unnamed: 'Untitled session',
      running: 'Running',
      archived: 'Archived',
      pinned: 'Pinned',
      subagent: 'Subagent',
      openBadge: 'Open',
      archive: 'Archive',
      restore: 'Restore',
      deletePermanently: 'Delete',
      menuDelete: 'Delete session',
      moreActions: 'More',
      viewRecord: 'View',
      transcriptTitle: 'Conversation',
      transcriptLoading: 'Loading conversation…',
      transcriptError: 'Failed to load: {message}',
      transcriptMissing: 'The session no longer exists.',
      transcriptEmpty: 'No messages to show.',
      transcriptTruncated: 'Showing only the last {n} turns.',
      transcriptBack: 'Back',
      transcriptCwd: 'Directory',
      transcriptTurns: 'Turns',
      transcriptUserMessages: 'User messages',
      transcriptToolCalls: 'Tool calls',
      transcriptSize: 'Size',
      transcriptCreated: 'Created',
      transcriptQuestions: 'Questions ({n})',
      transcriptTurn: 'Turn {n}',
      transcriptTools: '{n} tool calls',
      transcriptNoReply: '(no reply)',
      transcriptUnknown: 'Unknown',
      trashOpen: 'Recycle bin',
      backup: 'Backup',
      backupTitle: 'Backup / restore',
      backupExportAll: 'Export all sessions',
      backupExportHint: 'Downloads one .tar.gz with session logs and metadata; a running session may miss its last few events.',
      backupImportHint: 'Pick a .tar.gz exported by this plugin; existing sessions are never overwritten.',
      backupChooseFile: 'Choose backup file',
      backupImport: 'Import',
      backupImporting: 'Importing…',
      backupImported: 'Imported {n} sessions.',
      backupResult: '{ok} imported · {conflict} existing · {invalid} invalid · {failed} failed',
      backupNoFile: 'No file chosen yet.',
      backupFileTooLarge: 'The backup file is too large (64 MB limit).',
      backupStatusImported: 'Imported',
      backupStatusConflict: 'Exists',
      backupStatusInvalid: 'Invalid',
      backupStatusFailed: 'Failed',
      backupImportFailed: 'Import failed: {message}',
      backupRow: 'Backup',
      runningLocked: 'Running; cannot be selected',
      deleteRunningBlocked: 'This session is running and cannot be deleted; wait for the turn to finish.',
      backupSelected: 'Back up selected ({n})',
      backupStarted: 'Backup download started…',
      backupCwdNote: '{n} sessions pointed at a directory that does not exist here; rewritten to {path}.',
      refresh: 'Refresh',
      refreshing: 'Refreshing…',
      refreshFailed: 'Refresh failed: {message}',
      trashTitle: 'Recycle bin',
      trashLoading: 'Loading the recycle bin…',
      trashError: 'Failed to load: {message}',
      trashEmpty: 'The recycle bin is empty.',
      trashRetention: 'Keep for (days)',
      trashSave: 'Save',
      trashSaved: 'Saved',
      trashDeletedAt: 'Deleted',
      trashExpiresIn: '{n} days left',
      trashRestore: 'Restore',
      trashPurge: 'Delete permanently',
      trashConfirmTitle: 'Delete this entry permanently?',
      trashConfirmBody: '“{title}” will be removed from disk for good.',
      trashConfirm: 'Delete permanently',
      trashCancel: 'Cancel',
      trashRestored: 'Restored {n} sessions.',
      trashPurged: 'Permanently deleted {n} entries.',
      trashFailed: 'Failed: {message}',
      trashSize: 'Size',
      trashEmptyAll: 'Empty the bin ({n})',
      trashEmptyConfirmTitle: 'Empty the recycle bin?',
      trashEmptyConfirmBody: 'All {n} entries will be deleted permanently.',
      trashEmptyConfirm: 'Empty it',
      trashEmptied: 'Emptied the recycle bin ({n} entries).',
      trashPartial: 'Deleted {ok} entries; {failed} failed.',
      transcriptUser: 'You',
      transcriptAssistant: 'Assistant',
      archiveConfirmTitle: 'Archive sessions',
      archiveConfirmBody: 'This removes {n} sessions from their workspaces (archives them). The stored logs are kept and can be restored with “Show archived”.',
      archiveRunning: '{n} of them are running. Confirming stops their running work first, then archives them.',
      archiveNotice: 'Archived {n} sessions.',
      failureSummary: '{ok} succeeded, {failed} failed.',
      partialRestore: 'Restore finished: {ok} succeeded, {failed} failed.',
      restored: 'Restored {n} sessions.',
      activeRefused: 'The session is still running, so it was not archived.',
      unknownError: 'Unknown error.',
      cancel: 'Cancel',
      close: 'Close',
      working: 'Working…',
      purgeTitle: 'Delete sessions',
      purgeBody: 'This moves {n} sessions to the recycle bin. They are kept for 7 days by default (adjustable in the bin) and can be restored until then; expired entries are deleted permanently.',
      purgeChecking: 'Checking {n} sessions…',
      purgeCheckFailed: 'Check failed: {message}',
      purgeHostUnavailable: 'The Host deletion endpoint is not loaded yet. Restart dsh web and try again.',
      purgeRetry: 'Retry',
      purgeRunFailed: 'The delete request failed: {message}',
      purgeSummary: '{n} will move to the recycle bin, {size} in total.',
      purgeNothingDeletable: 'None of the selected sessions can be deleted.',
      purgeIrreversible: 'Deleting only moves sessions to the recycle bin; permanent deletion happens there.',
      purgeBlockedTitle: '{n} cannot be deleted:',
      purgeNamesAria: 'Sessions to delete permanently',
      purgeReasonRunning: 'The session is running (or still owns background work); wait for the turn to finish, then delete it.',
      purgeLiveNote: '{n} of them are still loaded in memory. Their files move to the recycle bin and the rows are archived to hide them, but they disappear from the list only after dsh web restarts.',
      purgeReasonMissing: 'No stored log directory was found; it may already be deleted.',
      purgeReasonUnsafe: 'The directory does not look like a session log, so deletion was aborted.',
      purgeReasonUnsafeDetail: 'The directory does not look like a session log, so deletion was aborted: {detail}',
      purgeReasonFailed: 'Deletion failed.',
      purgeReasonFailedDetail: 'Deletion failed: {detail}',
      purgeReasonUnknown: 'Cannot delete.',
      purgeConfirm: 'Move to recycle bin',
      purgeRunning: 'Deleting {n} sessions permanently…',
      processing: 'Working {done}/{total}…',
      purgeDone: 'Moved {n} sessions to the recycle bin.',
      purgeDoneNotice: 'Moved {n} sessions to the recycle bin.',
      groupCount: '{n}',
      childCount: '{n} subagents',
      selectGroup: 'Select group',
      clearGroup: 'Clear group',
      collapse: 'Collapse',
      expand: 'Expand',
    };

    function basename(path) {
      if (!path) return '';
      const parts = String(path).split(/[\\/]+/).filter(Boolean);
      return parts.length > 0 ? parts[parts.length - 1] : String(path);
    }

    /** Local `YYYY-MM-DD HH:mm:ss` spelling. */
    function formatDateTime(ms) {
      if (!Number.isFinite(ms)) return '';
      const date = new Date(ms);
      const pad = (value) => String(value).padStart(2, '0');
      return (
        date.getFullYear() +
        '-' +
        pad(date.getMonth() + 1) +
        '-' +
        pad(date.getDate()) +
        ' ' +
        pad(date.getHours()) +
        ':' +
        pad(date.getMinutes()) +
        ':' +
        pad(date.getSeconds())
      );
    }

    function formatBytes(bytes) {
      if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
      const units = ['B', 'KB', 'MB', 'GB'];
      let value = bytes;
      let unit = 0;
      while (value >= 1024 && unit < units.length - 1) {
        value /= 1024;
        unit += 1;
      }
      const digits = value >= 10 || unit === 0 ? 0 : 1;
      return value.toFixed(digits) + ' ' + units[unit];
    }

    function failureMessage(error, t) {
      if (error && error.rpcError) {
        if (error.rpcError.code === 'workspace/session-active') return t('activeRefused');
        if (error.rpcError.message) return String(error.rpcError.message);
      }
      if (error && error.message) return String(error.message);
      return t('unknownError');
    }

    function blockedText(item, t) {
      const detail = typeof item.reason === 'string' && item.reason.length > 0 ? item.reason : undefined;
      switch (item.status) {
        case 'running':
          return t('purgeReasonRunning');
        case 'missing':
          return t('purgeReasonMissing');
        case 'unsafe':
          return detail !== undefined ? t('purgeReasonUnsafeDetail', { detail }) : t('purgeReasonUnsafe');
        case 'failed':
          return detail !== undefined ? t('purgeReasonFailedDetail', { detail }) : t('purgeReasonFailed');
        default:
          return detail ?? t('purgeReasonUnknown');
      }
    }

    /**
     * Call this bundle's authenticated Host route.
     * @param action - 'preview' or 'delete'.
     * @param sessionIds - ids to inspect or delete.
     * @returns the batch report.
     */
    async function callCleanup(action, sessionIds) {
      let response;
      try {
        response = await fetch(DELETE_ROUTE, {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ action, sessionIds }),
        });
      } catch (error) {
        const failure = new Error(error instanceof Error ? error.message : String(error));
        failure.status = 0;
        throw failure;
      }
      let body = null;
      try {
        body = await response.json();
      } catch {
        body = null;
      }
      if (!response.ok) {
        const failure = new Error(body !== null && typeof body.error === 'string' ? body.error : 'HTTP ' + response.status);
        failure.status = response.status;
        throw failure;
      }
      if (body === null || !Array.isArray(body.items)) throw new Error('unexpected cleanup response');
      return body;
    }

    // The sidebar menu and the cleanup page are different slots; one small
    // request bus lets the menu open the same confirmation dialog, which is
    // hosted in `shell.overlay` so it works while the panel is not mounted.
    const purgeBus = (() => {
      let current = null;
      const listeners = new Set();
      const emit = () => {
        for (const listener of listeners) listener(current);
      };
      return {
        open(request) {
          current = request;
          emit();
        },
        close() {
          current = null;
          emit();
        },
        get() {
          return current;
        },
        subscribe(listener) {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
      };
    })();

    /** Collect a session and its descendants with display labels. */
    function collectSubtree(state, rootId, rootLabel) {
      const byId = state !== null && state !== undefined && state.byId !== undefined ? state.byId : {};
      const ids = [rootId];
      const labels = Object.create(null);
      const labelOf = (id) => {
        const row = byId[id];
        return row !== undefined ? row.displayTitle || row.title || '' : '';
      };
      labels[rootId] = rootLabel || labelOf(rootId);
      const walk = (id) => {
        for (const key of Object.keys(byId)) {
          if (ids.includes(key)) continue;
          if (byId[key].parentId !== id) continue;
          ids.push(key);
          labels[key] = labelOf(key);
          walk(key);
        }
      };
      walk(rootId);
      return { ids, labels };
    }

    /** 16px outline trash glyph copied from dsh-web-mobile (IconTrashOutline16). */
    function TrashIcon({ size = 12 }) {
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 16 16',
          fill: 'none',
          'aria-hidden': 'true',
        },
        h('path', {
          fill: 'currentColor',
          d: 'M14.4782 4.84067L14.2138 10.1152C14.1102 12.1872 14.067 13.0115 13.3866 13.9607C13.1044 14.3546 12.7498 14.6912 12.3424 14.9535C11.8239 15.2872 11.2415 15.4316 10.5585 15.4998C9.88727 15.5668 9.04946 15.5656 7.99998 15.5656C6.95051 15.5656 6.1127 15.5668 5.44142 15.4998C4.75851 15.4316 4.17602 15.2872 3.65753 14.9535C3.25012 14.6912 2.89559 14.3546 2.61332 13.9607C1.93296 13.0115 1.88979 12.1872 1.78619 10.1152L1.52179 4.84067L2.89006 4.77277L3.15343 10.0463C3.26221 12.2218 3.32452 12.6015 3.72646 13.1624C3.90825 13.4161 4.13686 13.6334 4.39927 13.8023C4.66204 13.9714 5.00263 14.0792 5.57825 14.1367C6.16562 14.1953 6.92298 14.1963 7.99998 14.1963C9.07699 14.1963 9.83434 14.1953 10.4217 14.1367C10.9973 14.0792 11.3379 14.1367 11.6007 13.8023C11.8631 13.6334 12.0917 13.4161 12.2735 13.1624C12.6755 12.6015 12.7378 12.2218 12.8465 10.0463L13.1099 4.77277L14.4782 4.84067ZM5.43011 6.22849H6.7994V11.3909H5.43011V6.22849ZM9.20056 6.22849H10.5699V11.3909H9.20056V6.22849ZM8.53597 0.434431C9.17976 0.434431 9.6522 0.426926 10.0966 0.571258C10.2357 0.616451 10.3717 0.672554 10.502 0.738948C10.9182 0.951107 11.2464 1.29099 11.7015 1.74612L12.4978 2.54136H15.3742V3.91169H0.625732V2.54136H3.50218L4.29845 1.74612C4.75358 1.29099 5.08174 0.951107 5.49801 0.738948C5.62831 0.672554 5.76425 0.616451 5.90334 0.571258C6.34776 0.426926 6.82021 0.434431 7.46399 0.434431H8.53597ZM7.46399 1.80476C6.73208 1.80476 6.51641 1.81187 6.32617 1.87369C6.25545 1.89667 6.18668 1.92533 6.12041 1.95907C5.96398 2.03878 5.82348 2.16253 5.44142 2.54136H10.5585C10.1765 2.16253 10.036 2.03878 9.87955 1.95907C9.81329 1.92533 9.74452 1.89667 9.6738 1.87369C9.48356 1.81187 9.26789 1.80476 8.53597 1.80476H7.46399Z',
        }),
      );
    }

    function DeleteSessionMenuItem({ sessionId, displayTitle, useSessions, useMenuOpenState, t }) {
      const [, setMenuOpen] = useMenuOpenState();
      const sessionState = useSessions((state) => state);
      const onSelect = () => {
        setMenuOpen(false);
        const running = sessionState.byId[sessionId]?.running === true;
        purgeBus.open(running ? { ids: [], labels: {} } : collectSubtree(sessionState, sessionId, displayTitle));
      };
      return h(
        'div',
        { className: 'wsc-mi-wrap' },
        h('div', { className: 'wsc-mi-sep', role: 'separator' }),
        h(
          'button',
          { type: 'button', role: 'menuitem', className: 'wsc-mi', onClick: onSelect },
          h('span', { className: 'wsc-mi-icon' }, h(TrashIcon)),
          h('span', { className: 'wsc-mi-label' }, t('menuDelete')),
        ),
      );
    }

    /** Root overlay: hosts the permanent-delete dialog for menu callers. */
    function PurgeOverlayHost({ refreshSessions, t }) {
      const [request, setRequest] = useState(() => purgeBus.get());
      useEffect(() => purgeBus.subscribe(setRequest), []);
      const finished = useCallback(() => {
        if (typeof refreshSessions === 'function') refreshSessions().catch(() => {});
        purgeBus.close();
      }, [refreshSessions]);
      return h(
        React.Fragment,
        null,
        h('style', null, CSS),
        request === null
          ? null
          : h(PurgeDialog, {
              ids: request.ids,
              labels: request.labels,
              t,
              onClose: () => purgeBus.close(),
              onFinished: finished,
            }),
      );
    }

    /** Read one session's transcript through the bundle's Host route. */
    async function callTranscript(sessionId) {
      const response = await fetch(DELETE_ROUTE, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'transcript', sessionId }),
      });
      let body = null;
      try {
        body = await response.json();
      } catch {
        body = null;
      }
      if (!response.ok) throw new Error(body !== null && typeof body.error === 'string' ? body.error : 'HTTP ' + response.status);
      if (body === null || body.item === undefined) throw new Error('unexpected transcript response');
      return body.item;
    }

    /** Strip characters that break a download filename. */
    function sanitizeBackupName(value) {
      const cleaned = String(value ?? '')
        .replace(/[\\/:*?"<>|\u0000-\u001f]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/[. ]+$/g, '');
      return cleaned.slice(0, 80) || '会话备份';
    }

    /** Backup filename from the first session title and the session count. */
    function backupFilename(title, count) {
      const base = sanitizeBackupName(title);
      return `${count > 1 ? `${base} 等${count}个会话` : base}.tar.gz`;
    }

    /**
     * Start a native browser download for one backup export.
     *
     * A same-origin GET keeps the transfer in the browser's download manager,
     * so progress shows immediately and large archives never buffer in memory.
     */
    function startBackup(sessionIds, filename) {
      const query = sessionIds === undefined ? 'all=1' : 'ids=' + encodeURIComponent(sessionIds.join(','));
      const anchor = document.createElement('a');
      anchor.href = '/session-cleanup/export?' + query;
      anchor.download = filename;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      window.setTimeout(() => anchor.remove(), 1500);
    }

    /** Upload one backup archive to the Host import route. */
    async function uploadBackup(file) {
      if (file.size > 64 * 1024 * 1024) throw new Error('backup file exceeds the 64 MB limit');
      const bytes = new Uint8Array(await file.arrayBuffer());
      let binary = '';
      const chunk = 0x8000;
      for (let index = 0; index < bytes.length; index += chunk) {
        binary += String.fromCharCode.apply(null, bytes.subarray(index, index + chunk));
      }
      const response = await fetch('/session-cleanup/import', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ data: btoa(binary) }),
      });
      let body = null;
      try {
        body = await response.json();
      } catch {
        body = null;
      }
      if (!response.ok) throw new Error(body !== null && typeof body.error === 'string' ? body.error : 'HTTP ' + response.status);
      if (body === null || !Array.isArray(body.items)) throw new Error('unexpected import response');
      return body;
    }

    /** Call one recycle-bin action through the bundle's Host route. */
    async function callTrash(action, payload = {}) {
      const response = await fetch(DELETE_ROUTE, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
      });
      let body = null;
      try {
        body = await response.json();
      } catch {
        body = null;
      }
      if (!response.ok) throw new Error(body !== null && typeof body.error === 'string' ? body.error : 'HTTP ' + response.status);
      if (body === null) throw new Error('unexpected trash response');
      return body;
    }

    /** Sidebar glyph: a session list with a delete cross. */
    function CleanupIcon({ size = 18, active = false }) {
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: active ? 1.9 : 1.6,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': 'true',
          style: { display: 'block' },
        },
        h('path', { d: 'M4 6h11M4 11h8M4 16h6' }),
        h('path', { d: 'M15 14.5l4.5 4.5M19.5 14.5L15 19' }),
      );
    }

    function SearchIcon() {
      return h(
        'svg',
        {
          width: 14,
          height: 14,
          viewBox: '0 0 16 16',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.4,
          strokeLinecap: 'round',
          'aria-hidden': 'true',
        },
        h('circle', { cx: 7, cy: 7, r: 4.5 }),
        h('path', { d: 'M10.5 10.5L14 14' }),
      );
    }

    function CaretIcon() {
      return h(
        'svg',
        {
          width: 14,
          height: 14,
          viewBox: '0 0 16 16',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.5,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': 'true',
        },
        h('path', { d: 'M6 3.5L10.5 8L6 12.5' }),
      );
    }

    function Badge({ children, dot }) {
      return h('span', { className: 'wsc-badge' }, dot ? h('span', { className: 'wsc-dot' }) : null, children);
    }

    /** Narrow-viewport flag shared by responsive row controls. */
    function useIsMobile() {
      const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches);
      useEffect(() => {
        const media = window.matchMedia('(max-width: 640px)');
        const update = () => setMobile(media.matches);
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
      }, []);
      return mobile;
    }

    function SessionRow({ row, depth, childCount, expanded, archived, pinned, selected, running, open, t, onToggleSelection, onToggleExpand, onArchive, onRestore, onDelete, onView, onBackup }) {
      const isMobile = useIsMobile();
      const [menuOpen, setMenuOpen] = useState(false);
      const menuRef = useRef(null);

      useEffect(() => {
        if (!menuOpen) return undefined;
        const onPointerDown = (event) => {
          if (menuRef.current !== null && !menuRef.current.contains(event.target)) setMenuOpen(false);
        };
        const onKeyDown = (event) => {
          if (event.key === 'Escape') setMenuOpen(false);
        };
        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
          document.removeEventListener('mousedown', onPointerDown);
          document.removeEventListener('keydown', onKeyDown);
        };
      }, [menuOpen]);
      const display = row.displayTitle || row.title || '';
      const title = display !== '' && display !== String(row.id) ? display : t('unnamed');
      const badges = [];
      if (row.running) badges.push(h(Badge, { key: 'running', dot: true }, t('running')));
      if (open) badges.push(h(Badge, { key: 'open' }, t('openBadge')));
      if (pinned) badges.push(h(Badge, { key: 'pinned' }, t('pinned')));
      if (row.origin === 'subagent') badges.push(h(Badge, { key: 'subagent' }, t('subagent')));
      if (archived) badges.push(h(Badge, { key: 'archived' }, t('archived')));
      const meta = [formatDateTime(row.updatedAt)];
      if (row.cwd) meta.push(basename(row.cwd));
      return h(
        'div',
        {
          className: 'wsc-row' + (selected ? ' wsc-row-selected' : '') + (archived ? ' wsc-row-archived' : '') + (running ? ' wsc-row-running' : ''),
          style: depth > 0 ? { paddingLeft: 12 + depth * 18 } : undefined,
        },
        h('input', {
          type: 'checkbox',
          className: 'wsc-check',
          checked: selected,
          disabled: running,
          title: running ? t('runningLocked') : undefined,
          onChange: () => onToggleSelection(row.id),
          'aria-label': title,
        }),
        h(
          'button',
          {
            type: 'button',
            className: 'wsc-row-body',
            'aria-expanded': childCount > 0 ? expanded : undefined,
            onClick: () => {
              if (childCount > 0) onToggleExpand(row.id);
              else if (!running) onToggleSelection(row.id);
            },
          },
          h(
            'span',
            { className: 'wsc-row-title' },
            childCount > 0
              ? h('span', { className: 'wsc-row-caret' + (expanded ? ' wsc-row-caret-open' : ''), 'aria-hidden': true }, h(CaretIcon))
              : null,
            h('span', { className: 'wsc-row-title-text', title }, title),
            badges,
            childCount > 0 ? h(Badge, { key: 'children' }, t('childCount', { n: childCount })) : null,
          ),
          h(
            'span',
            { className: 'wsc-row-meta' },
            meta.filter(Boolean).length > 0 ? h('span', { className: 'wsc-row-meta-text' }, meta.filter(Boolean).join(' · ')) : null,
            h('span', { className: 'wsc-row-id', title: String(row.id) }, String(row.id)),
          ),
        ),
        h(
          'div',
          { className: 'wsc-row-actions', ref: isMobile ? menuRef : undefined },
          isMobile
            ? h(
                React.Fragment,
                null,
                h(
                  'button',
                  { type: 'button', className: 'wsc-btn wsc-btn-small', 'aria-haspopup': 'menu', 'aria-expanded': menuOpen, onClick: () => setMenuOpen((previous) => !previous) },
                  t('moreActions'),
                ),
                menuOpen
                  ? h(
                      'div',
                      { className: 'wsc-row-menu', role: 'menu', 'aria-label': t('moreActions') },
                      h('button', { type: 'button', role: 'menuitem', className: 'wsc-row-menu-item', onClick: () => { setMenuOpen(false); onBackup(row.id); } }, t('backupRow')),
                      h('button', { type: 'button', role: 'menuitem', className: 'wsc-row-menu-item', onClick: () => { setMenuOpen(false); onView(row.id); } }, t('viewRecord')),
                      archived
                        ? h('button', { type: 'button', role: 'menuitem', className: 'wsc-row-menu-item', onClick: () => { setMenuOpen(false); onRestore(row.id); } }, t('restore'))
                        : h('button', { type: 'button', role: 'menuitem', className: 'wsc-row-menu-item', onClick: () => { setMenuOpen(false); onArchive(row.id); } }, t('archive')),
                      h(
                        'button',
                        { type: 'button', role: 'menuitem', className: 'wsc-row-menu-item wsc-row-menu-danger', onClick: () => { setMenuOpen(false); onDelete(row.id); } },
                        h(TrashIcon),
                        t('deletePermanently'),
                      ),
                    )
                  : null,
              )
            : [
                h('button', { key: 'backup', type: 'button', className: 'wsc-btn wsc-btn-small', onClick: () => onBackup(row.id) }, t('backupRow')),
                h('button', { key: 'view', type: 'button', className: 'wsc-btn wsc-btn-small', onClick: () => onView(row.id) }, t('viewRecord')),
                archived
                  ? h('button', { key: 'restore', type: 'button', className: 'wsc-btn wsc-btn-small', onClick: () => onRestore(row.id) }, t('restore'))
                  : h('button', { key: 'archive', type: 'button', className: 'wsc-btn wsc-btn-small', onClick: () => onArchive(row.id) }, t('archive')),
                h(
                  'button',
                  { key: 'delete', type: 'button', className: 'wsc-btn wsc-btn-small wsc-btn-danger', onClick: () => onDelete(row.id) },
                  h(TrashIcon),
                  t('deletePermanently'),
                ),
              ],
        ),
      );
    }

    function TranscriptDialog({ id, t, onClose }) {
      const dialogRef = useRef(null);
      const backRef = useRef(null);
      const [phase, setPhase] = useState('loading');
      const [item, setItem] = useState(null);
      const [error, setError] = useState(null);
      const [openTurn, setOpenTurn] = useState(null);
      const closeRef = useRef(onClose);
      closeRef.current = onClose;

      useEffect(() => {
        let cancelled = false;
        void (async () => {
          try {
            const value = await callTranscript(id);
            if (cancelled) return;
            setItem(value);
            setPhase(value.status === 'ok' ? 'ready' : 'missing');
          } catch (failure) {
            if (cancelled) return;
            setError(failure);
            setPhase('error');
          }
        })();
        return () => {
          cancelled = true;
        };
      }, [id]);

      useEffect(() => {
        if (backRef.current !== null) backRef.current.focus();
      }, [phase]);

      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          closeRef.current();
          return;
        }
        if (event.key !== 'Tab') return;
        const root = dialogRef.current;
        if (root === null) return;
        const nodes = root.querySelectorAll('button, input, select, a[href]');
        const focusables = [];
        for (let index = 0; index < nodes.length; index += 1) {
          if (!nodes[index].disabled) focusables.push(nodes[index]);
        }
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };

      const toggleTurn = (index) => {
        setOpenTurn((previous) => (previous === index ? null : index));
      };

      const title = item !== null && typeof item.title === 'string' && item.title.length > 0 ? item.title : String(id);
      const turns = item !== null && Array.isArray(item.turns) ? item.turns : [];
      const stats = item !== null && item.stats !== undefined ? item.stats : { turns: 0, userMessages: 0, toolCalls: 0 };

      const rows = [];
      if (item !== null && item.status === 'ok') {
        rows.push(['transcriptCwd', item.cwd !== undefined ? item.cwd : t('transcriptUnknown')]);
        rows.push(['transcriptTurns', String(stats.turns)]);
        rows.push(['transcriptUserMessages', String(stats.userMessages)]);
        rows.push(['transcriptToolCalls', String(stats.toolCalls)]);
        rows.push(['transcriptSize', Number.isFinite(item.sizeBytes) ? formatBytes(item.sizeBytes) : t('transcriptUnknown')]);
        rows.push(['transcriptCreated', Number.isFinite(item.createdAt) ? formatDateTime(item.createdAt) : t('transcriptUnknown')]);
      }

      return h(
        'div',
        {
          className: 'wsc-overlay',
          onMouseDown: (event) => {
            if (event.target === event.currentTarget) onClose();
          },
          onKeyDown: handleKeyDown,
        },
        h(
          'div',
          { className: 'wsc-transcript', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'wsc-transcript-title', ref: dialogRef, tabIndex: -1 },
          h(
            'div',
            { className: 'wsc-transcript-head' },
            h('button', { type: 'button', className: 'wsc-back', ref: backRef, onClick: onClose }, '← ' + t('transcriptBack')),
            h(
              'div',
              { className: 'wsc-transcript-titles' },
              h('h2', { id: 'wsc-transcript-title' }, t('transcriptTitle')),
              h('p', { className: 'wsc-transcript-sub', title }, title),
            ),
            h('button', { type: 'button', className: 'wsc-transcript-close', 'aria-label': t('close'), onClick: onClose }, '×'),
          ),
          h(
            'div',
            { className: 'wsc-transcript-body' },
            phase === 'loading' ? h('p', null, t('transcriptLoading')) : null,
            phase === 'error'
              ? h('p', { className: 'wsc-dialog-warn' }, t('transcriptError', { message: error !== null && error !== undefined && error.message ? error.message : String(error) }))
              : null,
            phase === 'missing' ? h('p', { className: 'wsc-dialog-warn' }, t('transcriptMissing')) : null,
            phase === 'ready'
              ? h(
                  React.Fragment,
                  null,
                  h(
                    'div',
                    { className: 'wsc-kv' },
                    rows.map(([key, value]) =>
                      h(
                        'div',
                        { key, className: 'wsc-kv-row' },
                        h('span', { className: 'wsc-kv-key' }, t(key)),
                        h('span', { className: 'wsc-kv-val' }, String(value)),
                      ),
                    ),
                  ),
                  h('h3', { className: 'wsc-section-title' }, t('transcriptQuestions', { n: stats.userMessages })),
                  turns.length === 0 ? h('p', { className: 'wsc-empty' }, t('transcriptEmpty')) : null,
                  turns.map((turn) => {
                    const open = openTurn === turn.index;
                    return h(
                      'div',
                      { className: 'wsc-turn', key: String(turn.index) + '-' + String(turn.time) },
                      h(
                        'button',
                        { type: 'button', className: 'wsc-turn-head', 'aria-expanded': open, onClick: () => toggleTurn(turn.index) },
                        h('span', { className: 'wsc-turn-badge' }, t('transcriptTurn', { n: turn.index })),
                        h('span', { className: 'wsc-turn-time' }, Number.isFinite(turn.time) ? formatDateTime(turn.time) : ''),
                        h('span', { className: 'wsc-turn-tools' }, t('transcriptTools', { n: Array.isArray(turn.tools) ? turn.tools.length : 0 })),
                        h('span', { className: 'wsc-turn-caret' + (open ? ' wsc-turn-caret-open' : ''), 'aria-hidden': 'true' }, h(CaretIcon)),
                      ),
                      h(
                        'div',
                        { className: 'wsc-turn-question' },
                        turn.userText.length > 0 ? h('span', { className: 'wsc-turn-role-user' }, t('transcriptUser')) : null,
                        turn.userText.length > 0 ? turn.userText : t('transcriptUnknown'),
                      ),
                      open
                        ? h(
                            'div',
                            { className: 'wsc-turn-answer' },
                            h('span', { className: 'wsc-turn-role-assistant' }, t('transcriptAssistant')),
                            turn.assistantText.length > 0
                              ? h('div', { className: 'wsc-turn-text' }, turn.assistantText)
                              : h('div', { className: 'wsc-turn-text wsc-turn-muted' }, t('transcriptNoReply')),
                            Array.isArray(turn.tools) && turn.tools.length > 0 ? h('div', { className: 'wsc-turn-toollist' }, turn.tools.join(' · ')) : null,
                          )
                        : null,
                    );
                  }),
                  item !== null && item.truncated === true ? h('p', { className: 'wsc-transcript-note' }, t('transcriptTruncated', { n: item.total })) : null,
                )
              : null,
          ),
        ),
      );
    }

    function BackupDialog({ t, onClose, onImported }) {
      const dialogRef = useRef(null);
      const backRef = useRef(null);
      const closeRef = useRef(onClose);
      closeRef.current = onClose;
      const inputRef = useRef(null);
      const [busy, setBusy] = useState(null);
      const [file, setFile] = useState(null);
      const [notice, setNotice] = useState(null);
      const [result, setResult] = useState(null);

      const messageOf = (failure) => (failure !== null && failure !== undefined && failure.message ? failure.message : String(failure));

      useEffect(() => {
        if (backRef.current !== null) backRef.current.focus();
      }, []);

      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          if (busy === null) closeRef.current();
          return;
        }
        if (event.key !== 'Tab') return;
        const root = dialogRef.current;
        if (root === null) return;
        const nodes = root.querySelectorAll('button, input, select, a[href]');
        const focusables = [];
        for (let index = 0; index < nodes.length; index += 1) {
          if (!nodes[index].disabled) focusables.push(nodes[index]);
        }
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };

      const exportAll = () => {
        if (busy !== null) return;
        startBackup(undefined, '会话备份-全部会话.tar.gz');
        setNotice(t('backupStarted'));
      };

      const importFile = async () => {
        if (busy !== null || file === null) return;
        if (file.size > 64 * 1024 * 1024) {
          setNotice(t('backupFileTooLarge'));
          return;
        }
        setBusy('import');
        setNotice(null);
        setResult(null);
        try {
          const body = await uploadBackup(file);
          setResult(body);
          const imported = body.items.filter((item) => item.status === 'imported').length;
          if (imported > 0) onImported();
          const rewritten = Number(body.rewritten || 0);
          const note = t('backupImported', { n: imported }) + (rewritten > 0 ? ' ' + t('backupCwdNote', { n: rewritten, path: body.targetCwd }) : '');
          setNotice(note);
          if (inputRef.current !== null) inputRef.current.value = '';
        } catch (failure) {
          setNotice(t('backupImportFailed', { message: messageOf(failure) }));
        } finally {
          setBusy(null);
        }
      };

      const statusText = (status) => {
        if (status === 'imported') return t('backupStatusImported');
        if (status === 'conflict') return t('backupStatusConflict');
        if (status === 'invalid') return t('backupStatusInvalid');
        return t('backupStatusFailed');
      };

      const counts = { imported: 0, conflict: 0, invalid: 0, failed: 0 };
      if (result !== null) {
        for (const item of result.items) {
          if (counts[item.status] !== undefined) counts[item.status] += 1;
        }
      }

      return h(
        'div',
        {
          className: 'wsc-overlay',
          onMouseDown: (event) => {
            if (event.target === event.currentTarget && busy === null) onClose();
          },
          onKeyDown: handleKeyDown,
        },
        h(
          'div',
          { className: 'wsc-transcript', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'wsc-backup-title', ref: dialogRef, tabIndex: -1 },
          h(
            'div',
            { className: 'wsc-transcript-head' },
            h('button', { type: 'button', className: 'wsc-back', ref: backRef, onClick: onClose }, '← ' + t('transcriptBack')),
            h('div', { className: 'wsc-transcript-titles' }, h('h2', { id: 'wsc-backup-title' }, t('backupTitle'))),
            h('button', { type: 'button', className: 'wsc-transcript-close', 'aria-label': t('close'), onClick: onClose }, '×'),
          ),
          h(
            'div',
            { className: 'wsc-transcript-body' },
            h(
              'div',
              { className: 'wsc-backup-section' },
              h('h3', { className: 'wsc-section-title' }, t('backupExportAll')),
              h('p', { className: 'wsc-transcript-note' }, t('backupExportHint')),
              h(
                'div',
                { className: 'wsc-backup-actions' },
                h('button', { type: 'button', className: 'wsc-btn', disabled: busy !== null, onClick: () => void exportAll() }, t('backupExportAll')),
              ),
            ),
            h(
              'div',
              { className: 'wsc-backup-section' },
              h('h3', { className: 'wsc-section-title' }, t('backupImport')),
              h('p', { className: 'wsc-transcript-note' }, t('backupImportHint')),
              h('input', {
                type: 'file',
                accept: '.tar.gz,application/gzip,application/x-gzip',
                style: { display: 'none' },
                ref: inputRef,
                onChange: (event) => {
                  const picked = event.target.files !== null && event.target.files.length > 0 ? event.target.files[0] : null;
                  setFile(picked);
                  setResult(null);
                  setNotice(null);
                },
              }),
              h(
                'div',
                { className: 'wsc-backup-actions' },
                h('button', { type: 'button', className: 'wsc-btn', disabled: busy !== null, onClick: () => inputRef.current?.click() }, t('backupChooseFile')),
                h('span', { className: 'wsc-backup-file' }, file !== null ? file.name : t('backupNoFile')),
                h('button', { type: 'button', className: 'wsc-btn', disabled: busy !== null || file === null, onClick: () => void importFile() }, busy === 'import' ? t('backupImporting') : t('backupImport')),
              ),
            ),
            notice !== null ? h('p', { className: 'wsc-dialog-warn' }, notice) : null,
            result !== null
              ? h(
                  React.Fragment,
                  null,
                  h('p', { className: 'wsc-summary' }, t('backupResult', counts)),
                  result.items.filter((item) => item.status !== 'imported').length > 0
                    ? h(
                        'ul',
                        { className: 'wsc-failures' },
                        result.items
                          .filter((item) => item.status !== 'imported')
                          .map((item) =>
                            h(
                              'li',
                              { key: item.id },
                              h('div', { className: 'wsc-failure-id' }, String(item.id)),
                              h('div', null, statusText(item.status) + (item.reason ? '：' + item.reason : '')),
                            ),
                          ),
                      )
                    : null,
                )
              : null,
          ),
        ),
      );
    }

    function TrashDialog({ t, onClose, onChanged }) {
      const dialogRef = useRef(null);
      const backRef = useRef(null);
      const [phase, setPhase] = useState('loading');
      const [items, setItems] = useState([]);
      const [retentionInput, setRetentionInput] = useState('7');
      const [error, setError] = useState(null);
      const [pending, setPending] = useState(null);
      const [confirmEmpty, setConfirmEmpty] = useState(false);
      const [busy, setBusy] = useState(false);
      const [notice, setNotice] = useState(null);
      const closeRef = useRef(onClose);
      closeRef.current = onClose;

      const messageOf = (failure) => (failure !== null && failure !== undefined && failure.message ? failure.message : String(failure));

      const load = useCallback(async () => {
        setPhase('loading');
        setError(null);
        try {
          const body = await callTrash('trash-list');
          setItems(Array.isArray(body.items) ? body.items : []);
          setRetentionInput(String(body.retentionDays));
          setPhase('ready');
        } catch (failure) {
          setError(failure);
          setPhase('error');
        }
      }, []);

      useEffect(() => {
        void load();
      }, [load]);

      useEffect(() => {
        if (backRef.current !== null) backRef.current.focus();
      }, [phase]);

      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          if (!busy) closeRef.current();
          return;
        }
        if (event.key !== 'Tab') return;
        const root = dialogRef.current;
        if (root === null) return;
        const nodes = root.querySelectorAll('button, input, select, a[href]');
        const focusables = [];
        for (let index = 0; index < nodes.length; index += 1) {
          if (!nodes[index].disabled) focusables.push(nodes[index]);
        }
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };

      const restore = async (entry) => {
        if (busy) return;
        setBusy(true);
        setNotice(null);
        try {
          await callTrash('trash-restore', { entryIds: [entry.entryId] });
          await load();
          setNotice(t('trashRestored', { n: 1 }));
          if (typeof onChanged === 'function') onChanged();
        } catch (failure) {
          setNotice(t('trashFailed', { message: messageOf(failure) }));
        } finally {
          setBusy(false);
        }
      };

      const purge = async (entry) => {
        if (busy) return;
        setBusy(true);
        setNotice(null);
        try {
          await callTrash('trash-purge', { entryIds: [entry.entryId] });
          setPending(null);
          await load();
          setNotice(t('trashPurged', { n: 1 }));
          if (typeof onChanged === 'function') onChanged();
        } catch (failure) {
          setNotice(t('trashFailed', { message: messageOf(failure) }));
        } finally {
          setBusy(false);
        }
      };

      const purgeAll = async () => {
        if (busy) return;
        const targets = items.map((entry) => entry.entryId);
        if (targets.length === 0) return;
        setBusy(true);
        setNotice(null);
        try {
          const body = await callTrash('trash-purge', { entryIds: targets });
          const purged = body.items.filter((item) => item.status === 'purged').length;
          const failed = body.items.length - purged;
          setConfirmEmpty(false);
          await load();
          setNotice(failed > 0 ? t('trashPartial', { ok: purged, failed }) : t('trashEmptied', { n: purged }));
          if (typeof onChanged === 'function') onChanged();
        } catch (failure) {
          setNotice(t('trashFailed', { message: messageOf(failure) }));
        } finally {
          setBusy(false);
        }
      };

      const saveRetention = async () => {
        if (busy) return;
        setBusy(true);
        setNotice(null);
        try {
          const body = await callTrash('trash-settings', { retentionDays: Number(retentionInput) });
          setRetentionInput(String(body.retentionDays));
          await load();
          setNotice(t('trashSaved'));
        } catch (failure) {
          setNotice(t('trashFailed', { message: messageOf(failure) }));
        } finally {
          setBusy(false);
        }
      };

      const titleOf = (entry) => (typeof entry.title === 'string' && entry.title.length > 0 ? entry.title : entry.id);

      return h(
        'div',
        {
          className: 'wsc-overlay',
          onMouseDown: (event) => {
            if (event.target === event.currentTarget && !busy) onClose();
          },
          onKeyDown: handleKeyDown,
        },
        h(
          'div',
          { className: 'wsc-transcript', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'wsc-trash-title', ref: dialogRef, tabIndex: -1 },
          h(
            'div',
            { className: 'wsc-transcript-head' },
            h('button', { type: 'button', className: 'wsc-back', ref: backRef, onClick: onClose }, '← ' + t('transcriptBack')),
            h('div', { className: 'wsc-transcript-titles' }, h('h2', { id: 'wsc-trash-title' }, t('trashTitle'))),
            h('button', { type: 'button', className: 'wsc-transcript-close', 'aria-label': t('close'), onClick: onClose }, '×'),
          ),
          h(
            'div',
            { className: 'wsc-transcript-body' },
            h(
              'div',
              { className: 'wsc-trash-settings' },
              h('span', null, t('trashRetention')),
              h('input', {
                type: 'number',
                min: 1,
                max: 365,
                value: retentionInput,
                'aria-label': t('trashRetention'),
                onChange: (event) => setRetentionInput(event.target.value),
              }),
              h('button', { type: 'button', className: 'wsc-btn wsc-btn-small', disabled: busy, onClick: saveRetention }, t('trashSave')),
              h('span', { className: 'wsc-spacer' }),
              h(
                'button',
                { type: 'button', className: 'wsc-btn wsc-btn-small wsc-btn-danger', disabled: busy || items.length === 0, onClick: () => setConfirmEmpty(true) },
                t('trashEmptyAll', { n: items.length }),
              ),
            ),
            notice !== null ? h('p', { className: 'wsc-transcript-note' }, notice) : null,
            phase === 'loading' ? h('p', null, t('trashLoading')) : null,
            phase === 'error' ? h('p', { className: 'wsc-dialog-warn' }, t('trashError', { message: messageOf(error) })) : null,
            phase === 'ready' && items.length === 0 ? h('p', { className: 'wsc-empty' }, t('trashEmpty')) : null,
            confirmEmpty
              ? h(
                  'div',
                  { className: 'wsc-confirm' },
                  h('div', { className: 'wsc-confirm-title' }, t('trashEmptyConfirmTitle')),
                  h('p', null, t('trashEmptyConfirmBody', { n: items.length })),
                  h(
                    'div',
                    { className: 'wsc-dialog-actions' },
                    h('button', { type: 'button', className: 'wsc-btn', disabled: busy, onClick: () => setConfirmEmpty(false) }, t('trashCancel')),
                    h('button', { type: 'button', className: 'wsc-btn wsc-btn-danger', disabled: busy, onClick: () => void purgeAll() }, t('trashEmptyConfirm')),
                  ),
                )
              : null,
            pending !== null
              ? h(
                  'div',
                  { className: 'wsc-confirm' },
                  h('div', { className: 'wsc-confirm-title' }, t('trashConfirmTitle')),
                  h('p', null, t('trashConfirmBody', { title: titleOf(pending) })),
                  h(
                    'div',
                    { className: 'wsc-dialog-actions' },
                    h('button', { type: 'button', className: 'wsc-btn', disabled: busy, onClick: () => setPending(null) }, t('trashCancel')),
                    h('button', { type: 'button', className: 'wsc-btn wsc-btn-danger', disabled: busy, onClick: () => void purge(pending) }, t('trashConfirm')),
                  ),
                )
              : null,
            phase === 'ready'
              ? items.map((entry) =>
                  h(
                    'div',
                    { className: 'wsc-trash-row', key: entry.entryId },
                    h(
                      'div',
                      { className: 'wsc-trash-main' },
                      h('div', { className: 'wsc-trash-title', title: titleOf(entry) }, titleOf(entry)),
                      h(
                        'div',
                        { className: 'wsc-trash-meta' },
                        t('trashDeletedAt') +
                          ' ' +
                          formatDateTime(entry.deletedAt) +
                          ' · ' +
                          t('trashExpiresIn', { n: entry.expiresInDays }) +
                          (Number.isFinite(entry.bytes) ? ' · ' + t('trashSize') + ' ' + formatBytes(entry.bytes) : ''),
                      ),
                    ),
                    h(
                      'div',
                      { className: 'wsc-trash-actions' },
                      h('button', { type: 'button', className: 'wsc-btn wsc-btn-small', disabled: busy, onClick: () => void restore(entry) }, t('trashRestore')),
                      h('button', { type: 'button', className: 'wsc-btn wsc-btn-small wsc-btn-danger', disabled: busy, onClick: () => setPending(entry) }, t('trashPurge')),
                    ),
                  ),
                )
              : null,
          ),
        ),
      );
    }

    function ArchiveDialog({ request, t, archiveSession, onSettled, onClose }) {
      const dialogRef = useRef(null);
      const primaryRef = useRef(null);
      const [busy, setBusy] = useState(null);
      const [failures, setFailures] = useState([]);
      const busyRef = useRef(false);
      const closeRef = useRef(onClose);
      closeRef.current = onClose;

      useEffect(() => {
        if (primaryRef.current !== null) primaryRef.current.focus();
      }, []);

      useEffect(() => {
        busyRef.current = busy !== null;
      }, [busy]);

      useEffect(() => {
        if (failures.length > 0 && primaryRef.current !== null) primaryRef.current.focus();
      }, [failures.length]);

      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          if (!busyRef.current) closeRef.current();
          return;
        }
        if (event.key !== 'Tab') return;
        const root = dialogRef.current;
        if (root === null) return;
        const nodes = root.querySelectorAll('button, input, select, a[href]');
        const focusables = [];
        for (let index = 0; index < nodes.length; index += 1) {
          if (!nodes[index].disabled) focusables.push(nodes[index]);
        }
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };

      const run = async () => {
        if (busyRef.current) return;
        const ids = request.ids;
        setFailures([]);
        setBusy({ done: 0, total: ids.length });
        let ok = 0;
        const failed = [];
        for (let index = 0; index < ids.length; index += 1) {
          const id = ids[index];
          try {
            await archiveSession(id, request.running > 0 ? { stopActivity: true } : undefined);
            ok += 1;
          } catch (error) {
            failed.push({ id, message: failureMessage(error, t) });
          }
          setBusy({ done: index + 1, total: ids.length });
        }
        setBusy(null);
        onSettled(ok, failed.map((entry) => entry.id));
        if (failed.length === 0) {
          onClose();
        } else {
          setFailures(failed);
        }
      };

      const total = request.ids.length;
      const settled = failures.length > 0;
      return h(
        'div',
        {
          className: 'wsc-overlay',
          onMouseDown: (event) => {
            if (event.target === event.currentTarget && !busyRef.current) onClose();
          },
          onKeyDown: handleKeyDown,
        },
        h(
          'div',
          { className: 'wsc-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'wsc-archive-title', ref: dialogRef, tabIndex: -1 },
          h('h2', { id: 'wsc-archive-title' }, t('archiveConfirmTitle')),
          h('p', null, t('archiveConfirmBody', { n: total })),
          request.running > 0 ? h('p', { className: 'wsc-dialog-warn' }, t('archiveRunning', { n: request.running })) : null,
          settled
            ? h(
                'div',
                null,
                h('p', null, t('failureSummary', { ok: total - failures.length, failed: failures.length })),
                h(
                  'ul',
                  { className: 'wsc-failures' },
                  failures.map((entry) =>
                    h(
                      'li',
                      { key: entry.id },
                      h('div', { className: 'wsc-failure-id' }, String(entry.id)),
                      h('div', null, entry.message),
                    ),
                  ),
                ),
              )
            : null,
          h(
            'div',
            { className: 'wsc-dialog-actions' },
            busy !== null ? h('span', { className: 'wsc-progress' }, t('processing', { done: busy.done, total: busy.total })) : null,
            settled
              ? h('button', { type: 'button', className: 'wsc-btn', ref: primaryRef, onClick: onClose }, t('close'))
              : [
                  h('button', { key: 'cancel', type: 'button', className: 'wsc-btn', disabled: busy !== null, onClick: onClose }, t('cancel')),
                  h(
                    'button',
                    { key: 'confirm', type: 'button', className: 'wsc-btn', ref: primaryRef, disabled: busy !== null, onClick: run },
                    busy !== null ? t('working') : t('archive'),
                  ),
                ],
          ),
        ),
      );
    }

    function PurgeDialog({ ids, labels, t, onClose, onFinished }) {
      const dialogRef = useRef(null);
      const primaryRef = useRef(null);
      const [phase, setPhase] = useState(ids.length === 0 ? 'blocked' : 'checking');
      const [previewItems, setPreviewItems] = useState([]);
      const [result, setResult] = useState(null);
      const [error, setError] = useState(null);
      const phaseRef = useRef(phase);
      phaseRef.current = phase;
      const closeRef = useRef(onClose);
      closeRef.current = onClose;

      const nameOf = (id) => {
        const label = labels !== undefined && labels !== null ? labels[id] : undefined;
        return typeof label === 'string' && label.length > 0 ? label : String(id);
      };
      const deletable = previewItems.filter((item) => item.status === 'deletable');
      const blocked = previewItems.filter((item) => item.status !== 'deletable');
      const totalBytes = deletable.reduce((sum, item) => sum + (item.bytes ?? 0), 0);

      useEffect(() => {
        if (phase !== 'confirm' && phase !== 'error' && phase !== 'done' && phase !== 'blocked') return;
        if (primaryRef.current !== null) primaryRef.current.focus();
      }, [phase]);

      const check = useCallback(async () => {
        if (ids.length === 0) {
          setPhase('blocked');
          return;
        }
        setPhase('checking');
        setError(null);
        setPreviewItems([]);
        setResult(null);
        try {
          const report = await callCleanup('preview', ids);
          setPreviewItems(report.items);
          setPhase('confirm');
        } catch (failure) {
          setError({ kind: 'check', failure });
          setPhase('error');
        }
      }, [ids]);

      useEffect(() => {
        if (ids.length === 0) return;
        void check();
      }, [check, ids.length]);

      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          if (phaseRef.current !== 'running') closeRef.current();
          return;
        }
        if (event.key !== 'Tab') return;
        const root = dialogRef.current;
        if (root === null) return;
        const nodes = root.querySelectorAll('button, input, select, a[href]');
        const focusables = [];
        for (let index = 0; index < nodes.length; index += 1) {
          if (!nodes[index].disabled) focusables.push(nodes[index]);
        }
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };

      const run = async () => {
        if (phase !== 'confirm' || deletable.length === 0) return;
        const targetIds = deletable.map((item) => item.id);
        setPhase('running');
        setError(null);
        try {
          const report = await callCleanup('delete', targetIds);
          const deleted = report.items.filter((item) => item.status === 'deleted').map((item) => item.id);
          const failed = report.items.filter((item) => item.status !== 'deleted');
          setResult({ deleted, failed });
          setPhase('done');
          onFinished(deleted, failed.map((item) => item.id));
          if (failed.length === 0) closeRef.current();
        } catch (failure) {
          setError({ kind: 'run', failure });
          setPhase('error');
        }
      };

      const errorText = (entry) => {
        const failure = entry !== null && entry !== undefined ? entry.failure : undefined;
        if (failure !== null && failure !== undefined && failure.status === 404) return t('purgeHostUnavailable');
        const message = failure !== null && failure !== undefined && failure.message ? failure.message : String(failure);
        return entry !== null && entry !== undefined && entry.kind === 'run'
          ? t('purgeRunFailed', { message })
          : t('purgeCheckFailed', { message });
      };

      const body = [];
      if (phase === 'blocked') {
        body.push(h('p', { key: 'blocked', className: 'wsc-dialog-warn' }, t('deleteRunningBlocked')));
        body.push(
          h(
            'div',
            { key: 'blocked-actions', className: 'wsc-dialog-actions' },
            h('button', { type: 'button', className: 'wsc-btn', ref: primaryRef, onClick: onClose }, t('close')),
          ),
        );
      } else if (phase === 'error') {
        body.push(h('p', { key: 'error', className: 'wsc-dialog-warn' }, errorText(error)));
      } else if (phase === 'checking') {
        body.push(h('p', { key: 'checking' }, t('purgeChecking', { n: ids.length })));
      } else if (phase === 'running') {
        body.push(h('p', { key: 'running' }, t('purgeRunning', { n: deletable.length })));
      } else if (phase === 'done') {
        const deletedCount = result !== null ? result.deleted.length : 0;
        const failedItems = result !== null ? result.failed : [];
        body.push(h('p', { key: 'done' }, t('purgeDone', { n: deletedCount })));
        if (failedItems.length > 0) {
          body.push(
            h(
              'ul',
              { key: 'failures', className: 'wsc-failures' },
              failedItems.map((item) =>
                h(
                  'li',
                  { key: item.id },
                  h('div', { className: 'wsc-failure-id' }, nameOf(item.id)),
                  h('div', null, blockedText(item, t)),
                ),
              ),
            ),
          );
        }
      } else if (deletable.length === 0) {
        body.push(h('div', { key: 'nothing', className: 'wsc-dialog-warn' }, t('purgeNothingDeletable')));
        if (blocked.length > 0) {
          body.push(
            h(
              'ul',
              { key: 'blocked', className: 'wsc-failures' },
              blocked.map((item) =>
                h(
                  'li',
                  { key: item.id },
                  h('div', { className: 'wsc-failure-id' }, nameOf(item.id)),
                  h('div', null, blockedText(item, t)),
                ),
              ),
            ),
          );
        }
      } else {
        body.push(h('p', { key: 'intro' }, t('purgeBody', { n: deletable.length })));
        body.push(h('div', { key: 'summary', className: 'wsc-summary' }, t('purgeSummary', { n: deletable.length, size: formatBytes(totalBytes) })));
        body.push(
          h(
            'ul',
            { key: 'titles', className: 'wsc-titles', 'aria-label': t('purgeNamesAria') },
            deletable.map((item) =>
              h(
                'li',
                { key: item.id },
                h('span', { className: 'wsc-title-name', title: nameOf(item.id) }, nameOf(item.id)),
                Number.isFinite(item.bytes) ? h('span', { className: 'wsc-title-size' }, formatBytes(item.bytes)) : null,
              ),
            ),
          ),
        );
        const liveCount = deletable.filter((item) => item.live === true).length;
        if (liveCount > 0) body.push(h('p', { key: 'live-note', className: 'wsc-dialog-warn' }, t('purgeLiveNote', { n: liveCount })));
        body.push(h('p', { key: 'irreversible', className: 'wsc-dialog-warn' }, t('purgeIrreversible')));
        if (blocked.length > 0) {
          body.push(h('p', { key: 'blocked-title' }, t('purgeBlockedTitle', { n: blocked.length })));
          body.push(
            h(
              'ul',
              { key: 'blocked', className: 'wsc-failures' },
              blocked.map((item) =>
                h(
                  'li',
                  { key: item.id },
                  h('div', { className: 'wsc-failure-id' }, nameOf(item.id)),
                  h('div', null, blockedText(item, t)),
                ),
              ),
            ),
          );
        }
      }

      const actions = [];
      if (phase === 'error') {
        actions.push(
          h('button', { key: 'retry', type: 'button', className: 'wsc-btn', onClick: () => void check() }, t('purgeRetry')),
          h('button', { key: 'close', type: 'button', className: 'wsc-btn', ref: primaryRef, onClick: onClose }, t('close')),
        );
      } else if (phase === 'done' || (phase === 'confirm' && deletable.length === 0)) {
        actions.push(h('button', { key: 'close', type: 'button', className: 'wsc-btn', ref: primaryRef, onClick: onClose }, t('close')));
      } else if (phase === 'confirm') {
        actions.push(
          h('button', { key: 'cancel', type: 'button', className: 'wsc-btn', onClick: onClose }, t('cancel')),
          h(
            'button',
            { key: 'confirm', type: 'button', className: 'wsc-btn wsc-btn-danger', ref: primaryRef, onClick: run },
            t('purgeConfirm'),
          ),
        );
      }

      return h(
        'div',
        {
          className: 'wsc-overlay',
          onMouseDown: (event) => {
            if (event.target === event.currentTarget && phaseRef.current !== 'running') onClose();
          },
          onKeyDown: handleKeyDown,
        },
        h(
          'div',
          { className: 'wsc-dialog', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'wsc-purge-title', ref: dialogRef, tabIndex: -1 },
          h('h2', { id: 'wsc-purge-title' }, t('purgeTitle')),
          body,
          actions.length > 0 ? h('div', { className: 'wsc-dialog-actions' }, actions) : null,
        ),
      );
    }

    function SessionCleanupPage(props) {
      const { archiveSession, unarchiveSession, refreshSessions, useSessions, useWorkspaces, t } = props;
      const workspaceState = useWorkspaces((state) => state);
      const sessionState = useSessions((state) => state);

      const workspaces = workspaceState.items || [];
      const ids = sessionState.ids || [];
      const byId = sessionState.byId || {};
      const archivedIds = workspaceState.archivedSessionIds || [];
      const pinnedIds = workspaceState.pinnedSessionIds || [];

      const archivedSet = useMemo(() => new Set(archivedIds), [archivedIds]);
      const pinnedSet = useMemo(() => new Set(pinnedIds), [pinnedIds]);
      const pinRank = useMemo(() => {
        const ranks = new Map();
        pinnedIds.forEach((id, index) => ranks.set(id, index));
        return ranks;
      }, [pinnedIds]);

      const [search, setSearch] = useState('');
      const [scope, setScope] = useState('all');
      const [showArchived, setShowArchived] = useState(false);
      const [collapsed, setCollapsed] = useState(() => new Set());
      const [expanded, setExpanded] = useState(() => new Set());
      const [selected, setSelected] = useState(() => new Set());
      const [archiveRequest, setArchiveRequest] = useState(null);
      const [transcriptId, setTranscriptId] = useState(null);
      const [trashOpen, setTrashOpen] = useState(false);
      const [backupOpen, setBackupOpen] = useState(false);
      const [refreshing, setRefreshing] = useState(false);
      const [orphans, setOrphans] = useState(() => new Set());

      // A session deleted while its Agent was still loaded stays in the Host's
      // in-memory list with no storage left. It cannot be detached from here,
      // so hide those rows: they are gone, not broken.
      const refreshAll = useCallback(async () => {
        setRefreshing(true);
        try {
          if (typeof refreshSessions === 'function') await refreshSessions();
          const body = await callTrash('orphans');
          setOrphans(new Set(Array.isArray(body.ids) ? body.ids : []));
        } catch (failure) {
          setNotice(t('refreshFailed', { message: failure !== null && failure !== undefined && failure.message ? failure.message : String(failure) }));
        } finally {
          setRefreshing(false);
        }
      }, [refreshSessions, t]);

      useEffect(() => {
        void refreshAll();
      }, [refreshAll]);

      const [purgeIds, setPurgeIds] = useState(null);
      const [restoring, setRestoring] = useState(false);
      const [notice, setNotice] = useState(null);

      useEffect(() => {
        if (notice === null) return undefined;
        const timer = window.setTimeout(() => setNotice(null), 5000);
        return () => window.clearTimeout(timer);
      }, [notice]);

      const groups = useMemo(() => {
        const memberOf = new Map();
        for (const workspace of workspaces) {
          for (const id of workspace.sessionIds || []) if (!memberOf.has(id)) memberOf.set(id, workspace.workspaceId);
        }
        // "Who created it owns it": a Session belongs to its nearest ancestor's
        // Workspace. Subagent children therefore stay under the parent that
        // spawned them even when their own header does not list membership.
        const resolved = new Map();
        const resolveGroup = (id) => {
          const trail = [];
          let current = id;
          while (!resolved.has(current)) {
            if (trail.includes(current)) {
              for (const visited of trail) resolved.set(visited, '');
              return '';
            }
            trail.push(current);
            if (memberOf.has(current)) {
              const key = memberOf.get(current);
              for (const visited of trail) resolved.set(visited, key);
              return key;
            }
            const row = byId[current];
            if (!row || !row.parentId) {
              for (const visited of trail) resolved.set(visited, '');
              return '';
            }
            current = row.parentId;
          }
          const key = resolved.get(current);
          for (const visited of trail) resolved.set(visited, key);
          return key;
        };
        const buckets = new Map(workspaces.map((workspace) => [workspace.workspaceId, []]));
        const ungrouped = [];
        for (const id of ids) {
          const row = byId[id];
          if (!row || row.blank) continue;
          const key = resolveGroup(id);
          if (key !== '' && buckets.has(key)) buckets.get(key).push(row);
          else ungrouped.push(row);
        }
        const result = [];
        for (const workspace of workspaces) {
          result.push({
            key: workspace.workspaceId,
            title: workspace.title || basename(workspace.path) || String(workspace.workspaceId),
            path: workspace.path,
            sessions: buckets.get(workspace.workspaceId),
          });
        }
        if (ungrouped.length > 0) result.push({ key: '', title: t('ungrouped'), path: undefined, sessions: ungrouped });
        return result;
      }, [workspaces, byId, ids, t]);

      const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        const out = [];
        for (const group of groups) {
          if (scope !== 'all' && group.key !== scope) continue;
          const rows = [];
          for (const row of group.sessions) {
            if (row.blank) continue;
            if (orphans.has(row.id)) continue;
            const archived = archivedSet.has(row.id);
            if (archived && !showArchived) continue;
            if (query) {
              const haystack = ((row.title || '') + ' ' + row.displayTitle + ' ' + (row.cwd || '') + ' ' + row.id).toLowerCase();
              if (haystack.indexOf(query) < 0) continue;
            }
            rows.push(row);
          }
          if (rows.length === 0) continue;
          const byRowId = new Map(rows.map((row) => [row.id, row]));
          const children = new Map();
          const roots = [];
          for (const row of rows) {
            const parent = row.parentId === undefined ? undefined : byRowId.get(row.parentId);
            if (parent !== undefined && parent.id !== row.id) {
              const list = children.get(parent.id);
              if (list === undefined) children.set(parent.id, [row]);
              else list.push(row);
            } else {
              roots.push(row);
            }
          }
          const compare = (left, right) => {
            const leftArchived = archivedSet.has(left.id) ? 1 : 0;
            const rightArchived = archivedSet.has(right.id) ? 1 : 0;
            if (leftArchived !== rightArchived) return leftArchived - rightArchived;
            const leftPin = pinRank.get(left.id);
            const rightPin = pinRank.get(right.id);
            if (leftPin !== undefined || rightPin !== undefined) {
              if (leftPin === undefined) return 1;
              if (rightPin === undefined) return -1;
              return leftPin - rightPin;
            }
            return (right.updatedAt || 0) - (left.updatedAt || 0);
          };
          roots.sort(compare);
          for (const list of children.values()) list.sort(compare);
          out.push({ key: group.key, title: group.title, path: group.path, rows, children, roots });
        }
        return out;
      }, [groups, scope, archivedSet, showArchived, search, pinRank]);

      // Collapsed is the default: every parent starts folded. A search query
      // unfolds matches so a matching child is never hidden behind its parent.
      const visible = useMemo(() => {
        const searching = search.trim() !== '';
        return filtered.map((group) => {
          const flat = [];
          const walk = (row, depth) => {
            const kids = group.children.get(row.id) ?? [];
            flat.push({ row, depth, childCount: kids.length });
            if (searching || expanded.has(row.id)) for (const child of kids) walk(child, depth + 1);
          };
          for (const root of group.roots) walk(root, 0);
          return { key: group.key, title: group.title, path: group.path, rows: flat, ids: group.rows.map((row) => row.id), count: group.rows.length };
        });
      }, [filtered, expanded, search]);

      const filteredIds = useMemo(() => {
        const set = new Set();
        for (const group of filtered) for (const row of group.rows) set.add(row.id);
        return set;
      }, [filtered]);

      const selectableIds = useMemo(() => {
        const set = new Set();
        for (const group of filtered) for (const row of group.rows) if (row.running !== true) set.add(row.id);
        return set;
      }, [filtered]);

      // Selecting a parent selects the whole subtree; collapsing only hides
      // rows, so hidden children stay selected.
      const descendants = useMemo(() => {
        const map = new Map();
        for (const group of filtered) {
          const collect = (row, acc) => {
            for (const child of group.children.get(row.id) ?? []) {
              acc.push(child.id);
              collect(child, acc);
            }
            return acc;
          };
          for (const row of group.rows) map.set(row.id, collect(row, []));
        }
        return map;
      }, [filtered]);

      // A backup follows the same ownership as deletion: the row's session plus
      // every subagent beneath it, even when search or archiving hides them.
      const backupSingle = useCallback(
        (id) => {
          // Build the parent -> children index from every known session, so the
          // backup covers subagents hidden by search, scope, or archiving.
          const children = new Map();
          for (const candidate of Object.values(byId)) {
            if (candidate === undefined || candidate === null || candidate.parentId === undefined) continue;
            const list = children.get(candidate.parentId);
            if (list === undefined) children.set(candidate.parentId, [candidate.id]);
            else list.push(candidate.id);
          }
          const family = [];
          const walk = (current) => {
            if (family.includes(current)) return;
            family.push(current);
            for (const child of children.get(current) ?? []) walk(child);
          };
          walk(id);
          const row = byId[id];
          const title = row !== undefined ? row.displayTitle || row.title || '' : '';
          startBackup(family, backupFilename(title, family.length));
          setNotice(t('backupStarted'));
        },
        [byId, t],
      );

      useEffect(() => {
        setSelected((previous) => {
          let changed = false;
          const next = new Set();
          previous.forEach((id) => {
            if (selectableIds.has(id)) next.add(id);
            else changed = true;
          });
          return changed ? next : previous;
        });
      }, [selectableIds]);

      const toggleSession = useCallback(
        (id) => {
          setSelected((previous) => {
            const next = new Set(previous);
            const list = [id, ...(descendants.get(id) ?? [])];
            if (next.has(id)) {
              for (const member of list) next.delete(member);
            } else {
              for (const member of list) if (selectableIds.has(member)) next.add(member);
            }
            return next;
          });
        },
        [descendants, selectableIds],
      );

      const toggleExpanded = useCallback((id) => {
        setExpanded((previous) => {
          const next = new Set(previous);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
      }, []);

      // A row's delete button: explicit checks inside the row's subtree win;
      // otherwise a parent row takes its whole subtree, while a child row
      // never reaches up to its parent.
      const requestDeleteRow = useCallback(
        (id) => {
          if (byId[id]?.running === true) {
            setPurgeIds([]);
            return;
          }
          const subtree = [id, ...(descendants.get(id) ?? [])].filter((member) => byId[member]?.running !== true);
          if (subtree.length === 0) {
            setPurgeIds([]);
            return;
          }
          const checked = subtree.filter((member) => selected.has(member));
          setPurgeIds(checked.length > 0 ? checked : subtree);
        },
        [descendants, selected, byId, t],
      );

      const setMany = useCallback((list, on) => {
        setSelected((previous) => {
          const next = new Set(previous);
          for (const id of list) {
            if (on) next.add(id);
            else next.delete(id);
          }
          return next;
        });
      }, []);

      const toggleGroupCollapse = useCallback((key) => {
        setCollapsed((previous) => {
          const next = new Set(previous);
          if (next.has(key)) next.delete(key);
          else next.add(key);
          return next;
        });
      }, []);

      const allSelected = selectableIds.size > 0 && Array.from(selectableIds).every((id) => selected.has(id));

      const toggleAllVisible = () => {
        setMany(Array.from(selectableIds), !allSelected);
      };

      const requestArchive = useCallback(
        (list) => {
          if (list.length === 0) return;
          let running = 0;
          for (const id of list) {
            const row = byId[id];
            if (row && row.running) running += 1;
          }
          setArchiveRequest({ ids: list.slice(), running });
        },
        [byId],
      );

      const settleArchive = useCallback(
        (done, ok, failedIds) => {
          const failedSet = new Set(failedIds);
          setSelected((previous) => {
            const next = new Set(previous);
            for (const id of done.ids) if (!failedSet.has(id)) next.delete(id);
            return next;
          });
          if (failedIds.length === 0) setNotice(t('archiveNotice', { n: ok }));
        },
        [t],
      );

      const restoreIds = useCallback(
        async (list) => {
          if (restoring || list.length === 0) return;
          setRestoring(true);
          let ok = 0;
          let failed = 0;
          for (const id of list) {
            try {
              await unarchiveSession(id);
              ok += 1;
            } catch (error) {
              failed += 1;
            }
          }
          setRestoring(false);
          setSelected((previous) => {
            const next = new Set(previous);
            for (const id of list) next.delete(id);
            return next;
          });
          setNotice(failed > 0 ? t('partialRestore', { ok, failed }) : t('restored', { n: ok }));
        },
        [restoring, t, unarchiveSession],
      );

      const settlePurge = useCallback(
        (deleted, failed) => {
          const removed = new Set(deleted);
          setSelected((previous) => {
            const next = new Set(previous);
            for (const id of removed) next.delete(id);
            return next;
          });
          if (deleted.length > 0) {
            setNotice(t('purgeDoneNotice', { n: deleted.length }));
            void refreshAll();
          }
        },
        [refreshAll, t],
      );

      const labels = useMemo(() => {
        const map = Object.create(null);
        for (const id of ids) {
          const row = byId[id];
          if (row !== undefined) map[id] = row.displayTitle || row.title || '';
        }
        return map;
      }, [ids, byId]);

      const selectedIds = useMemo(
        () => Array.from(selected).filter((id) => filteredIds.has(id) && byId[id]?.running !== true),
        [selected, filteredIds, byId],
      );
      const selectedArchived = selectedIds.filter((id) => archivedSet.has(id));
      const selectedActive = selectedIds.filter((id) => !archivedSet.has(id));

      const backupSelected = () => {
        const first = byId[selectedIds[0]];
        const title = first !== undefined ? first.displayTitle || first.title || '' : '';
        startBackup([...selectedIds], backupFilename(title, selectedIds.length));
        setNotice(t('backupStarted'));
      };


      const totalCount = ids.filter((id) => byId[id] && !byId[id].blank && !orphans.has(id)).length;
      const archivedCount = ids.filter((id) => archivedSet.has(id) && !orphans.has(id)).length;
      const loading =
        (workspaces.length === 0 && workspaceState.phase !== 'ready') || (ids.length === 0 && sessionState.phase !== 'ready');

      return h(
        'section',
        { className: 'wsc-page', 'aria-label': t('title'), 'data-testid': 'session-cleanup-page' },
        h('style', null, CSS),
        h(
          'div',
          { className: 'wsc-scroll' },
          h(
            'div',
            { className: 'wsc-content' },
            h(
              'div',
              { className: 'wsc-head' },
              h('div', null, h('h1', null, t('title')), h('p', { className: 'wsc-sub' }, t('subtitle'))),
              h(
                'div',
                { className: 'wsc-stats' },
                h('div', null, h('b', null, String(totalCount)), ' ', t('totalSessions')),
                h('div', null, h('b', null, String(archivedCount)), ' ', t('archivedSessions')),
              ),
            ),
            h(
              'div',
              { className: 'wsc-toolbar' },
              h(
                'label',
                { className: 'wsc-search' },
                h(SearchIcon),
                h('input', {
                  type: 'search',
                  value: search,
                  placeholder: t('searchPlaceholder'),
                  'aria-label': t('searchPlaceholder'),
                  onChange: (event) => setSearch(event.target.value),
                }),
              ),
              h(
                'select',
                { className: 'wsc-select', value: scope, 'aria-label': t('allWorkspaces'), onChange: (event) => setScope(event.target.value) },
                h('option', { value: 'all' }, t('allWorkspaces')),
                groups.map((group) =>
                  h('option', { key: group.key || '__ungrouped', value: group.key }, group.title + ' (' + group.sessions.length + ')'),
                ),
              ),
              h(
                'label',
                { className: 'wsc-toggle' },
                h('input', { type: 'checkbox', checked: showArchived, onChange: (event) => setShowArchived(event.target.checked) }),
                t('showArchived'),
              ),
              h('button', { type: 'button', className: 'wsc-btn', onClick: () => setBackupOpen(true) }, t('backup')),
              h('button', { type: 'button', className: 'wsc-btn wsc-btn-refresh', disabled: refreshing, onClick: () => void refreshAll() }, refreshing ? t('refreshing') : t('refresh')),
              h('button', { type: 'button', className: 'wsc-btn', onClick: () => setTrashOpen(true) }, t('trashOpen')),
              h('span', { className: 'wsc-spacer' }),
            ),
            visible.length === 0
              ? h('p', { className: 'wsc-empty' }, loading ? t('loading') : groups.length === 0 ? t('empty') : t('noMatches'))
              : visible.map((group) => {
                  const open = !collapsed.has(group.key);
                  const groupIds = group.ids.filter((id) => byId[id]?.running !== true);
                  const groupAll = groupIds.length > 0 && groupIds.every((id) => selected.has(id));
                  return h(
                    'div',
                    { className: 'wsc-group', key: group.key || '__ungrouped' },
                    h(
                      'div',
                      { className: 'wsc-group-head' },
                      h(
                        'button',
                        {
                          type: 'button',
                          className: 'wsc-caret' + (open ? ' wsc-caret-open' : ''),
                          'aria-label': open ? t('collapse') : t('expand'),
                          'aria-expanded': open,
                          onClick: () => toggleGroupCollapse(group.key),
                        },
                        h(CaretIcon),
                      ),
                      h('span', { className: 'wsc-group-title' }, group.title),
                      group.path ? h('span', { className: 'wsc-group-path', title: group.path }, group.path) : null,
                      h('span', { className: 'wsc-group-count' }, t('groupCount', { n: group.count })),
                      h('button', { type: 'button', className: 'wsc-link', onClick: () => setMany(groupIds, !groupAll) }, groupAll ? t('clearGroup') : t('selectGroup')),
                    ),
                    open
                      ? group.rows.map(({ row, depth, childCount }) => {
                          const retained = row.retainedBy !== undefined && row.retainedBy !== null && Object.values(row.retainedBy).some((count) => (count ?? 0) > 0);
                          return h(SessionRow, {
                            key: row.id,
                            row,
                            depth,
                            childCount,
                            expanded: expanded.has(row.id),
                            archived: archivedSet.has(row.id),
                            pinned: pinnedSet.has(row.id),
                            selected: selected.has(row.id),
                            running: row.running === true,
                            open: retained,
                            t,
                            onToggleSelection: toggleSession,
                            onToggleExpand: toggleExpanded,
                            onArchive: (id) => requestArchive([id]),
                            onRestore: (id) => restoreIds([id]),
                            onView: (id) => setTranscriptId(id),
                            onBackup: (id) => void backupSingle(id),
                            onDelete: (id) => requestDeleteRow(id),
                          });
                        })
                      : null,
                  );
                }),
          ),
        ),
        h(
          'div',
          { className: 'wsc-footer' },
          h(
            'div',
            { className: 'wsc-footer-inner' },
            h('span', { className: 'wsc-footer-info' }, selectedIds.length > 0 ? t('selectedSummary', { n: selectedIds.length }) : t('noSelection')),
            selectedIds.length > 0 && !allSelected
              ? h('button', { type: 'button', className: 'wsc-btn', onClick: toggleAllVisible }, t('selectAll'))
              : null,
            selectedIds.length > 0
              ? h('button', { type: 'button', className: 'wsc-btn', onClick: () => setSelected(new Set()) }, t('clearAll'))
              : null,
            selectedIds.length > 0
              ? h('button', { type: 'button', className: 'wsc-btn', onClick: () => void backupSelected() }, t('backupSelected', { n: selectedIds.length }))
              : null,
            selectedArchived.length > 0
              ? h(
                  'button',
                  { type: 'button', className: 'wsc-btn', disabled: restoring, onClick: () => restoreIds(selectedArchived) },
                  t('restoreSelected', { n: selectedArchived.length }),
                )
              : null,
            selectedActive.length > 0
              ? h(
                  'button',
                  { type: 'button', className: 'wsc-btn', onClick: () => requestArchive(selectedActive) },
                  t('archiveSelected', { n: selectedActive.length }),
                )
              : null,
            selectedIds.length > 0
              ? h(
                  'button',
                  { type: 'button', className: 'wsc-btn wsc-btn-danger', onClick: () => setPurgeIds(selectedIds) },
                  t('purgeSelected', { n: selectedIds.length }),
                )
              : null,
          ),
        ),
        notice !== null ? h('div', { className: 'wsc-notice', role: 'status', 'aria-live': 'polite' }, notice) : null,
        transcriptId !== null ? h(TranscriptDialog, { id: transcriptId, t, onClose: () => setTranscriptId(null) }) : null,
        backupOpen
          ? h(BackupDialog, {
              t,
              onClose: () => setBackupOpen(false),
              onImported: () => {
                void refreshAll();
              },
            })
          : null,
        trashOpen
          ? h(TrashDialog, {
              t,
              onClose: () => setTrashOpen(false),
              onChanged: () => {
                void refreshAll();
              },
            })
          : null,
        archiveRequest !== null
          ? h(ArchiveDialog, {
              request: archiveRequest,
              t,
              archiveSession,
              onSettled: (ok, failedIds) => settleArchive(archiveRequest, ok, failedIds),
              onClose: () => setArchiveRequest(null),
            })
          : null,
        purgeIds !== null
          ? h(PurgeDialog, {
              ids: purgeIds,
              labels,
              t,
              onClose: () => setPurgeIds(null),
              onFinished: settlePurge,
            })
          : null,
      );
    }

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
    })(require);
    /** Selector hook factory for one observable source, cached per source. */
    const hookCache = new WeakMap();

    function bindSnapshotSelector(source) {
      let hook = hookCache.get(source);
      if (hook === undefined) {
        hook = (selector, equal) => {
          const value = useSyncExternalStore(source.subscribe, source.getSnapshot, source.getSnapshot);
          if (typeof selector !== 'function') return value;
          const next = selector(value);
          return equal ? next : next;
        };
        hookCache.set(source, hook);
      }
      return hook;
    }

    /** Per-entry store instance and inject result, so a tab render never re-mints them. */
    const kitCache = new WeakMap();

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
     * it to render someone else's entry, so an embedded panel gets the same
     * standard props we were given, plus its own locale seat, store pair and
     * inject face. Only these extras are cached — the standard props arrive
     * fresh on every render and must not be frozen into the cache.
     */
    function embedExtras(ctx, entry) {
      const cached = kitCache.get(entry);
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
        if (typeof entry.locale === 'string' && entry.locale !== '') {
          extras.t = ctx.locale.bind(entry.locale);
        }
      } catch {
        // A panel whose inject fails still renders with the standard props.
      }
      // A panel that declares child slots needs the renderer's own binding, which
      // is not reachable from here; that panel keeps a "open it on its own" row.
      extras.unsupported = entry.children !== undefined;
      kitCache.set(entry, extras);
      return extras;
    }

    /** Everything another plugin put on the sidebar, paired with its `main` panel. */
    function createPanelStore(ctx) {
      let snapshot = [];
      const listeners = new Set();
      const available =
        typeof ctx.slots.entriesOfSlot === 'function' && typeof ctx.slots.subscribe === 'function';
      // Shipped panels stay where the host put them; only panels other plugins
      // add are collected and hidden here. Extend this list for a new host panel.
      const official = new Set(['plugins', 'schedules']);
      const read = () => {
        const rows = [];
        if (!available) return rows;
        const panels = new Map();
        for (const entry of ctx.slots.entriesOfSlot('main')) {
          const key = entry?.options?.key;
          if (typeof key === 'string' && key !== '') panels.set(key, entry);
        }
        const seen = new Set();
        for (const entry of ctx.slots.entriesOfSlot('sidebar.panellist')) {
          const id = entry?.options?.id;
          if (typeof id !== 'string' || id === '' || id === HUB_ID || official.has(id) || seen.has(id)) continue;
          const panel = panels.get(id);
          // A sidebar button without a matching main panel has nothing to embed.
          if (panel === undefined) continue;
          seen.add(id);
          rows.push({ id, order: entry.options.order ?? 0, label: entry.options.label, panel });
        }
        rows.sort((left, right) => left.order - right.order);
        return rows;
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

    /** Render one collected panel, or explain why it has to open on its own. */
    function CollectedPane({ ctx, row, slot, t }) {
      const entry = row.panel;
      const extras = embedExtras(ctx, entry);
      if (extras.unsupported || typeof entry.component !== 'function') {
        return h(
          'div',
          { className: 'hub-panels-inner' },
          h('h2', null, panelLabel(row.label, row.id)),
          h('p', null, t('embed.unsupported')),
          h(
            'button',
            { type: 'button', className: 'hub-panel-row', onClick: () => openPanel(ctx, row.id) },
            h('span', { className: 'hub-panel-name' }, t('embed.openStandalone')),
          ),
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
          h('strong', null, t('panels.paneCrashed')),
          h('span', null, t('crash.hint')),
          h('code', null, String((error && error.message) || error)),
          row === undefined
            ? null
            : h(
                'button',
                { type: 'button', className: 'hub-panel-row', onClick: () => openPanel(ctx, row.id) },
                h('span', { className: 'hub-panel-name' }, t('embed.openStandalone')),
              ),
        );
    }

    /** The panels other plugins contributed, as extra hub tabs. */
    function collectedTabs(ctx, t, rows) {
      return rows.map((row) => ({
        id: row.id,
        label: () => panelLabel(row.label, row.id),
        render: (slot) => h(CollectedPane, { ctx, row, slot, t }),
        row,
      }));
    }

    function createHubPage(parts, t, ctx, panels) {
      const baseTabs = [
        {
          id: 'cleanup',
          label: () => t('tab.cleanup'),
          render: (slot) => h(parts.cleanup.Page, { ...slot, ...parts.cleanup.props, t: parts.cleanup.t }),
        },
        { id: 'skills', label: () => t('tab.skills'), render: (slot) => h(parts.skills.Page, { ...slot, t: parts.skills.t }) },
        { id: 'vault', label: () => t('tab.vault'), render: () => h(VaultPane, { t }) },
      ];

      return function HarnessHubPage(props) {
        const [active, setActive] = useState('cleanup');
        // Collected panels come from the live slot registry, so installing a
        // plugin that adds a sidebar panel shows up here without a reload.
        const rows = useSyncExternalStore(panels.subscribe, panels.getSnapshot);
        const tabs = [...baseTabs, ...collectedTabs(ctx, t, rows)];
        const current = tabs.some((tab) => tab.id === active) ? active : tabs[0].id;
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
              tabs.map((tab) =>
                h(
                  'button',
                  {
                    key: tab.id,
                    type: 'button',
                    role: 'tab',
                    'aria-selected': tab.id === current,
                    className: tab.id === current ? 'hub-tab hub-tab-active' : 'hub-tab',
                    onClick: () => setActive(tab.id),
                  },
                  tab.label(),
                ),
              ),
            ),
          ),
          h(
            'div',
            { className: 'hub-body' },
            // Every pane stays mounted so switching tabs keeps search, filters,
            // draft text and scroll positions; only the active one is displayed.
            tabs.map((tab) =>
              h(
                'div',
                { key: tab.id, className: tab.id === current ? 'hub-pane' : 'hub-pane hub-pane-hidden' },
                h(HubErrorBoundary, { fallback: crashedPane(t, ctx, tab.row) }, tab.render(slot)),
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

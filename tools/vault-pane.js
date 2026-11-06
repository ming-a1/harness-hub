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

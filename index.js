/**
 * Host half of the Harness Hub bundle.
 *
 * The hub is a thin composition layer: it mounts the three feature plugins that
 * used to be separate profile bundles as child plugins of one Loader row, so a
 * single install carries the skill gallery, the session cleanup routes/tool and
 * the token vault routes/tools. Their browser halves are merged into this
 * package's `client.js`, which renders one panel with three tabs.
 *
 * Child plugins keep their own `inject` declarations, so services resolve per
 * child exactly as they did when each package had its own row.
 */
import * as skillGallery from './host/skill-gallery.js';
import * as sessionCleanup from './host/session-cleanup.js';
import * as tokenVault from './host/token-vault.js';

export const name = 'harness-hub';

/**
 * Mount every integrated feature plugin under the hub's context.
 *
 * @param ctx - hub plugin context.
 */
export function apply(ctx) {
  ctx.plugin(skillGallery);
  ctx.plugin(sessionCleanup);
  ctx.plugin(tokenVault);
}

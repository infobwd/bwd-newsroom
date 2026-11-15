# BWD Newsroom — BWD Notify, unified in-app notifications

**Work ID:** BN-APP-2569-10  
**Date:** 2026-11-15 (Asia/Bangkok)  
**Starting main:** `99991870b2e88394148f246025fd5ee1af3cd796`  
**Repository:** `infobwd/bwd-newsroom`  
**Scope:** Approved public site interface only; user expressly authorized code changes and merge in chat.

## Before / after

The public site did not primarily call native `window.alert()` or `window.confirm()`. Notifications were fragmented: per-issue share status in the fixed footer, separate offline bar and Service Worker update notice, Gallery error messages, Reader flip-mode fallback and console-only fullscreen errors.

The new first-party `assets/notify.js` and `assets/notify.css` establish one small framework-free notification API (`window.BWDNotify`). Files and site are deliberately independent of Canva, original Drive photos and issue manifests.

| API | Role | Behavior |
| --- | --- | --- |
| `toast(message,{type,title,mount,key,duration,persistent})` | Short information / success / failure | Accessible `status` or `alert` role, close control, at most two at once, timeout defaults success 3.2s, info 4s, warning 5.5s, error 6.5s; pause when pointer hovers or focus enters; text-only DOM insertion |
| `banner(key,message,{type,title,actionText,onAction,dismissible})` | Persistent connectivity / app-version message | Deduplicate by key; stays until condition is resolved; supports real action without forced reload |
| `dismissBanner(key)` | Remove named banner | Restore safe-area spacing and keep unrelated banners |
| `confirm({title,message,type,confirmText,cancelText})` | Future confirmations requiring affirmative consent | Accessible native HTML `dialog` styled as BWD modal; defaults to cancellation; Escape/backdrop cancel; fails closed if `showModal` unavailable |

## Integration

- News issue share/copy feedback becomes an in-dialog Toast, not a permanently tall footer. The native iOS share sheet is **not** replaced; its visual appearance and whether LINE accepts images/text are outside site control. File-share success copy does not imply the recipient has received it.
- Gallery image-load and catalogue errors show a Toast; persistent catalogue error text remains in page content.
- Flipbook unsupported page-flip fallback uses Toast when available and still switches to scroll reading. Reader critical errors retain a persistent inline message; fullscreen failure and single image fetch failures show Toast.
- Offline state across **News, Gallery and Reader** is managed centrally with a persistent warning banner and a brief reconnection Toast. `navigator.onLine` is only an OS connectivity hint, not a guarantee of internet reachability.
- Waiting PWA release uses `banner('pwa-update',...)` with an Update action. If an open reading/dialog window exists, action **does not** trigger `SKIP_WAITING`; it displays a warning in that dialog. Only the user's update click initiates Service Worker activation.
- `notify.js` loads with `defer` before each page controller. UI respects Kanit, school navy/gold, safe-area and reduced-motion. No external library, backend, token, image, QR or public data changes.
- Public-only PWA app shell increments to `bwd-public-shell-2569-11-15-v17-bwd-notify`, precaching the two notification assets while still excluding images, public catalogues and PDFs.

## QA gates

- **Node syntax / CI:** pending final PR result.
- **Synthetic DOM tests:** `node tests/bwd-notify.test.mjs`, including queue limit, accessible roles, modal mounting, banner deduplication, offline transition, cancel/accept and source/PWA contracts. These do not equal browser acceptance.
- **Existing suite:** N01 archive and Gallery, reader, image-first modal, PWA and share regressions must remain green.
- **Mobile / iPhone Safari / installed PWA visual review:** NOT RUN by source-only CI; check Toast above fixed navigation and native issue dialog, keyboard focus, screen-reader announcements, orientation, offline/online state, real native share fallback, and explicit app update.
- **Content approvals:** no change to any published issue or event photos; no new approval inferred.
- **Rollback:** revert the scoped PR merge if visual or device QA finds an issue; published assets are unchanged.

## Release evidence

The PR link, successful Actions run, merge SHA, Pages deployment run and any subsequent device QA must be added only after observing their actual status.

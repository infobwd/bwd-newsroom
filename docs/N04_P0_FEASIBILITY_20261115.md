# N04-P0 — Secure Teacher Upload Feasibility Checkpoint (15 November 2026)

**Loop:** BN-N04-P0-20261115-01  
**School:** โรงเรียนบ้านวังด้ง สพป.กาญจนบุรี เขต 4  
**Repository:** `infobwd/bwd-newsroom`  
**Starting main:** `318bb843e8cd86649c98e1aa51779700c472f000` (latest owner-approved architecture merged as PR #29).  
**Authority:** School owner said to Merge the latest N04-P plan and start work in chat, 15 Nov 2026. **No authorization to expose originals, approve student photos or deploy an insecure upload backend.**  
**Plan:** [GALLERY_CHAT_UI_PWA_PLAN.md §10](GALLERY_CHAT_UI_PWA_PLAN.md#10-n04-p-architecture-decision-record--github-pages-single-surface-teacher-upload-15-nov-2026)

## P0 fact check and evidence — completed versus outstanding

| Gate | Status | Evidence / blocker |
|---|---|---|
| Latest N04-P architecture on current main | DONE | PR #29 merged; school direction is one GitHub Pages front-end, two Google account types with private school allowlist |
| School academic-year image Drive directory readable via school connector | METADATA READ PASS | `01_ภาพกิจกรรม` under school-selected `ปีการศึกษา 2569`; metadata showed Shared Drive, folder readable and current-user sharing capability, but no explicit anonymous permission metadata. **This is not a write test** |
| P0 threat-model and offline authorization contract | IMPLEMENTED FOR TESTING | `scripts/n04-p0-policy.mjs`: inject a trusted Google ID-token verifier and PRIVATE school allowlist lookup; exact-origin preflight policy, denied unknown/revoked Gmail, disallowed role/event and invalid image header |
| Synthetic Node automated checks | CI CHECKPOINT | `tests/n04-p0-policy.test.mjs` is test-fixture-only; no actual teacher identity or Drive file used. Observe PR Static QA for PASS or FAIL |
| Actual OAuth app/client ID and school-authorized teacher test identities | NOT CONFIGURED HERE | Must be configured by school admin; NEVER publish IDs of pupils, credentials, private uploader `sub` records or service tokens in repository |
| Actual Google-signed token verification by active backend | NOT RUN | The policy invokes an injectable `verifyGoogleIdToken` but does **not** itself cryptographically verify JWT signatures. Production MUST use a trusted library/provider |
| Actual CORS preflight, redirects, cookie/CSRF handling from Pages on iPhone | NOT RUN | No school-approved test deployment endpoint or browser credentials yet |
| Actual Drive API create/upload/readback in restricted test event | NOT RUN | No authenticated backend/OAuth grant selected or deployed; NO new real event folder/file created in this milestone |
| iPhone Safari, installed PWA, Android, personal Gmail vs school account live login tests | NOT RUN | Requires real test accounts and a nonpublic backend test environment |
| Public publishing or Gallery manifest change | NOT PERMITTED | None of this work posts media, changes `data/galleries.json`, or exposes source images |

## Offline P0 policy prototype — no live endpoint

`scripts/n04-p0-policy.mjs` models these boundaries for future server-side integration:
- Exact browser origin `https://infobwd.github.io` (origin, **not** project path); CORS alone is NOT authentication. Actual endpoint must independently validate all authorization.
- A cryptographically verified Google ID token must be supplied by a trusted verifier adapter, which checks signature, issuer, audience and expiry; the policy defensively rechecks claims and verified email.
- Both Google Workspace/school accounts (configured hosted domains) and personal Gmail are eligible as identities, **only** if the user's stable Google `sub` has an active entry in a private school allowlist with matching email, permitted teacher/administrator role and authorized event ID.
- No anonymous/new Gmail self-registration, reviewer uploads, arbitrary Drive folder selection, revoked access or public bypass.
- JPEG, PNG and WebP basic magic header/size/extension preflight with 12 MiB per-file *synthetic pilot* limit; HEIC remains unsupported until a documented conversion strategy. This is **not** a full malware/image-decoding check, and the production limit is not decided.
- No networking, stored secrets, upload routes, Drive writes, OAuth callbacks, HTML login page, account registry or public PWA cache entries. Synthetic tests are **not proof** a real auth flow or upload works.

## Backend selection — only after real P0

| Candidate | Why evaluate | Stop/go test |
|---|---|---|
| A — Google Apps Script behind Pages | Minimal school-controlled server; may use Advanced Drive service for Shared Drive | Must prove the actual Pages-origin credentialed **OPTIONS/POST** CORS behavior, redirects, real Google verification/CSRF, identity visibility, request-size/time limits and school-authorized Drive writes. Public anonymous `execute as owner` upload endpoint, `no-cors`, JSONP and credential leaks are **NO-GO** |
| B — authenticated API + controlled Drive worker | Browser-origin CORS, server roles/Google OIDC verification and upload controls can be implemented explicitly | Verify actual worker credentials/minimum scopes, secure server-side session, data residence/cost/quotas, staging-file lifecycle, retries, audit and upload-to-Drive readback. Do not introduce Supabase or another service until selected after this P0 test |

Official documentation reviewed at P0:
- Google [Web Apps deployment modes](https://developers.google.com/apps-script/guides/web) — execute as developer vs current user differs.
- Google [OIDC ID-token backend verification](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token) — signature, audience, issuer, expiry and stable `sub`; use a server-side verification library.
- Google [Apps Script Advanced Drive](https://developers.google.com/apps-script/advanced/drive) and [Shared Drive support](https://developers.google.com/workspace/drive/api/guides/enable-shareddrives) — permissions and `supportsAllDrives` need real tests.
- Google [web-app manifest access modes](https://developers.google.com/apps-script/manifest/web-app-api-executable) — sharing the endpoint is not equivalent to authenticating the app user.

## Real P0 exercise — private and non-sensitive only

1. School admin establishes the exact allowed Workspace domain(s), a **private** staff uploader registry keyed by verified Google `sub`, at least one consenting school Google test account and one consenting personal Gmail test account; revoke/unknown identities are test fixtures. No private staff roster committed to public repo.
2. Provision a school-approved **nonpublic** backend/spike deployment and configure Google OIDC client/redirect/origins correctly; test credentialed CORS from `https://infobwd.github.io` and CSRF protections. Do not deploy an anonymous owner-privileged Drive writer.
3. Create a temporary, restricted test event beneath the school-controlled academic year folder only through the verified backend. Upload a synthetic non-sensitive JPEG/PNG, confirm server-side magic/decoding/hash/idempotency, actual Drive write/readback and audit `sub`/event binding. No student photos.
4. Prove denied unknown Gmail, revoked teacher, expired/forged token, insufficient role, event mismatch, replay, oversized/HEIC file, offline retry and CORS from another origin. Explicitly confirm private folders/files remain inaccessible anonymously.
5. Test iPhone Safari, Home Screen PWA and Android Chrome while keeping the user on the GitHub Pages route (no Apps Script interface redirect), then choose the simplest **proven** backend with rollback and rate-limit plan.

**Stop condition:** Until authenticated cross-origin real bytes arrive in the correct restricted school Drive event and denied cases are observed, mark P0 **IN PROGRESS / LIVE UPLOAD NOT RUN** and do not claim P1/production UI or deploy a fake submit button.

## Next scoped tasks

- After real P0 gate passes: design `teacher-upload.html` on Pages as P1; keep private API calls authenticated and no private events, teacher identities or tokens in static files/PWA caches.
- P2: securely persist originals and registry. P3: chat-led actual-image review and separate approvals. P4: optimized public derivatives and PR under explicit publication authorization.
- Release evidence must include PR/head/merge SHA, Static QA status, real backend test run, Drive private path (kept restricted), negative auth tests and actual mobile QA.

**Rollback:** Revert only P0 source/docs/tests; no public routes, original images or manifests are changed.

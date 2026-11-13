# BWD Newsroom — N02 validation and website preview

N01 shell was merged into main on 13 Nov 2026: commit ab90ebcca0aaae11d541dd0eeb7ecb913c3e7eb7.

N02 branch: feat/n02-bookshelf-flipbook. Demo route is \`reader.html?demo=1\`, clearly labeled as a demonstration only, not published school content.

This repository includes a GitHub Actions static QA workflow on push and PR. Checks: Node 22 syntax checks, public catalog validation, approved books validation, N01 and N02 regressions.

**Release gate**: green static QA does not replace Safari/iPad and browser testing. Publishing the empty catalog and demo is safe but real student photos/Canva exports still require explicit school approval.

For GitHub Pages, Settings → Pages → Deploy from a branch → main / (root). Site URL: https://infobwd.github.io/bwd-newsroom/ . The status of live deployment must be checked separately.

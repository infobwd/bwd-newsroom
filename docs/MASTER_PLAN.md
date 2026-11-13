# BWD Newsroom — MASTER PLAN (13 พฤศจิกายน 2569)

Status: APPROVED DIRECTION / DOCUMENTATION ONLY (not deployed)
Owner: โรงเรียนบ้านวังด้ง สพป.กาญจนบุรี เขต 4
Repository: https://github.com/infobwd/bwd-newsroom
Target site: https://infobwd.github.io/bwd-newsroom/
Related reader reference: https://github.com/infobwd/manual (WD Books)

## 1. Product vision

BWD Newsroom เป็นคลังข่าวประชาสัมพันธ์โรงเรียนที่เก็บงานจาก Canva เป็นรายฉบับ และรวบรวมข่าวที่ได้รับอนุมัติเป็นหนังสือดิจิทัลรายปักษ์ รายเดือน รายภาคเรียน และรายปี อ่านบนเว็บแบบพลิกหน้า (flipbook) และดาวน์โหลด PDF ได้ ตลอดจนเป็นคลังประวัติกิจกรรมโรงเรียนระยะยาว

**สถานะสำคัญ**: แผนนี้ไม่ใช่หลักฐานว่าเว็บเปิดใช้ GitHub Pages แล้ว, มีเนื้อหาจริงเผยแพร่แล้ว, หรือระบบ PDF/Flipbook ทำงานจริง ต้องมี QA และการอนุมัติแต่ละระยะ

## 2. Product surfaces

A. **Newsroom home**: ข่าวล่าสุด/เด่น การ์ดปกที่อนุมัติแล้ว ค้นหา/กรอง ปี พ.ศ., เดือน, หมวด, แม่แบบ, คำสำคัญ, สถานะเผยแพร่
B. **Single-issue view**: ภาพจดหมายข่าวหน้าเต็มแบบ responsive, ข้อความข่าวที่เข้าถึงได้, วันที่, หมวด, การแชร์, Canva reference เฉพาะที่อนุญาต
C. **Bookshelf**: ชั้นหนังสือรวมเล่มตามรายปักษ์/เดือน/ภาคเรียน/ปี พร้อมจำนวนข่าวและภาพปก
D. **Flipbook reader**: เริ่มที่ปกด้านขวา, desktop/iPad หน้าคู่เมื่อพื้นที่เพียงพอ, โทรศัพท์หน้าเดียว, สารบัญ, ปุ่มย้อน/ถัดไป, ปัด/ลากมุม, เลขหน้า, progress, ย่อ-ขยาย, fullscreen หากเบราว์เซอร์รองรับ, ลิงก์ตรงฉบับ/หน้า, โหมดลดการเคลื่อนไหว, fallback อ่านแบบ scroll
E. **Downloads**: PDF จดหมายข่าวเดี่ยวและ PDF รวมเล่มที่จัดทำจากภาพฉบับผ่าน QA พร้อมหน้าปก สารบัญ เลขหน้า metadata
F. **Admin workflow (initially Git-based)**: บันทึกข่าว Markdown/JSON, ตรวจภาพ, บันทึก Canva Design ID, อนุมัติและเผยแพร่ผ่าน PR/commit; ยังไม่ทำ public admin login หรือฐานข้อมูล

## 3. Template system

- WD-01 Classic Official: ข่าวทางการ / งานประจำ
- WD-02 Premium Magazine: ข่าวเด่น / บทความภาพ
- WD-03 Modern Minimal: ข่าววิชาการ / นโยบาย
- WD-04 Photo Story: กิจกรรมเด็ก ครู ผู้ปกครอง และชุมชน
- WD-05 Special Event: กีฬา การแข่งขัน รางวัล และกิจกรรมพิเศษ
- ทุกแบบคงอัตลักษณ์โรงเรียน น้ำเงิน/กรมท่า-เหลือง/ทอง, หัวเรื่อง Kanit, อัตราส่วนภาพเหมาะกับ A4 หรือช่องทางเผยแพร่
- มี Master Template แยกจาก Issue Design เสมอ; ห้ามแก้ทับต้นฉบับ
- ข่าวจริงหนึ่งฉบับมี canonical Canva Design ID หนึ่งค่า; ห้ามสร้างสำเนาโดยไม่แจ้ง; ไม่เปลี่ยน QR เดิมเว้นแต่สั่ง
- ใช้ทะเบียนเวอร์ชัน: issue ID + template code + v01... + draft/approved/published

## 4. Book compilation policy

**รายปักษ์** ตีความเป็นครึ่งเดือนตามปฏิทิน: ชุด A วันที่ 1–15, ชุด B วันที่ 16–วันสุดท้ายของเดือน (ไม่ใช่วงรอบเลื่อนทุก 14 วัน); ปรับ policy ได้ภายหลังหากต้องการ
- ช่วงอื่น: monthly, semester, annual และ custom-date
- ดึงเฉพาะ issue สถานะ published ที่มี approved image asset และลำดับ publish_date, issue_id แบบ deterministic
- หากไม่มีข่าวในช่วงเวลา ให้แสดง empty state; ไม่สร้างเล่มว่าง
- มีปก, บทนำ (optional), สารบัญ, หน้าข่าวตามลำดับ, ปกหลัง (optional)
- แต่ละหน้าในหนังสือต้องอ้างอิง asset/version ที่อนุมัติแล้วเพื่อไม่ให้เล่มย้อนหลังเปลี่ยนเองเมื่อแก้ข่าวใหม่
- บันทึก book ID เช่น WDBOOK-2569-11A, ช่วงวันที่, รายการ issue/version, cover, output PDF version, generated timestamp, checksum
- เปลี่ยนภาพหลังเผยแพร่ต้องออก revision ของเล่มพร้อมประวัติ ไม่เขียนทับแบบเงียบ

## 5. Architecture decisions

- Phase 1: Static GitHub Pages จาก main/(root) หรือ Actions build ตามการตรวจรับ; HTML/CSS/JS + public JSON catalog โดยยังไม่ต้องมี Supabase
- Phase 2: Flipbook ใช้ StPageFlip v2.0.7 self-hosted (MIT) อิงรูปแบบจาก infobwd/manual; ต้องมี license/attribution และ fallback scroll/PDF.js เมื่อเครื่องเก่าหรือ touch gesture มีปัญหา
- Render flipbook จาก **ไฟล์ภาพหน้า** ที่ถูก optimize สำหรับเว็บ ไม่จำเป็นต้องสร้างภาพจาก PDF อีกครั้ง (ช่วยไม่ใช้พื้นที่/CPU ซ้ำ)
- PDF สำหรับพิมพ์สร้างจากต้นฉบับ high-res ที่เก็บใน Drive ด้วยเครื่องมือ build script/ผู้ดูแลแบบ local-first; อย่าพึ่ง client-side PDF สำหรับรวมเล่มใหญ่ 100+ หน้า เพราะ RAM มือถืออาจไม่พอ
- PDF.js เป็นทางเลือกสำหรับ preview PDF/fallback ในระยะหลัง; StPageFlip เป็นประสบการณ์หลัก
- Google Drive เก็บต้นฉบับ Canva exports, ภาพกิจกรรม, PDF master/archive; GitHub Pages เก็บเฉพาะ thumbnails และ approved web images พร้อม metadata
- ไม่ใช้ลิงก์ preview ชั่วคราวของ Canva หรือ Google Drive เป็น URL รูปภาพหลักบน GitHub Pages; ต้องใช้ asset สาธารณะคงที่จาก site หรือโฮสต์ภาพที่เหมาะสม
- ไม่มีการดึงเนื้อหาจาก Drive โดยอัตโนมัติเพียงเพราะมีไฟล์ใหม่; การนำเข้าสู่เว็บต้องผ่านการอนุมัติ

## 6. Repository target layout

- README.md — ภาพรวมและสถานะจริง
- AGENTS.md — กติกา AI/Codex สำหรับพัฒนาต่อ
- docs/MASTER_PLAN.md — เอกสารหลักนี้
- docs/DATA_AND_STORAGE.md — สัญญาข้อมูลและลำดับที่เก็บไฟล์
- docs/PUBLISHING_AND_QA.md — Gate, Canva issue workflow, รับรองภาพ/ข้อความ/PDF
- data/issues/*.json — metadata ข่าวสาธารณะหนึ่งไฟล์ต่อข่าว (future)
- data/books/*.json — manifest รวมเล่มที่อนุมัติแล้ว (future)
- assets/issues/{issue-id}/ — thumbs/web image สำหรับเผยแพร่เท่านั้น (future)
- assets/books/{book-id}/ — ปก/หน้าพรีวิวที่จำเป็น (future)
- scripts/ — validate, generate catalog, compile PDF, optimize images (future)
- tests/ — schema, QA, link, regression tests (future)
- index.html, book.html, issue.html — site pages (future)
- .nojekyll — static serving (future)

## 7. Milestones / work packages

**N00 — Governance & baselines (this phase):**
- [x] Establish public GitHub repository and documented architecture
- [x] Identify WD Books reader reference and Canva issue governance
- [x] Establish named Drive archive folders
- [ ] Define first approved issue IDs and canonical Canva design selection

**N01 — News archive MVP:**
- [ ] Add issue JSON schema, validation, sample approved-only news data
- [ ] Build responsive news grid, year/month/category search, issue detail
- [ ] Optimized images: lazyload, aspect ratio, no broken image fallback
- [ ] Accessibility and real device QA
- [ ] User approval to enable/verify Pages and publish live site

**N02 — Single issue and flipbook:**
- [ ] Add bookshelf and image page reader using self-hosted StPageFlip
- [ ] Desktop spread, mobile page, keyboard/swipe/TOC, preserve page, scroll fallback
- [ ] Validate screen rendering with iPhone Safari, iPad and desktop

**N03 — PDF compilation:**
- [ ] Generate biweekly book manifest using exact date bounds
- [ ] Local-first or controlled build from approved high-res images to PDF (screen/print profiles)
- [ ] Cover, TOC, metadata, page order, bookmarks if supported, file hashes, PDF verification
- [ ] Store printable PDFs on approved Drive Published folder; public download only after permission

**N04 — Automation with guarded publication:**
- [ ] Approved issue manifest -> image processing -> catalog rebuild -> QA report
- [ ] Publish gate required: approval flag and version freeze, no automatic exposure of private Drive assets
- [ ] Archive/annual volume, sitemap/OG previews, backups, regression, performance
- [ ] Optional PWA/offline subset only after storage and cache budgets measured

## 8. Acceptance / no-go gates

- News: correct Thai text/date/name, image parity with Canva approved design, no missing images or unintended cropping, QR unchanged unless instructed
- Issue: link and design_id stable, no duplicate canonical issues, only approved public content
- Book: every included issue matches date selection, order, one page image equals one PDF content page except cover/TOC, no duplicate/missing page, numbers/TOC match
- Reader: desktop 2-page/iPhone 1-page, scrolling and corner-drag do not fight, keyboard and reduced-motion fallbacks, no horizontal overflow
- Operations: web loads on private/incognito context, 404 fallback, no console errors, all external links visible, image hashes valid
- Security: NEVER publish student private data, internal drafts, tokens, credentials or unrestricted Drive source folder; school content approval required before public release
- Performance: GitHub Pages published site max 1 GB and soft bandwidth 100 GB/month; watch catalog and PDF growth. Ref https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

## 9. Change control

Planning files may be committed now. Implementation and public deployment are separate tasks with QA/approval. Follow small PRs, avoid bypassing tests or claim verified deployment before actual verification. Maintain a release status table in README.


## 10. Approved architecture extension (13 Nov 2026): Gallery + Chat + PWA

**Decision: extend N00–N04; do not create a second Photo Hub project or AI Curator dashboard.**

- **N01-G:** add approved-only public activity Gallery to this same Newsroom site: album browse/search/filter, accessible full-screen viewer, optional relationship to WDNEWS issue and book. Do not auto-publicize teacher uploads.
- **N04-P:** teacher uploads from authenticated mobile web form to school-owned Shared Drive; authorized editorial process reads actual image bytes; ChatGPT is the command/review interface for ranking, selecting and approving Gallery images and separate Canva/WDNEWS images. Publication requires explicit school approval and reviewed build/deploy.
- **N04-W:** phased PWA for public reading with manifest, project-scoped service worker, offline *read-only* shell, versioned bounded cache and non-disruptive update prompt; preserve immersive N02-MOBILE reader and do not add a new public backend/Supabase merely to display approved Gallery.
- **Shared data:** `EVT-2569-XXXX` activity links one original image set to optional `WDGAL-2569-XXXX`, `WDNEWS-2569-XXXX`, canonical Canva Design ID and existing WDBOOKs. Gallery and WDNEWS may use different image selections and have independent approval versions.
- **Mobile visual language:** extend the current navy `#112b4e` / deep navy `#0b203a` / gold `#d9b15b`, Kanit headers and Thai-readable body. N02-MOBILE PR #3 was merged; keep phone+portrait-iPad single page, landscape spread, 760ms flip, 100dvh/safe areas, TOC bottom sheet, 100–250% zoom and scroll fallback. Gallery/bottom navigation must not overlay the reader.
- **Source protection:** retain current academic-year Shared Drive folder and its 17 PDFs; new photo subfolders are created by authorized implementation, with private registry and no duplicates of original photos. Public Pages receives only optimized approved derivatives and sanitized manifest.

**Detailed, normative extension:** [Gallery + Chat + UI/PWA Plan](GALLERY_CHAT_UI_PWA_PLAN.md). This documentation does not claim Gallery/PWA/upload are implemented, Pages is live, or actual-device QA passed.

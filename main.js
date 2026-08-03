/* ================================================
 멘토링 업무 가이드 — main.js (전 페이지 공통)

 담당 기능
  1) 페이지 목록(SITE_PAGES) — 브레드크럼 드롭다운·검색·페이저의 단일 출처
  2) 브레드크럼 탑바 드롭다운
  3) 전체 페이지 통합 검색 (다른 페이지는 fetch 후 파싱)
  4) 체크리스트 / FAQ / 접이식 카드
================================================ */

/* ── 1. 페이지 목록 ─────────────────────────── */
const HOME_PAGE = {
  id: 'home',
  file: 'index.html',
  label: 'HOME',
  title: '멘토 가이드 홈',
  desc: '전체 목차 · 링크 모음 · 체크리스트 · FAQ',
};

const SITE_PAGES = [
  { id: 'step-1', file: 'step-1-basics.html',             label: 'STEP 1', title: '기본 사항',                 desc: '멘토님 역할과 클래스 용어' },
  { id: 'step-2', file: 'step-2-preparation.html',        label: 'STEP 2', title: '사전 준비사항',             desc: '자동 녹화·업로드 환경 세팅' },
  { id: 'step-3', file: 'step-3-missions.html',           label: 'STEP 3', title: '멘토 필수 미션',             desc: '개강 전 완료해야 하는 두 가지', mission: true },
  { id: 'step-4', file: 'step-4-lecture-assignment.html', label: 'STEP 4', title: '강의 내용 숙지 및 과제 점검', desc: '멘토링 전 강의·과제 확인' },
  { id: 'step-5', file: 'step-5-mentoring.html',          label: 'STEP 5', title: '멘토링 진행',               desc: '수업 전·중·후 진행 절차' },
  { id: 'step-6', file: 'step-6-encouragement.html',      label: 'STEP 6', title: '수강생 참여 독려',           desc: '소통 채널 활용과 피드백 태도' },
  // STEP 6 의 하위 문서 — 드롭다운에서 들여쓰기로 표시됩니다.
  { id: 'examples', file: 'mentoring-examples.html',      label: '예시자료', title: '멘토링 예시 자료',          desc: '실제 멘토링 사례와 노하우', parent: 'step-6' },
];

const ALL_PAGES = [HOME_PAGE].concat(SITE_PAGES);

function currentPage() {
  const id = document.body.dataset.page || 'home';
  return ALL_PAGES.find(p => p.id === id) || HOME_PAGE;
}

/* ── 2. 체크리스트 ──────────────────────────── */
function toggleCheck(el) {
  el.classList.toggle('done');
  updateProgress();
}

function updateProgress() {
  const items = document.querySelectorAll('.check-item');
  const done  = document.querySelectorAll('.check-item.done').length;
  const bar   = document.getElementById('progress-bar');
  const label = document.getElementById('progress-label');
  if (!bar || !label) return;
  bar.style.width = (items.length > 0 ? (done / items.length) * 100 : 0) + '%';
  label.textContent = done + ' / ' + items.length + ' 완료';
  const msg = document.getElementById('complete-msg');
  if (msg) msg.style.display = (done === items.length && items.length > 0) ? 'block' : 'none';
}

/* ── 3. FAQ ─────────────────────────────────── */
function toggleFaq(btn) {
  btn.closest('.faq-item').classList.toggle('open');
}

/* ── 3-1. 접이식 카드 (OS별 안내 등) ────────── */
function toggleCard(head) {
  const card = head.closest('.toggle-card');
  const open = card.classList.toggle('open');
  head.setAttribute('aria-expanded', open ? 'true' : 'false');
}

/* 접혀 있는 카드 안의 앵커로 이동할 때 자동으로 펼칩니다. */
function revealTarget(el) {
  if (!el || !el.closest) return;
  const card = el.closest('.toggle-card');
  if (card && !card.classList.contains('open')) {
    card.classList.add('open');
    const head = card.querySelector('.toggle-head');
    if (head) head.setAttribute('aria-expanded', 'true');
  }
  const faq = el.closest('.faq-item');
  if (faq) faq.classList.add('open');
}

/* 사용 중인 OS에 해당하는 카드를 기본으로 펼쳐 둡니다. */
function initOsToggles() {
  const cards = document.querySelectorAll('.toggle-card[data-os]');
  if (cards.length === 0 || location.hash) return;
  const ua = navigator.userAgent;
  const os = /Mac|iPhone|iPad/.test(ua) && !/Windows/.test(ua) ? 'mac' : 'windows';
  cards.forEach(card => {
    if (card.dataset.os !== os) return;
    card.classList.add('open');
    const head = card.querySelector('.toggle-head');
    if (head) head.setAttribute('aria-expanded', 'true');
  });
}

/* ── 4. 앵커 ID 자동 부여 ───────────────────
   같은 문서 구조라면 항상 같은 ID가 나오도록 만들어,
   다른 페이지에서 fetch 해 만든 검색 결과의 링크가
   실제 페이지의 앵커와 정확히 일치하도록 합니다.
──────────────────────────────────────────── */
function slugify(text) {
  return 'h-' + (text || '')
    .trim()
    .toLowerCase()
    .replace(/[·"'"'`()[\]{}.,:;!?/\\|<>+*#~^$%&=]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'h';
}

const anchoredScopes = new WeakSet();

function ensureAnchorIds(doc) {
  const scope = doc.body || doc;
  if (!scope || anchoredScopes.has(scope)) return;
  anchoredScopes.add(scope);
  const used = new Set();
  scope.querySelectorAll('[id]').forEach(el => used.add(el.id));

  scope.querySelectorAll('h2, h3').forEach(h => {
    if (h.id) return;
    let base = slugify(h.textContent), id = base, n = 2;
    while (used.has(id)) { id = base + '-' + n; n++; }
    used.add(id);
    h.id = id;
  });

  scope.querySelectorAll('.faq-item').forEach((item, i) => {
    if (!item.id) item.id = 'faq-' + (i + 1);
  });
}

/* ── 5. 브레드크럼 탑바 ─────────────────────── */
function initTopbar() {
  const menu = document.getElementById('crumb-menu');
  const drop = document.getElementById('crumb-drop');
  const btn  = document.getElementById('crumb-current');
  if (!menu || !drop || !btn) return;

  const here = currentPage();
  const parts = ['<div class="crumb-menu-label">단계별 가이드</div>'];
  SITE_PAGES.forEach(p => {
    const cls = [
      p.id === here.id ? 'current' : '',
      p.mission ? 'mission' : '',
      p.parent ? 'sub' : '',
    ].filter(Boolean).join(' ');
    parts.push(
      '<a href="' + p.file + '"' + (cls ? ' class="' + cls + '"' : '') + '>' +
        '<span class="cm-num">' + (p.parent ? '↳' : p.label) + '</span>' +
        '<span><span class="cm-title">' + (p.mission ? '🎯 ' : '') + p.title + '</span>' +
        '<span class="cm-desc">' + p.desc + '</span></span>' +
      '</a>'
    );
  });
  menu.innerHTML = parts.join('');

  btn.addEventListener('click', e => {
    e.stopPropagation();
    const open = drop.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.addEventListener('click', e => {
    if (!drop.contains(e.target)) {
      drop.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      drop.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── 6. 이전/다음 페이저 ────────────────────── */
function initPager() {
  const wrap = document.getElementById('page-pager');
  if (!wrap) return;
  // HTML 에 직접 써 둔 이전/다음이 있으면 그대로 둡니다.
  if (wrap.children.length > 0) return;
  const here = currentPage();
  const i = SITE_PAGES.findIndex(p => p.id === here.id);
  if (i < 0) return;

  const prev = i === 0 ? HOME_PAGE : SITE_PAGES[i - 1];
  const next = SITE_PAGES[i + 1] || null;
  const html = [];

  html.push(
    '<a class="pager-link prev" href="' + prev.file + '">' +
      '<span class="pager-dir">← 이전</span>' +
      '<span class="pager-title">' + prev.title + '</span>' +
    '</a>'
  );
  if (next) {
    html.push(
      '<a class="pager-link next" href="' + next.file + '">' +
        '<span class="pager-dir">다음 →</span>' +
        '<span class="pager-title">' + next.title + '</span>' +
      '</a>'
    );
  } else {
    html.push(
      '<a class="pager-link next" href="index.html">' +
        '<span class="pager-dir">다음 →</span>' +
        '<span class="pager-title">메인으로 돌아가기</span>' +
      '</a>'
    );
  }
  wrap.innerHTML = html.join('');
}

/* ── 7. 해시 앵커 처리 ──────────────────────
   ID를 스크립트로 부여하므로, 로드 직후 브라우저가
   찾지 못한 앵커를 직접 찾아 이동시킵니다.
──────────────────────────────────────────── */
function goToHash(behavior) {
  if (!location.hash) return;
  let el;
  try { el = document.querySelector(location.hash); } catch (_) { return; }
  if (!el) return;
  revealTarget(el);
  el.scrollIntoView({ behavior: behavior || 'auto', block: 'start' });
}

/* ── 8. 통합 검색 ──────────────────────────── */
function cleanText(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

function collectBlocks(doc, page) {
  ensureAnchorIds(doc);
  const scope = doc.body || doc;
  const blocks = [];

  scope.querySelectorAll('section[id]').forEach(sec => {
    const secTitle = cleanText(sec.querySelector('h2') ? sec.querySelector('h2').textContent : '');

    // 카드·소제목 단위
    sec.querySelectorAll('h3').forEach(h3 => {
      const card = h3.closest('.step-card');
      let text = '';
      if (card) {
        const clone = card.cloneNode(true);
        const ch = clone.querySelector('h3');
        if (ch) ch.remove();
        text = clone.textContent;
      } else {
        let el = h3.nextElementSibling;
        const buf = [];
        while (el && el.tagName !== 'H3') { buf.push(el.textContent); el = el.nextElementSibling; }
        text = buf.join(' ');
      }
      blocks.push({ page, section: secTitle, title: cleanText(h3.textContent), text: cleanText(text), anchor: h3.id });
    });

    // 용어 카드
    sec.querySelectorAll('.quality-card').forEach(card => {
      const v = card.querySelector('.value');
      if (!v) return;
      blocks.push({
        page, section: secTitle,
        title: cleanText(v.textContent),
        text: cleanText(card.querySelector('.sub') ? card.querySelector('.sub').textContent : ''),
        anchor: sec.id,
      });
    });

    // FAQ
    sec.querySelectorAll('.faq-item').forEach(item => {
      const q = item.querySelector('.faq-q');
      if (!q) return;
      const clone = q.cloneNode(true);
      const icon = clone.querySelector('.faq-icon');
      if (icon) icon.remove();
      blocks.push({
        page, section: secTitle,
        title: cleanText(clone.textContent),
        text: cleanText(item.querySelector('.faq-a') ? item.querySelector('.faq-a').textContent : ''),
        anchor: item.id,
      });
    });

    // 체크리스트
    sec.querySelectorAll('.check-item').forEach(ci => {
      const t = ci.querySelector('.check-text');
      if (!t) return;
      blocks.push({
        page, section: secTitle,
        title: cleanText(t.querySelector('strong') ? t.querySelector('strong').textContent : ''),
        text: cleanText(t.querySelector('span') ? t.querySelector('span').textContent : ''),
        anchor: sec.id,
      });
    });

    // 링크 모음
    sec.querySelectorAll('.link-item').forEach(li => {
      blocks.push({
        page, section: secTitle,
        title: cleanText(li.querySelector('.li-name') ? li.querySelector('.li-name').textContent : ''),
        text: cleanText((li.querySelector('.li-desc') ? li.querySelector('.li-desc').textContent : '') + ' ' + (li.getAttribute('href') || '')),
        anchor: sec.id,
      });
    });

    // 섹션 도입부
    const clone = sec.cloneNode(true);
    clone.querySelectorAll('.step-card, .faq-list, .checklist, .link-group, .quality-grid, .guide-grid').forEach(n => n.remove());
    const intro = cleanText(clone.textContent).replace(secTitle, '').trim();
    if (secTitle) blocks.push({ page, section: secTitle, title: secTitle, text: intro, anchor: sec.id, isSection: true });
  });

  return blocks;
}

let searchIndexPromise = null;

function getSearchIndex() {
  if (searchIndexPromise) return searchIndexPromise;
  const here = currentPage();
  const local = collectBlocks(document, here);

  searchIndexPromise = Promise.all(
    ALL_PAGES.filter(p => p.id !== here.id).map(p =>
      fetch(p.file)
        .then(r => (r.ok ? r.text() : ''))
        .then(html => {
          if (!html) return [];
          const doc = new DOMParser().parseFromString(html, 'text/html');
          return collectBlocks(doc, p);
        })
        .catch(() => [])
    )
  ).then(rest => local.concat.apply(local, rest));

  return searchIndexPromise;
}

function escapeReg(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function escapeHtml(s) {
  return (s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function snippet(text, keyword) {
  const max = 66;
  const safe = escapeHtml(text);
  const reg = new RegExp(escapeReg(escapeHtml(keyword)), 'i');
  const m = reg.exec(safe);
  if (!m) return safe.slice(0, max) + (safe.length > max ? '…' : '');
  const start = Math.max(0, m.index - 22);
  const cut = (start > 0 ? '…' : '') + safe.slice(start, start + max + keyword.length) + '…';
  return cut.replace(new RegExp(escapeReg(escapeHtml(keyword)), 'gi'), s => '<span class="result-highlight">' + s + '</span>');
}

function initSearch(input, results) {
  if (!input || !results) return;
  let token = 0;
  let warmed = false;

  function warm() {
    if (warmed) return;
    warmed = true;
    getSearchIndex();
  }

  input.addEventListener('focus', warm);

  input.addEventListener('input', () => {
    const keyword = input.value.trim();
    const my = ++token;
    if (!keyword) { results.classList.remove('visible'); return; }

    warm();
    results.innerHTML = '<div class="search-loading">검색 중…</div>';
    results.classList.add('visible');

    getSearchIndex().then(index => {
      if (my !== token) return;
      const reg = new RegExp(escapeReg(keyword), 'i');
      const hits = [];
      index.forEach(b => {
        let score = 0;
        if (reg.test(b.title)) score += 3;
        if (reg.test(b.section)) score += 2;
        if (reg.test(b.text)) score += 1;
        if (score > 0) hits.push({ b, score });
      });
      hits.sort((x, y) => y.score - x.score);

      if (hits.length === 0) {
        results.innerHTML = '<div class="search-no-result">검색 결과가 없습니다.</div>';
        return;
      }

      results.innerHTML = '';
      hits.slice(0, 16).forEach(({ b }) => {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        const name = b.isSection ? b.section : (b.section ? b.section + ' › ' + b.title : b.title);
        div.innerHTML =
          '<div class="result-title">' +
            '<span class="result-page">' + escapeHtml(b.page.label) + '</span>' +
            '<span class="result-name">' + escapeHtml(name) + '</span>' +
          '</div>' +
          '<div class="result-context">' + snippet(b.text || b.title, keyword) + '</div>';

        div.addEventListener('click', () => {
          results.classList.remove('visible');
          input.value = '';
          const target = '#' + b.anchor;
          if (b.page.id === currentPage().id) {
            const el = document.querySelector(target);
            if (el) {
              revealTarget(el);
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              history.replaceState(null, '', target);
            }
          } else {
            location.href = b.page.file + target;
          }
        });
        results.appendChild(div);
      });
    });
  });

  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !results.contains(e.target)) results.classList.remove('visible');
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') { results.classList.remove('visible'); input.blur(); }
    if (e.key === 'Enter') {
      const first = results.querySelector('.search-result-item');
      if (first) first.click();
    }
  });
}

/* ── 9. 초기화 ─────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  ensureAnchorIds(document);
  initTopbar();
  initPager();
  initOsToggles();
  updateProgress();

  document.querySelectorAll('[data-search]').forEach(box => {
    initSearch(box.querySelector('.search-input'), box.querySelector('.search-results'));
  });

  // 페이지 내 앵커를 누르면, 접혀 있는 카드는 먼저 펼칩니다.
  document.addEventListener('click', e => {
    const a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    const href = a.getAttribute('href');
    if (href.length < 2) return;
    let el;
    try { el = document.querySelector(href); } catch (_) { return; }
    revealTarget(el);
  });

  window.addEventListener('hashchange', () => goToHash('smooth'));

  goToHash('auto');
  window.addEventListener('load', () => goToHash('auto'));
});

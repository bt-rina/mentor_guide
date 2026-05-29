/* ================================================
 멘토링 업무 가이드 — main.js
 체크리스트, FAQ, 사이드바 활성 섹션 동작 담당
================================================ */

// ── 체크리스트 ──────────────────────────────
function toggleCheck(el) {
  el.classList.toggle('done');
  updateProgress();
}

function updateProgress() {
  const items = document.querySelectorAll('.check-item');
  const done  = document.querySelectorAll('.check-item.done').length;
  const pct   = items.length > 0 ? (done / items.length) * 100 : 0;
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('progress-label').textContent = done + ' / ' + items.length + ' 완료';
  const msg = document.getElementById('complete-msg');
  if (msg) msg.style.display = (done === items.length && items.length > 0) ? 'block' : 'none';
}

// ── FAQ ─────────────────────────────────────
function toggleFaq(btn) {
  const item   = btn.closest('.faq-item');
  item.classList.toggle('open');
}

// ── 사이드바 활성 섹션 하이라이트 ────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.sidebar-nav a');

function setActive(id) {
  navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === id));
}

const observer = new IntersectionObserver(entries => {
  let topEntry = null;
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (!topEntry || entry.boundingClientRect.top < topEntry.boundingClientRect.top) {
        topEntry = entry;
      }
    }
  });
  if (topEntry) setActive(topEntry.target.id);
}, { rootMargin: '-10% 0px -60% 0px', threshold: 0 });

sections.forEach(s => observer.observe(s));
navLinks.forEach(a => a.addEventListener('click', () => setActive(a.dataset.section)));

if (sections.length > 0) setActive(sections[0].id);

// ── 검색 ────────────────────────────────────
(function initSearch() {
  const input   = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  if (!input || !results) return;

  // 검색 대상 노드 수집: section 안의 텍스트 노드를 가진 요소들
  function buildIndex() {
    const index = [];
    document.querySelectorAll('section[id]').forEach(section => {
      const sectionTitle = section.querySelector('h2')?.textContent.trim() || '';
      // h3 단위로 분리
      section.querySelectorAll('h3').forEach(h3 => {
        const blockTitle = h3.textContent.trim();
        // h3 다음 형제 요소들에서 텍스트 수집
        let el = h3.nextElementSibling;
        const texts = [];
        while (el && el.tagName !== 'H3') {
          texts.push(el.textContent.trim());
          el = el.nextElementSibling;
        }
        index.push({
          sectionId: section.id,
          sectionTitle,
          blockTitle,
          fullText: texts.join(' '),
          anchor: h3,
        });
      });
      // h3 없는 섹션도 섹션 자체로 추가
      if (!section.querySelector('h3')) {
        index.push({
          sectionId: section.id,
          sectionTitle,
          blockTitle: '',
          fullText: section.textContent.trim(),
          anchor: section,
        });
      }
    });
    return index;
  }

  const index = buildIndex();

  function escapeReg(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlight(text, keyword) {
    const max = 60;
    const reg = new RegExp(escapeReg(keyword), 'gi');
    const match = reg.exec(text);
    if (!match) return text.slice(0, max) + '...';
    const start = Math.max(0, match.index - 20);
    const snippet = (start > 0 ? '...' : '') + text.slice(start, start + max + keyword.length) + '...';
    return snippet.replace(new RegExp(escapeReg(keyword), 'gi'),
      m => `<span class="result-highlight">${m}</span>`);
  }

  function search(keyword) {
    if (!keyword.trim()) { results.classList.remove('visible'); return; }
    const reg = new RegExp(escapeReg(keyword), 'gi');
    const hits = index.filter(item =>
      reg.test(item.blockTitle) || reg.test(item.sectionTitle) || reg.test(item.fullText)
    );

    results.innerHTML = '';
    if (hits.length === 0) {
      results.innerHTML = '<div class="search-no-result">검색 결과가 없습니다.</div>';
    } else {
      hits.forEach(item => {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        const titleText = item.blockTitle || item.sectionTitle;
        div.innerHTML = `
          <div class="result-title">${item.sectionTitle}${item.blockTitle ? ' › ' + item.blockTitle : ''}</div>
          <div class="result-context">${highlight(item.fullText || item.sectionTitle, keyword)}</div>
        `;
        div.addEventListener('click', () => {
          item.anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
          results.classList.remove('visible');
          input.value = '';
        });
        results.appendChild(div);
      });
    }
    results.classList.add('visible');
  }

  input.addEventListener('input', e => search(e.target.value));

  // 바깥 클릭 시 닫기
  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !results.contains(e.target)) {
      results.classList.remove('visible');
    }
  });
})();
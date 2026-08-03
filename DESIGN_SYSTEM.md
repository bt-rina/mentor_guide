# bluetiger · mentor guide — Design System

> 정적 멀티 페이지 사이트입니다. 빌드 과정 없이 HTML/CSS/JS 파일만으로 동작하며,
> **웹 서버에 배포된 상태(https://…)** 를 전제로 합니다. (검색 기능이 `fetch` 를 사용하므로
> `file://` 로 직접 열면 검색만 동작하지 않습니다.)

---

## 0. 사이트 구조

```
index.html                          ← 허브(메인). 목차 · 링크 모음 · 체크리스트 · FAQ
├── step-1-basics.html              STEP 1 기본 사항
├── step-2-preparation.html         STEP 2 사전 준비사항 (녹화 환경 세팅)
├── step-3-missions.html            STEP 3 멘토 필수 미션 🎯
├── step-4-lecture-assignment.html  STEP 4 강의 숙지 및 과제 점검
├── step-5-mentoring.html           STEP 5 멘토링 진행 (+ 운영 특이사항)
└── step-6-encouragement.html       STEP 6 수강생 참여 독려
    └── mentoring-examples.html     ↳ 멘토링 예시 자료 (STEP 6 하위 문서)

style.css   전 페이지 공통 스타일
main.js     전 페이지 공통 스크립트
```

**파일명 규칙**: `step-{번호}-{영문 슬러그}.html`. 번호가 바뀌면 파일명도 함께 바꿉니다.
번호와 파일명이 어긋나면 유지보수 때 반드시 헷갈립니다.

**STEP 3 (필수 미션)** 은 기한이 있는 액션만 모은 페이지입니다.
다른 페이지가 "알아두어야 할 것"이라면 여기는 "해야 할 것"이고,
목차 카드·브레드크럼 드롭다운에서 보라색으로 구분됩니다.

### 하위 문서

`SITE_PAGES` 항목에 `parent: '<상위 페이지 id>'` 를 주면 그 페이지의 **하위 문서**가 됩니다.

- 브레드크럼 드롭다운에서 `↳` 와 함께 들여쓰기되어 표시됩니다.
- 하위 문서 페이지의 탑바에는 상위 섹션 링크(`.crumb-parent`)가 한 단계 더 들어갑니다.
  `멘토 가이드 / STEP 6 / 멘토링 예시 자료`
- 메인 목차 그리드에는 **넣지 않습니다.** (카드로 넣으면 독립된 STEP 처럼 보입니다)
  진입 경로는 상위 페이지 본문의 링크 · 드롭다운 · 메인의 '참고 자료' 링크 모음 · 검색입니다.

- **모든 페이지가 사이드바 없는 한 단 구성**입니다. 페이지 간 이동은 상단 브레드크럼
  드롭다운과 하단 이전/다음 페이저 두 가지가 담당합니다.
- **메인 페이지**: 목차 카드 · 링크 모음 · 체크리스트 · FAQ. 뒤의 세 섹션은
  브레드크럼 드롭다운에 넣지 않습니다. (검색으로는 모두 찾을 수 있습니다.)

### 페이지 추가 방법

1. 기존 step 페이지를 복사해 `data-page="<새 id>"` 로 바꿉니다.
2. `main.js` 의 `SITE_PAGES` 배열에 `{ id, file, label, title, desc }` 를 추가합니다.
   (필수 미션 성격이면 `mission: true` 를 함께) → 브레드크럼 드롭다운·검색 인덱스에 자동 반영됩니다.
3. 메인 페이지의 `.guide-grid` 에 카드를 추가합니다.
4. 앞뒤 페이지의 `#page-pager` 마크업을 손으로 이어 줍니다. (아래 4-3 참조)

**중간에 페이지를 끼워 넣어 번호가 밀릴 때** 함께 고쳐야 하는 곳:
파일명 · `data-page` · `<title>` · `.cc-label` · `.section-label` ·
`SITE_PAGES` · 메인 카드 · 앞뒤 페이저 · **다른 페이지 본문의 "STEP N" 언급**.

> 페이지 안에서 절차를 번호로 부를 때는 `STEP N` 이 아니라 **`N단계`** 를 씁니다.
> 사이트 레벨의 STEP 번호와 헷갈리기 때문입니다. (예: STEP 2 페이지의 `1단계 · OBS Studio 설치`)

---

## 1. 디자인 토큰

### 색상 변수 (`style.css :root`)

| 변수 | 값 | 용도 |
|---|---|---|
| `--bg` | `#ffffff` | 페이지 배경 |
| `--surface` | `#f7f7f7` | 카드·체크리스트 배경 |
| `--surface2` | `#ffffff` | 내부 중첩 배경 |
| `--border` | `#c9c9c9` | 구분선·테두리 |
| `--accent` | `#4f8ef7` | 주 강조색 (파랑) |
| `--accent2` | `#7c3aed` | 보조 강조색 (보라) |
| `--accent3` | `#10b981` | 완료·성공 (초록) |
| `--warn` | `#f59e0b` | 주의 (노랑) |
| `--danger` | `#ef4444` | 위험·필수 (빨강) |
| `--text` | `#000000` | 본문 최강조 |
| `--text2` | `#1f1f1f` | 본문 기본 |
| `--text3` | `#555d75` | 보조·설명 텍스트 |

### 폰트 · 레이아웃 변수

| 변수 | 값 | 용도 |
|---|---|---|
| `--sans` | `'Pretendard', sans-serif` | 본문 전체 |
| `--mono` | `'Space Mono', monospace` | 배지·레이블·코드 |
| `--topbar-h` | `52px` | 브레드크럼 탑바 높이 (sticky 오프셋 기준) |

### 색 사용 규칙

- **파랑(accent)** = 기본 강조, 링크, 매주 반복되는 업무
- **보라(accent2)** = 멘토님이 직접 해야 하는 **미션·과제**, 기한이 있는 항목
- 한 화면에 보라를 두 군데 이상 쓰지 않습니다. 보라가 곧 "지금 할 일" 신호입니다.

---

## 2. 타이포그래피

| 요소 | 크기 | 굵기 | 비고 |
|---|---|---|---|
| `header h1` (메인 히어로) | `clamp(28px, 5vw, 52px)` | 900 | `letter-spacing: -.02em` |
| `header h1 em` | — | — | accent → #a78bfa 그라디언트 텍스트 |
| `.page-hero h1` (하위 페이지) | `clamp(25px, 3.6vw, 36px)` | 900 | 하위 페이지 제목 |
| `h2` | `clamp(22px, 3vw, 30px)` | 800 | 섹션 제목 (TOC 1단계) |
| `.part-hero h2` | `22px` | 900 | 파트 블록 안의 섹션 제목 |
| `h3` | `15px` | 700 | 카드 내부 소제목 (TOC 2단계) |
| `.section-subheading` | `19px` | 800 | 섹션 내 중간 제목, 하단 border |
| `.section-label` | `11px` | — | Space Mono, 대문자, accent 색 |
| 본문 (`body`) | `15px` | — | `line-height: 1.7` |
| 보조 텍스트 | `13–14px` | — | `color: var(--text2/3)` |

---

## 3. 레이아웃

### 3-1. 공통 골격

```
[ topbar (sticky, 52px) ]        ← 브레드크럼 + 드롭다운 + 검색
[ header / page-hero ]
[ page-body > main-content ]     ← 한 단, 가운데 정렬
[ page-pager ]                   ← 하위 페이지만
[ footer ]
```

- `.page-body`: `max-width: 1000px`, 좌우 패딩 `24px`, 가운데 정렬
- `.container`: 폭 제한 없음(`100%`). 폭은 `.page-body` 가 결정합니다.
- `section`: `padding: 64px 0` (메인) / `.doc-section`: `padding: 48px 0` (하위 페이지)
- `.main-content > section:first-of-type`: `padding-top: 44px` — 첫 화면에서 본문이 바로 보이도록
- **모바일 (`≤900px`)**: 탑바 검색 숨김, 좌우 패딩 `16px`

### 3-2. 하위 페이지 표준 마크업

```html
<body data-page="step-2">
  <nav class="topbar">…</nav>          <!-- 아래 4-1 참조. 모든 페이지 동일 -->
  <div class="page-body">
    <main class="main-content">
      <div class="container">
        <div class="page-hero">…</div>
      </div>
      <section class="doc-section" id="part-1">
        <div class="container">…</div>
      </section>
      <div class="container">
        <nav class="page-pager" id="page-pager">…</nav>
      </div>
    </main>
  </div>
</body>
```

> `data-page` 값은 `main.js` 의 `SITE_PAGES[].id` 와 반드시 일치해야 합니다.

---

## 4. 공통 페이지 크롬

### 4-1. Topbar / 브레드크럼

```html
<nav class="topbar">
  <div class="topbar-inner">
    <a href="index.html" class="crumb-home">
      <span class="crumb-mark">bluetiger</span>
      <span class="crumb-text">멘토 가이드</span>
    </a>
    <span class="crumb-sep">/</span>
    <div class="crumb-drop" id="crumb-drop">
      <button class="crumb-current" id="crumb-current" aria-expanded="false" aria-haspopup="true">
        <span class="cc-label">STEP 2</span>
        <span class="cc-title">사전 준비사항</span>
        <span class="cc-arrow">▼</span>
      </button>
      <div class="crumb-menu" id="crumb-menu"></div>   <!-- 스크립트가 채움 -->
    </div>
    <div class="topbar-spacer"></div>
    <div class="topbar-search" data-search>
      <input type="text" class="search-input" placeholder="🔍 가이드 전체 검색">
      <div class="search-results"></div>
    </div>
  </div>
</nav>
```

- 페이지마다 손대는 부분은 `.cc-label` / `.cc-title` 두 곳뿐입니다.
- 드롭다운 항목은 `SITE_PAGES` 에서 생성되며, 현재 페이지에 `.current` 가 붙습니다.
- 메인 페이지에서는 `HOME` / `전체 목차` 로 표기합니다.

### 4-2. Page Hero (하위 페이지 제목부)

```html
<div class="page-hero">
  <div class="section-label">Step 2</div>
  <h1>사전 준비사항</h1>
  <p class="hero-desc">한두 문장으로 이 페이지에서 무엇을 하는지 설명합니다.</p>
</div>
```

레이블 · 제목 · 한 줄 설명, **이 세 가지만** 둡니다.
기한이나 소요 시간 같은 정보는 히어로에 칩으로 나열하지 않고,
해당 내용이 나오는 곳(`.part-hero` 의 `.ph-when`, alert)에 한 번만 적습니다.

### 4-3. Page Pager (이전/다음)

```html
<nav class="page-pager" id="page-pager">
  <a class="pager-link prev" href="step-1-basics.html">
    <span class="pager-dir">← 이전</span>
    <span class="pager-title">STEP 1 · 기본 사항</span>
  </a>
  <a class="pager-link next" href="step-3-lecture-assignment.html">
    <span class="pager-dir">다음 →</span>
    <span class="pager-title">STEP 3 · 강의 내용 숙지 및 과제 점검</span>
  </a>
</nav>
```

- 링크는 **HTML 에 직접** 씁니다. 스크립트에 의존하지 않고 항상 보이게 하기 위함입니다.
- 비워 두면(`<nav class="page-pager" id="page-pager"></nav>`) 스크립트가 `SITE_PAGES`
  순서대로 채웁니다. 첫 페이지의 이전은 홈, 마지막 페이지의 다음도 홈입니다.

### 4-4. 텍스트 밀도 원칙

멘토님이 실제로 **행동해야 하는 내용**만 남기고, 설명·수식·반복은 덜어냅니다.

- 히어로 설명(`.hero-desc`, `.ph-desc`)은 **2문장 이내**.
- 섹션 제목 아래의 도입 문단은 없어도 되면 넣지 않습니다. (제목이 이미 설명합니다)
- 아래 카드에서 그대로 반복될 내용을 요약 문단으로 미리 쓰지 않습니다.
  요약이 필요하면 `.timeline.compact` 로 **제목만** 나열합니다.
- 같은 안내를 두 번 하지 않습니다. 단, OS 분기처럼 **한쪽만 읽는** 경우는 예외입니다.

---

## 5. 콘텐츠 컴포넌트

### 5-1. Badge / Section Label
```html
<div class="badge">bluetiger · mentor</div>
<div class="section-label">Step 1</div>
```
Space Mono, 11px, 대문자, accent 색.

---

### 5-2. Part Hero (페이지 안의 큰 파트 구분) — `.part-hero`
```html
<div class="part-hero">          <!-- 보라(기본) -->
  <div class="ph-top">
    <span class="ph-num">PART 1</span>
    <span class="ph-when">개강일 전까지 · 최초 1회 · 약 20분</span>
  </div>
  <h2>멘토링 녹화 준비</h2>
  <p class="ph-desc">이 파트에서 무엇을 왜 하는지 설명합니다.</p>
</div>

<div class="part-hero blue">…</div>   <!-- 파랑 변형 -->
```

- 한 페이지 안에 **동등한 무게의 파트가 2개 이상**일 때 사용합니다.
  파트마다 별도의 `<section class="doc-section" id="part-N">` 으로 감싸 TOC에 나란히 노출시킵니다.
- 기존 `.section-subheading-block` 은 한 줄짜리 가벼운 구분용으로 남겨두되,
  파트 구분에는 `.part-hero` 를 사용합니다.

---

### 5-3. Guide Card (메인 목차 카드) — `.guide-grid` / `.guide-card`
```html
<a class="guide-card" href="step-1-basics.html">
  <span class="gc-step">Step 1</span>
  <span class="gc-title">기본 사항</span>
  <span class="gc-desc">한 문장 설명</span>
  <span class="gc-go">자세히 보기 →</span>
</a>
```
- `.guide-card.alt` = 보라 변형 (예시 자료 등 부가 페이지용).
- `.guide-card.mission` = 필수 미션 페이지용. **크기와 배치는 다른 카드와 동일**하고,
  파랑→보라 그라디언트 배경과 알약형 레이블로만 강조합니다.
  (카드 하나만 크게 만들면 목차 그리드의 리듬이 깨집니다)
- 설명은 **한 문장**. 키워드 태그를 따로 나열하지 않습니다 —
  설명과 태그를 둘 다 두면 카드가 곧바로 텍스트 과포화가 됩니다.

---

### 5-4. Link Hub (링크 모음) — `.link-group` / `.link-item`
```html
<div class="link-group">
  <div class="link-group-title">🔁 매주 사용하는 링크 <span class="lg-tag">weekly</span></div>
  <div class="link-grid">
    <a class="link-item" href="…" target="_blank" rel="noopener noreferrer">
      <span class="li-icon">📋</span>
      <span class="li-text">
        <span class="li-name">출석부</span>
        <span class="li-desc">언제 쓰는 링크인지 한 줄</span>
      </span>
    </a>
  </div>
</div>
```

- `.li-text` 래퍼는 **필수**입니다. `.li-name` / `.li-desc` 가 `display:block` 이라
  제목과 설명이 두 줄로 나뉩니다. 래퍼를 빼면 아이콘과의 정렬이 무너집니다.
- 메인의 링크 모음은 **weekly(매주 쓰는 것)** 와 **reference(참고 자료)** 두 그룹만 둡니다.
  최초 1회만 쓰는 설치 링크는 메인에 올리지 않고 STEP 2 본문에만 둡니다.
- 링크를 새로 추가할 때는 해당 단계 페이지와 메인 링크 모음 **양쪽 모두**에 넣습니다.
  (매주 쓰는 링크인 경우)

---

### 5-5. Timeline — `.timeline`
```html
<div class="timeline">              <!-- 파랑(기본) -->
  <div class="tl-item">
    <div class="tl-num">1</div>
    <div class="tl-body">
      <div class="tl-title">단계 제목</div>
      <div class="tl-desc">설명</div>
    </div>
  </div>
</div>
```

| 변형 | 용도 |
|---|---|
| `.timeline` | 순서가 있는 절차 요약 (파랑) |
| `.timeline.accent2` | 미션 카드 내부의 절차 (보라) |
| `.timeline.days` | `D-3`, `주중` 처럼 **긴 라벨**을 쓸 때 (`--tl-w: 46px`) |
| `.timeline.compact` | `.tl-desc` 없이 **제목만** 나열하는 요약 |

**Timeline Panel** — 페이지 최상단에서 전체 흐름을 먼저 보여줄 때:
```html
<section class="doc-section" id="first-week">
  <div class="container">
    <div class="timeline-panel">
      <h2>개강 첫 주, 이렇게 진행됩니다</h2>
      <p class="tp-sub">한 줄 부제</p>
      <div class="timeline days">…</div>
    </div>
  </div>
</section>
```
파랑→보라 그라디언트 배경이라 일반 `.step-card`(회색)와 확실히 구분됩니다.
**페이지당 하나**, 맨 위에만 사용합니다.

세로선 위치는 `--tl-w` 로 계산되므로, 라벨 폭을 바꿀 땐 이 변수만 조정합니다.

---

### 5-6. Quality Card (용어 카드) — `.quality-grid` / `.quality-card`
```html
<div class="quality-card">
  <div class="value">용어명</div>
  <div class="label">부제</div>   <!-- 선택 -->
  <div class="sub"><ul><li>설명</li></ul></div>
</div>
```
- 기본 그리드 `repeat(auto-fill, minmax(200px, 1fr))`, 상단 accent→accent2 그라디언트 라인.
- `.quality-grid.cols-1` — 한 줄에 **1개**. 항목마다 설명 분량 차이가 클 때 사용합니다.
  여러 열로 두면 긴 카드 옆에 큰 빈 공간이 생기는데, 1열이면 그 문제가 없습니다.
- `align-items: start` 라서 내용이 짧은 카드는 억지로 늘어나지 않습니다.
- `.value` 는 검색 인덱스의 제목으로 쓰이므로 **용어 그 자체**를 넣습니다.

---

### 5-7. Step Card / Mission Card
```html
<div class="step-card">
  <div class="step-body">
    <h3>제목</h3>
    …
  </div>
</div>

<div class="step-card mission-card">…</div>   <!-- 멘토님 미션 -->
```
- `h3` 는 자동 TOC의 2단계 항목이 되므로, **카드 제목은 반드시 `h3`** 로 씁니다.
- 다른 페이지에서 링크로 걸 카드에는 `h3` 에 **직접 id** 를 부여합니다.
  (예: `<h3 id="auto-record-windows">`) — 자동 생성 id 는 제목 문구가 바뀌면 함께 바뀝니다.
- Mission Card 는 보라 테두리 + hover glow. 페이지당 하나만 씁니다.

---

### 5-8. Toggle Card (접이식 카드) — `.toggle-card`
```html
<div class="step-card toggle-card" data-os="windows">
  <div class="toggle-head" onclick="toggleCard(this)" role="button" tabindex="0" aria-expanded="false">
    <h3 id="auto-record-windows">🖥 STEP 6 · 자동 실행·녹화 설정 (Windows)
      <span class="th-hint">작업 스케줄러로 예약합니다</span>
    </h3>
    <span class="th-icon">+</span>
  </div>
  <div class="toggle-body">
    <div class="step-body">…</div>
  </div>
</div>
```

- **용도**: ① 하나만 읽으면 되는 분기 콘텐츠(OS별 안내) ② 필요할 때만 찾아보는 참고 절차
  (예: '자동 실행·녹화 끄는 방법'). 늘 읽어야 하는 내용은 접지 않습니다.
- `data-os` 가 없으면 **항상 접힌 상태로 시작**합니다.
- `h3` 는 `.toggle-head` 의 직계 자식이어야 합니다. 접혀 있어도 제목은 보이고,
  목차·검색 결과에서 이 제목으로 찾아올 수 있습니다.
- `data-os="windows" | "mac"` 를 주면 접속 기기에 맞는 카드가 **자동으로 펼쳐집니다.**
  (URL 에 해시가 있으면 자동 펼침을 건너뛰고 해당 앵커를 우선합니다.)
- 접힌 카드 안의 앵커로 이동하면(목차 클릭·검색 결과·외부 링크) 자동으로 펼쳐집니다.
- FAQ 아코디언과 달리 `max-height` 가 아닌 `display` 로 여닫으므로 **높이 제한이 없습니다.**
  이미지가 많은 긴 내용은 FAQ 대신 이 컴포넌트를 쓰세요.

---

### 5-9. Info Grid — `.info-grid` / `.info-box`
```html
<div class="info-grid">
  <div class="info-box">
    <div class="ib-title">📝 제목</div>
    <ul><li>항목</li></ul>
  </div>
</div>
```
"A와 B의 차이"처럼 **나란히 비교**할 때 사용합니다.

---

### 5-10. Bullet List
```html
<ul class="bullet-list">
  <li><span class="li-main">항목 내용</span>
    <ul><li>하위 항목</li></ul>
  </li>
</ul>
```
- 최상위 마커 `→` (accent), 하위 마커 `↳` (accent 60%)
- 1단계 항목의 내용은 `<span class="li-main">` 으로 감쌉니다. (마커가 이 요소에 붙습니다)

> **마커는 `::before` + `position:absolute` 로 답니다.**
> 리스트 항목을 `display:flex` 로 만들고 마커를 첫 플렉스 아이템으로 두면,
> 문장 중간의 `<strong>` 이 **별도 플렉스 아이템이 되어 줄이 끊기고 이상한 여백이 생깁니다.**
> `.bullet-list`, `.quality-card .sub ul`, `.info-box ul` 모두 이 방식으로 통일되어 있습니다.
> 새 리스트 컴포넌트를 만들 때도 같은 방식을 쓰세요.

---

### 5-11. Alert Box
```html
<div class="alert alert-warn">
  <span class="alert-icon">⚠️</span>
  <span>내용</span>
</div>
```

| 클래스 | 용도 |
|---|---|
| `alert-warn` | 주의사항 (노랑) |
| `alert-danger` | 필수·위험 (빨강) |
| `alert-info` | 참고·팁 (파랑) |
| `alert-accent2` | 마감·미션 강조 (보라) |

alert 안의 `<strong>` 과 리스트 마커는 **alert 색을 그대로 상속**합니다.
(본문 강조색 `var(--text)` 가 들어가 색이 튀지 않도록 오버라이드해 두었습니다.)

---

### 5-11-1. 링크 표기 규칙

- **본문 중간의 하이퍼링크는 항상 `색 + 밑줄`** 로 표시합니다.
  색만으로는 링크인지 강조인지 구분되지 않기 때문입니다.
  (`text-underline-offset: 3px`, 기본 밑줄은 연하게 → hover 시 진해짐)
- **밑줄을 빼는 것은 버튼·카드형 링크뿐**입니다:
  `.btn` `.download-link` `.guide-card` `.link-item` `.pager-link` `.crumb-home` `.crumb-menu a`
  형태 자체로 클릭 가능함이 드러나기 때문입니다.
- alert 안의 링크는 `color: inherit` 로 **alert 색을 따르고 밑줄로만 구분**합니다.
  HTML 에 인라인 `style="text-decoration:…"` 을 쓰지 마세요. CSS 가 이미 처리합니다.

---

### 5-12. Download / Action Link
```html
<a href="…" class="download-link">⬇ 텍스트</a>
```
보라 변형: `style="background:rgba(124,58,237,.1);border-color:rgba(124,58,237,.35);color:#9f6fea;"`

---

### 5-13. Checklist (메인 전용)
```html
<div class="check-item" onclick="toggleCheck(this)">
  <div class="check-box"><svg …></svg></div>
  <div class="check-text"><strong>제목</strong><span>설명</span></div>
</div>
<div class="progress-bar-wrap"><div class="progress-bar" id="progress-bar"></div></div>
<div class="progress-label" id="progress-label">0 / N 완료</div>
```
항목을 추가하면 `progress-label` 초기 텍스트의 N 도 함께 고쳐 주세요(로드 시 자동 갱신되지만 초기 표시값).

---

### 5-14. FAQ Accordion (메인 전용)
```html
<div class="faq-item">
  <button class="faq-q" onclick="toggleFaq(this)">질문<div class="faq-icon">+</div></button>
  <div class="faq-a"><div class="faq-a-inner">답변</div></div>
</div>
```
- `.faq-item` 에는 스크립트가 `faq-1`, `faq-2`… 순서대로 id 를 부여합니다.
  검색 결과나 외부 링크로 특정 FAQ 에 들어오면 **자동으로 펼쳐집니다.**
- 답변 최대 높이가 `400px` 이므로, 이미지가 포함된 긴 답변은 높이를 확인해 주세요.

---

### 5-15. 기타

| 컴포넌트 | 클래스 | 비고 |
|---|---|---|
| OS 구분 라벨 | `.os-label` | `🖥 Windows` / `🍎 Mac` |
| 코드 블록 | `.code-block`, `code` | 배경 `#1a1a2e` / 인라인 accent |
| 단계 이미지 | `.step-img`, `.img-row` | `.img-row` 는 2장 나란히 |
| 영상 프레임 | `.media-frame` | `<video controls preload="metadata">` |
| 이미지 2장 | `.img-pair` | 반응형 wrap |
| 리드 문단 | `.lead-box` | 보라 좌측 라인 인용 박스 |
| 서술형 본문 | `.prose` | 문단 위주 페이지(예시 자료)에서 사용 |
| 주간 캘린더 | `.week-calendar`, `.cal-table`, `.cal-note` | |

---

## 6. 스크립트 규약 (`main.js`)

### 6-1. 단일 출처

`SITE_PAGES` 배열 하나가 **브레드크럼 드롭다운 · 이전/다음 페이저 · 검색 인덱스**를 모두 만듭니다.
페이지를 늘리거나 제목을 바꿀 때는 이 배열만 고치면 됩니다.

### 6-2. 앵커 ID 자동 부여

- 로드 시 `h2` / `h3` 중 id 가 없는 것에 제목 기반 slug(`h-…`)를, `.faq-item` 에 `faq-N` 을 부여합니다.
- 같은 문서 구조라면 **항상 같은 id** 가 나오므로, 다른 페이지를 `fetch` 해서 만든 검색 결과의
  링크(`step-2-preparation.html#h-…`)가 실제 페이지의 앵커와 일치합니다.
- 스크립트가 부여한 id 는 **제목 문구를 바꾸면 함께 바뀝니다.** 영구적으로 걸어둘 링크에는
  HTML 에 직접 id 를 써 주세요. 현재 고정 id: `auto-record-windows`, `auto-record-mac`,
  `auto-record-off`, `mission`, `part1-flow`, `intro-lms`, `intro-discord`, `first-week`.

### 6-3. 검색

- 검색창은 `data-search` 속성을 가진 래퍼 + 내부의 `.search-input` / `.search-results` 로 이루어집니다.
  같은 페이지에 여러 개 둬도 됩니다(메인은 히어로 + 탑바 2개).
- 첫 포커스 시 현재 페이지는 DOM 에서, 나머지 페이지는 `fetch` + `DOMParser` 로 인덱싱합니다.
  결과는 한 번만 만들어 재사용합니다.
- 인덱스 단위: **섹션 도입부 · h3 카드 · 용어 카드 · FAQ · 체크리스트 항목 · 링크 항목**.
- 점수: 제목 일치 3점 / 섹션명 일치 2점 / 본문 일치 1점, 상위 16개 표시.
- 결과에는 `STEP 2` 같은 페이지 배지가 함께 표시되고, 다른 페이지 결과를 누르면 해당 앵커로 이동합니다.
- **콘텐츠를 수정해도 검색 인덱스는 따로 갱신할 필요가 없습니다.** (런타임 생성)

### 6-4. 자동 생성되는 DOM

| 대상 | id | 생성 내용 |
|---|---|---|
| 브레드크럼 메뉴 | `#crumb-menu` | `SITE_PAGES` 링크 목록 |
| 이전/다음 | `#page-pager` | **비어 있을 때만** 앞뒤 페이지 링크를 채움 |

### 6-5. 전역 함수 (인라인 `onclick` 에서 호출)

| 함수 | 대상 |
|---|---|
| `toggleCheck(el)` | `.check-item` 체크리스트 |
| `toggleFaq(btn)` | `.faq-q` FAQ 아코디언 |
| `toggleCard(head)` | `.toggle-head` 접이식 카드 |

---

## 7. 애니메이션

- 헤더 요소 순차 등장: `fadeUp` (opacity 0→1, translateY 20px→0), 80ms 간격
- 인터랙션 전환: 기본 `.2s` / mission-card hover `.25s` / FAQ 슬라이드 `max-height .35s`
- 카드 hover: `translateY(-1px ~ -3px)` + border 색상 변화

---

## 8. 반응형 브레이크포인트

| 브레이크포인트 | 변경 사항 |
|---|---|
| `≤ 900px` | 탑바 검색 숨김, 페이저 1열, 좌우 패딩 축소 |
| `≤ 600px` | quality-grid 2열, 탑바 홈 텍스트 숨김(마크만), part-hero·toggle-head 패딩 축소 |

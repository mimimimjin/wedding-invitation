# Hero Illustration Overlay Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 히어로 문구 전체를 일러스트 상단 빈 공간으로 옮기고 어두운 오버레이와 흰색 글씨를 일러스트에 어울리는 스타일로 교체한다.

**Architecture:** HTML 구조는 유지하고 `styles.css`의 히어로 오버레이 레이아웃과 색상만 변경한다. 정적 CSS 회귀 테스트로 핵심 디자인 규칙을 고정하고 실제 브라우저에서 반응형 배치를 확인한다.

**Tech Stack:** HTML, CSS, Node.js built-in test runner, in-app browser

---

### Task 1: Hero Overlay Style Contract

**Files:**
- Create: `tests/hero-style.test.mjs`
- Modify: `styles.css:140-186`

**Step 1: Write the failing test**

`styles.css`를 읽고 `.hero-overlay`가 상단 배치, 투명 배경, 딥 브릭 레드 텍스트를 사용하며 기존 검은 그라데이션과 하단 정렬을 사용하지 않는지 검증한다.

**Step 2: Run test to verify it fails**

Run: `node --test tests/hero-style.test.mjs`
Expected: FAIL because the current overlay uses a black gradient, white text, and `flex-end` alignment.

**Step 3: Write minimal implementation**

`styles.css`에서 오버레이 배경을 투명하게 만들고 `justify-content: flex-start`, 비율 기반 상단 패딩, 딥 브릭 레드 텍스트와 약한 밝은 그림자를 적용한다.

**Step 4: Run test to verify it passes**

Run: `node --test tests/hero-style.test.mjs`
Expected: PASS.

**Step 5: Verify in browser**

로컬 정적 서버로 페이지를 열어 모바일·데스크톱 화면에서 문구가 상단 리본과 인물 사이에 위치하고 텍스트 대비가 충분한지 확인한다.

**Step 6: Commit**

```bash
git add tests/hero-style.test.mjs styles.css
git commit -m "fix: refine hero illustration overlay"
```

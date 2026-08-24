# Wedding Calendar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the hero-adjacent countdown timer with a monthly calendar card that highlights the configured wedding day.

**Architecture:** Add a small reusable calendar utility that converts the configured wedding date into a month grid, then render that grid inside the existing countdown section. Keep external calendar export actions unchanged.

**Tech Stack:** Static HTML, vanilla JavaScript, CSS, Node built-in test runner

---

### Task 1: Add a failing calendar-model test

**Files:**
- Create: `tests/calendar-utils.test.cjs`
- Modify: `package.json`

**Step 1: Write the failing test**

Create a test that imports `createCalendarModel('2026-10-17')` and checks:
- `displayMonth === '2026.10'`
- `displayDate === '2026.10.17'`
- weekday labels are in Korean starting from Sunday
- the first row is `[null, null, null, null, 1, 2, 3]`
- only day `17` is marked as the wedding day

**Step 2: Run test to verify it fails**

Run: `node --test tests/calendar-utils.test.cjs`
Expected: FAIL because `calendar-utils.js` does not exist yet

**Step 3: Write minimal implementation**

Create `calendar-utils.js` with a small browser-and-Node-compatible export that builds:
- month metadata
- weekday labels
- padded month/date display strings
- week rows of 7 cells

**Step 4: Run test to verify it passes**

Run: `node --test tests/calendar-utils.test.cjs`
Expected: PASS

### Task 2: Replace countdown markup with calendar markup

**Files:**
- Modify: `index.html`

**Step 1: Update the section structure**

Replace the four countdown stat blocks with:
- date label container
- calendar card container
- weekday row container
- day grid container

Keep the Google and Apple export buttons unchanged.

**Step 2: Load the new utility**

Insert `calendar-utils.js` before `script.js` so the renderer can use `window.CalendarUtils`.

### Task 3: Render the monthly calendar and restyle the section

**Files:**
- Modify: `script.js`
- Modify: `styles.css`

**Step 1: Replace timer logic with calendar rendering**

Use `CalendarUtils.createCalendarModel(c.wedding.date)` to:
- fill the display date
- fill the month heading
- render weekday labels
- render day cells
- mark the wedding day

**Step 2: Preserve summary and export actions**

Replace the live `D-day` line with a static ceremony summary based on the configured date/time. Leave Google/Apple calendar button behavior intact.

**Step 3: Update styles**

Add card-based styles for:
- `.countdown-date-label`
- `.countdown-card`
- `.countdown-weekdays`
- `.countdown-days`
- `.countdown-day`
- `.countdown-day.is-wedding`

### Task 4: Verify end to end

**Files:**
- Test: `tests/calendar-utils.test.cjs`
- Test: `tests/hero-style.test.mjs`

**Step 1: Run the automated tests**

Run: `npm test`
Expected: PASS

**Step 2: Inspect the final diff**

Run: `git diff -- index.html styles.css script.js calendar-utils.js tests/calendar-utils.test.cjs`
Expected: only the calendar replacement and supporting files appear

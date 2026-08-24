# Wedding Calendar Design

## Goal

Replace the center countdown timer with a monthly calendar card that highlights the wedding date `2026.10.17`, while preserving the existing calendar export buttons.

## Recommended Approach

Render the section as a static monthly calendar card generated from the configured wedding date instead of a live ticking timer. This keeps the visual stable, matches the reference image more closely, and avoids unnecessary interval-based updates.

## Structure

- Keep the existing section location in the page flow.
- Replace the countdown number grid with:
  - a small formatted date label
  - a rounded calendar card
  - a month title
  - weekday headers
  - a 7-column day grid with the wedding day emphasized
- Keep the Google and Apple calendar buttons below the card.

## Data Flow

- Read `CONFIG.wedding.date` from `config.js`.
- Build a calendar model for that month.
- Render the month title and day cells into the countdown section.
- Show a single summary line for the ceremony date and time instead of a live `D-day` counter.

## Styling

- Preserve the template's minimal neutral tone.
- Use a white rounded card on the existing soft gray section background.
- Highlight only the wedding day with a muted filled circle.
- Keep spacing generous on mobile and avoid dense grid lines.

## Testing

- Add an automated test for the calendar model built from `2026-10-17`.
- Verify that:
  - the month label is `2026.10`
  - the date label is `2026.10.17`
  - the first week offset is correct
  - only day `17` is highlighted

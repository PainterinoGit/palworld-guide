# Guide UI Override

The guide uses a dark-first gaming interface with a restrained Swiss/block layout.

## Colors

- Background: `#0B1020`
- Surface: `#111A2E`
- Card: `#151F36`
- Primary: `#4F7CFF`
- Secondary: `#8B5CF6`
- Action/accent: `#F59E0B`
- Success: `#22C55E`
- Text: `#F8FAFC`
- Muted text: `#A7B3C8`
- Border: `rgba(255,255,255,.12)`

## Typography

- Headings and navigation: Russo One
- Body and data labels: Chakra Petch
- Body copy: minimum 16px on mobile, line-height 1.5–1.75
- Data values use tabular figures where possible

## Interaction

- Interactive targets are at least 44px on touch layouts.
- Every focused control keeps a visible 2px ring using the primary color.
- Hover transitions use 150–250ms and do not shift layout.
- Pal details work with hover, keyboard focus and tap; hover is never the only path.
- `prefers-reduced-motion: reduce` disables non-essential transitions.

## Layout

- 4px/8px spacing rhythm.
- Breakpoints: 375px, 768px, 1024px, 1440px.
- Standard team cards are three columns on desktop and one column below 900px.
- Special teams use a visually subordinate gold section label.
- No horizontal scrolling on mobile.

## Icon rule

New controls should use text labels or a consistent SVG icon set. Existing emoji content is legacy content and should be replaced incrementally during navigation cleanup.

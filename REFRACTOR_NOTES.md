# Refactor Notes — Task-05 foundation

## What changed
- Added `public/styles/tokens.css` (design tokens, additive)
- Linked the token CSS from `public/index.html`

## Why
- Prepare for incremental redesign (Task-06) without a big-bang rewrite.
- Keep existing inline CSS intact (non-removal + low risk).

## Non-removal considerations
- No routes, sections, or JS behaviors were intentionally modified.
- Token CSS introduces new variables only; existing `:root` variables in `index.html` remain the source of truth for current styling.

## Next steps
- Move inline CSS from `index.html` into external CSS files gradually.
- Introduce component-level CSS classes while preserving DOM structure.
- Implement i18n with minimal DOM changes (Task-07) after choosing a runtime approach.

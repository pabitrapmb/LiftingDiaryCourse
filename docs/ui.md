# UI Coding Standards

## Component Library

**Only shadcn/ui components are permitted in this project.**

- Do NOT create custom UI components.
- Do NOT use any other component library (e.g. MUI, Chakra, Mantine, Radix primitives directly).
- Every UI element must be built using shadcn/ui components from `@/components/ui`.
- If a required component does not exist yet, add it via the shadcn CLI:

```bash
npx shadcn@latest add <component-name>
```

## Date Formatting

All dates must be formatted using **date-fns**. Do not use `Date.toLocaleDateString`, `Intl.DateTimeFormat`, or any other date formatting approach.

### Required Format

Dates must be displayed with an ordinal day suffix, abbreviated month, and four-digit year:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

### Implementation

Use `format` from `date-fns` with the `do` token for the ordinal day:

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy"); // e.g. "1st Sep 2025"
```

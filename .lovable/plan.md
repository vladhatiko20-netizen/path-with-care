We will perform the requested structural change in the admin layout sidebar:

1. **Modify `src/routes/_admin.tsx`**:
   - Locate the «Паломник» logo link inside the `SidebarContent` component (line 75).
   - Replace `<Link to="/" className="font-serif text-lg text-foreground">Паломник</Link>` with a non-clickable `<span className="font-serif text-lg text-foreground">Паломник</span>`.
   - Leave all text, fonts, layout classes, and spacing identical to preserve the exact styling.

We will update the Romanian translation of the slogan under the logo in the website header.

### Steps to execute
1. Read `src/components/site/Header.tsx` L93-L100 (already verified).
2. Modify L96:
   From: `{t("Путь к Святыням", "Cale spre sfinte locuri")}`
   To: `{t("Путь к Святыням", "Calea spre locurile sfinte")}`
3. Verify that the application builds and runs correctly with no other files modified.

### Technical details
This is a simple JSX text replacement in a presentation component, which does not affect any database schemas or server functions.
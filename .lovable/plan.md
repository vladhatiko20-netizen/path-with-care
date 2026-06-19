To implement the requested feature on the destination page (`src/page-views/DestinationSlugPage.tsx`), I will modify the success state representation after a lead form submission.

### Proposed Changes

1. **Keep the Form Mounted but Hidden:**
   Instead of using a ternary condition `{sent ? <SuccessBlock /> : <Form />}` which unmounts the form, we will render both sections sequentially:
   * The success block will be rendered conditionally using `{sent && ( ... )}`.
   * The form will always be mounted but hidden dynamically using CSS class matching, e.g. `className={\`space-y-4 font-serif \${sent ? "hidden" : ""}\`}`.

2. **Style and Content of the Success Block:**
   The success block will be styled exactly as requested:
   * **Container styles:** Background `#d1fae5` (`bg-[#d1fae5]`), border `#10b981` (`border-[#10b981]`), text `#065f46` (`text-[#065f46]`), with a border and rounded corners.
   * **Icon:** `CheckCircle` from `lucide-react` (imported and colored with `#10b981` / `text-[#10b981]`).
   * **Title & Subtitle:** Localization-friendly using `t()`:
     * Title: RU "Заявка принята", RO "Cererea a fost primită"
     * Subtitle: RU "Мы свяжемся с вами в ближайшее время", RO "Vă vom contacta în cel mai scurt timp"

### Technical Details

* **Import Change:** Add `CheckCircle` to the `lucide-react` imports.
* **Component modification in `LeadForm`:**
  ```tsx
  {sent && (
    <div className="p-6 bg-[#d1fae5] border border-[#10b981] rounded-sm text-[#065f46] font-serif flex items-start gap-4 mb-6">
      <CheckCircle className="w-6 h-6 text-[#10b981] shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        <h3 className="font-semibold text-lg md:text-xl mb-1">
          {t("Заявка принята", "Cererea a fost primită")}
        </h3>
        <p className="text-sm md:text-base leading-relaxed opacity-90">
          {t("Мы свяжемся с вами в ближайшее время", "Vă vom contacta în cel mai scurt timp")}
        </p>
      </div>
    </div>
  )}
  
  <form onSubmit={onSubmit} className={`space-y-4 font-serif ${sent ? "hidden" : ""}`}>
    {/* Form contents remain unchanged */}
  </form>
  ```

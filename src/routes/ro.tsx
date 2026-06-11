import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LangProvider } from "@/lib/i18n";

export const Route = createFileRoute("/ro")({
  component: RoLayout,
});

function RoLayout() {
  return (
    <LangProvider lang="ro">
      <Outlet />
    </LangProvider>
  );
}
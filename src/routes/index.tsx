import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Shivaryan Infotech
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          SAISPL — Business Software &amp; AI Automation
        </p>
      </div>
    </div>
  );
}

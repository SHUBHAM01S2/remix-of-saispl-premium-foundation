import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: Terms,
});

function Terms() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Terms and Conditions
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Coming soon.
        </p>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">About</h1>
        <p className="mt-3 text-lg text-muted-foreground">Shivaryan Infotech — About Us</p>
      </div>
    </div>
  );
}

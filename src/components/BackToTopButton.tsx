import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={scrollToTop}
      className={`fixed bottom-24 right-6 z-40 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-background/80 text-foreground shadow-[0_10px_40px_-10px_hsl(var(--brand)/0.6)] backdrop-blur-md transition-all duration-300 hover:border-brand/60 hover:bg-brand hover:text-brand-foreground hover:shadow-[0_15px_50px_-10px_hsl(var(--brand)/0.9)] focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-background ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

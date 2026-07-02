import { useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Lang = {
  code: string;
  label: string;
  region: string;
  available: boolean;
};

const LANGUAGES: Lang[] = [
  { code: "en", label: "English", region: "Global", available: true },
  { code: "hi", label: "हिन्दी (Hindi)", region: "India", available: false },
  { code: "es", label: "Español", region: "Latin America / Spain", available: false },
  { code: "fr", label: "Français", region: "France", available: false },
  { code: "de", label: "Deutsch", region: "Germany", available: false },
  { code: "ar", label: "العربية (Arabic)", region: "Middle East", available: false },
];

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState("en");
  const current = LANGUAGES.find((l) => l.code === active) ?? LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Change language or region"
          className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-transparent px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
        >
          <Globe className="h-3.5 w-3.5" />
          {!compact && (
            <span className="uppercase tracking-wide">{current.code}</span>
          )}
          <ChevronDown className="h-3 w-3 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Language & region
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            disabled={!lang.available}
            onSelect={(e) => {
              if (!lang.available) {
                e.preventDefault();
                return;
              }
              setActive(lang.code);
            }}
            className="flex items-start justify-between gap-3"
          >
            <div className="flex flex-col">
              <span className="text-sm text-foreground">{lang.label}</span>
              <span className="text-[11px] text-muted-foreground">
                {lang.region}
              </span>
            </div>
            {active === lang.code ? (
              <Check className="mt-0.5 h-4 w-4 text-brand" />
            ) : lang.available ? null : (
              <span className="mt-0.5 rounded-full border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                Soon
              </span>
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <p className="px-2 py-1.5 text-[11px] leading-snug text-muted-foreground">
          Additional languages are being rolled out. Contact us if you need a
          specific locale prioritised.
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

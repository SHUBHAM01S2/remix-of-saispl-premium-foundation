import { createContext, useContext } from "react";

export const NewReferralContext = createContext<{ open: () => void } | null>(null);

export function useOpenNewReferral() {
  const ctx = useContext(NewReferralContext);
  return ctx?.open ?? (() => {});
}

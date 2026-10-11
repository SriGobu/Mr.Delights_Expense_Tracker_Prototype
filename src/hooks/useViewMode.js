import { useCallback, useState } from "react";

// Remembers grid / list per page. `pageKey` keeps each page's choice separate.
// Default: grid on phones, list on larger screens (until the user picks one).
export function useViewMode(pageKey, fallback) {
  const storageKey = `mrd_view_${pageKey}`;

  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === "grid" || saved === "list") return saved;
    } catch {
      /* storage blocked: use the default */
    }
    return fallback || (window.innerWidth < 768 ? "grid" : "list");
  });

  const change = useCallback(
    (next) => {
      setMode(next);
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        /* ignore */
      }
    },
    [storageKey],
  );

  return [mode, change];
}

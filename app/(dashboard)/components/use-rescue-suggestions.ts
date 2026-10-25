"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "chubby_hearts_rescue_suggestions";

export function useRescueSuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSuggestions(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load rescue suggestions", e);
    }
  }, []);

  function addSuggestion(rescue: string) {
    const trimmed = rescue.trim();
    if (!trimmed) return;

    setSuggestions((current) => {
      const updated = Array.from(new Set([...current, trimmed])).sort();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save rescue suggestions", e);
      }
      return updated;
    });
  }

  return { suggestions, addSuggestion };
}

"use client";

import { createContext, useContext, useMemo, useState } from "react";

type FosterFamilySearchContextValue = {
  search: string;
  setSearch: (value: string) => void;
};

const FosterFamilySearchContext = createContext<FosterFamilySearchContextValue | null>(null);

export function FosterFamilySearchProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState("");
  const value = useMemo(() => ({ search, setSearch }), [search]);

  return (
    <FosterFamilySearchContext.Provider value={value}>
      {children}
    </FosterFamilySearchContext.Provider>
  );
}

export function useFosterFamilySearch() {
  const context = useContext(FosterFamilySearchContext);

  if (!context) {
    throw new Error("useFosterFamilySearch must be used within FosterFamilySearchProvider.");
  }

  return context;
}

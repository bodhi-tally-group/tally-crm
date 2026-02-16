"use client";

import React from "react";
import { getCaseById } from "@/lib/mock-data/cases";

const STORAGE_KEY = "tally-crm-related-cases-overrides";

export type CaseLinksOverrides = Record<string, string[]>;

function loadOverrides(): CaseLinksOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CaseLinksOverrides;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function saveOverrides(overrides: CaseLinksOverrides) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // ignore
  }
}

const CaseLinksOverridesContext = React.createContext<{
  getRelatedCases: (caseId: string) => string[];
  addLink: (caseId: string, caseNumber: string) => void;
  removeLink: (caseId: string, caseNumber: string) => void;
} | null>(null);

export function CaseLinksOverridesProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = React.useState<CaseLinksOverrides>({});

  React.useEffect(() => {
    setOverrides(loadOverrides());
  }, []);

  React.useEffect(() => {
    if (Object.keys(overrides).length > 0) saveOverrides(overrides);
  }, [overrides]);

  const getRelatedCases = React.useCallback(
    (caseId: string): string[] => {
      if (overrides[caseId] !== undefined) return overrides[caseId];
      const c = getCaseById(caseId);
      return c?.relatedCases ?? [];
    },
    [overrides]
  );

  const addLink = React.useCallback((caseId: string, caseNumber: string) => {
    const base = getCaseById(caseId)?.relatedCases ?? [];
    setOverrides((prev) => {
      const current = prev[caseId] ?? base;
      if (current.includes(caseNumber)) return prev;
      return { ...prev, [caseId]: [...current, caseNumber] };
    });
  }, []);

  const removeLink = React.useCallback((caseId: string, caseNumber: string) => {
    setOverrides((prev) => {
      const base = getCaseById(caseId)?.relatedCases ?? [];
      const current = prev[caseId] ?? base;
      const next = current.filter((n) => n !== caseNumber);
      if (next.length === 0 && prev[caseId] === undefined) return prev;
      if (next.length === 0) {
        const { [caseId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [caseId]: next };
    });
  }, []);

  const value = React.useMemo(
    () => ({ getRelatedCases, addLink, removeLink }),
    [getRelatedCases, addLink, removeLink]
  );

  return (
    <CaseLinksOverridesContext.Provider value={value}>
      {children}
    </CaseLinksOverridesContext.Provider>
  );
}

export function useCaseLinksOverrides() {
  const ctx = React.useContext(CaseLinksOverridesContext);
  if (!ctx) {
    return {
      getRelatedCases: (caseId: string) => getCaseById(caseId)?.relatedCases ?? [],
      addLink: () => {},
      removeLink: () => {},
    };
  }
  return ctx;
}

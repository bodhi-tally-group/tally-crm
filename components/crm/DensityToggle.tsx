"use client";

import React from "react";
import { Icon } from "@/components/ui/icon";
import { type DensityMode, useDensityPreference } from "@/lib/density";

const densityOptions: { value: DensityMode | "auto"; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "compact", label: "Compact" },
  { value: "normal", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
];

export default function DensityToggle() {
  const { density, setDensity, resetToAuto, isAutoDetect } =
    useDensityPreference();

  const activeValue: DensityMode | "auto" = isAutoDetect ? "auto" : density;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as DensityMode | "auto";
    if (value === "auto") {
      resetToAuto();
    } else {
      setDensity(value);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <Icon
        name="density_medium"
        size={16}
        className="pointer-events-none absolute left-2 text-gray-500 dark:text-gray-400"
      />
      <select
        value={activeValue}
        onChange={handleChange}
        aria-label="Density"
        className="h-8 appearance-none rounded-md border border-border bg-white py-1 pl-7 pr-7 text-xs font-medium text-gray-700 transition-colors focus:border-[#2C365D] focus:outline-none focus:ring-1 focus:ring-[#2C365D] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
      >
        {densityOptions.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <Icon
        name="expand_more"
        size={16}
        className="pointer-events-none absolute right-1 text-gray-400 dark:text-gray-500"
      />
    </div>
  );
}

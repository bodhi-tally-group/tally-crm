"use client";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { type DensityMode, useDensityPreference } from "@/lib/density";

type DensityOption = {
  value: DensityMode | "auto";
  icon: string;
  label: string;
};

const options: DensityOption[] = [
  { value: "auto", icon: "aspect_ratio", label: "Auto-detect" },
  { value: "comfortable", icon: "desktop_windows", label: "Comfortable" },
  { value: "normal", icon: "monitor", label: "Normal" },
  { value: "compact", icon: "laptop", label: "Compact" },
];

export default function DensityModeSwitch() {
  const { density, setDensity, resetToAuto, isAutoDetect } =
    useDensityPreference();

  const activeValue: DensityMode | "auto" = isAutoDetect ? "auto" : density;

  const handleSelect = (value: DensityMode | "auto") => {
    if (value === "auto") {
      resetToAuto();
    } else {
      setDensity(value);
    }
  };

  return (
    <div
      className="inline-flex items-center rounded-full border border-gray-200/80 bg-gray-50/90 p-1 dark:border-gray-600/60 dark:bg-gray-800/50"
      role="group"
      aria-label="Density mode"
    >
      {options.map(({ value, icon, label }) => {
        const isSelected = activeValue === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => handleSelect(value)}
            aria-pressed={isSelected}
            aria-label={label}
            title={label}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2C365D] focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",
              isSelected
                ? "bg-gray-200/80 text-gray-700 dark:bg-gray-600/60 dark:text-gray-200"
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-700/50 dark:hover:text-gray-300"
            )}
          >
            <Icon
              name={icon}
              size={16}
              className={cn(isSelected && "opacity-100")}
            />
          </button>
        );
      })}
    </div>
  );
}

import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "success"
    | "warning"
    | "error"
    | "info";
  size?: "sm" | "md" | "lg" | "icon";
  fullWidth?: boolean;
}

/**
 * Density-aware size presets.
 * Padding, font-size, and border-radius adapt via CSS custom properties
 * so buttons scale automatically with the density system.
 */
const densitySizeStyles: Record<
  NonNullable<ButtonProps["size"]>,
  React.CSSProperties
> = {
  sm: {
    padding: "var(--tally-spacing-xs) var(--tally-spacing-md)",
    fontSize: "var(--tally-font-size-xs)",
    borderRadius: "var(--tally-radius-sm)",
  },
  md: {
    padding: "var(--tally-spacing-sm) var(--tally-spacing-lg)",
    fontSize: "var(--tally-font-size-sm)",
    borderRadius: "var(--tally-radius-md)",
  },
  lg: {
    padding: "var(--tally-spacing-md) var(--tally-spacing-xl)",
    fontSize: "var(--tally-font-size-base)",
    borderRadius: "var(--tally-radius-md)",
  },
  icon: {
    padding: "var(--tally-spacing-sm)",
    fontSize: "var(--tally-font-size-sm)",
    borderRadius: "var(--tally-radius-sm)",
    width: "var(--tally-icon-size-xl)",
    height: "var(--tally-icon-size-xl)",
  },
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled,
  style,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed box-border";

  const variantStyles = {
    primary:
      "border-2 border-transparent bg-[#2C365D] text-white hover:bg-[#1e2840] focus:ring-[#2C365D] dark:bg-[#7c8cb8] dark:hover:bg-[#6b7ba8] dark:focus:ring-[#7c8cb8]",
    secondary:
      "border-2 border-transparent bg-[#00D2A2] text-white hover:bg-[#00b890] focus:ring-[#00D2A2] dark:bg-[#00D2A2] dark:hover:bg-[#00b890] dark:focus:ring-[#00D2A2]",
    outline:
      "border-2 border-[#2C365D] text-[#2C365D] bg-transparent hover:bg-[#2C365D] hover:text-white focus:ring-[#2C365D] dark:border-[#9ca8d0] dark:text-gray-100 dark:hover:bg-[#7c8cb8] dark:hover:text-white dark:focus:ring-[#7c8cb8]",
    ghost:
      "border-2 border-transparent text-[#2C365D] bg-transparent hover:bg-[#2C365D]/10 focus:ring-[#2C365D] dark:text-gray-200 dark:hover:bg-white/10 dark:focus:ring-[#7c8cb8]",
    success:
      "border-2 border-transparent bg-[#008000] text-white hover:bg-[#006600] focus:ring-[#008000]",
    warning:
      "border-2 border-transparent bg-[#C53B00] text-white hover:bg-[#a03000] focus:ring-[#C53B00]",
    error:
      "border-2 border-transparent bg-[#C40000] text-white hover:bg-[#a00000] focus:ring-[#C40000]",
    info:
      "border-2 border-transparent bg-[#0074C4] text-white hover:bg-[#005a9a] focus:ring-[#0074C4]",
  };

  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
      style={{ ...densitySizeStyles[size], ...style }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

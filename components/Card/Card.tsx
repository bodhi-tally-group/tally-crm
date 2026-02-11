import React from "react";
import { cn } from "@/lib/utils";
import { type DensityMode, getDensityCSS } from "@/lib/density-tokens";

// ── Props ──────────────────────────────────────────────────────────────────

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Override the auto-detected density.
   * When omitted the Card adapts automatically via CSS custom properties
   * that respond to viewport-width media queries (see `app/density.css`).
   */
  density?: DensityMode;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  density?: DensityMode;
}

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  density?: DensityMode;
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  density?: DensityMode;
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Merge optional density CSS variable overrides with an existing style prop. */
function densityStyle(
  density: DensityMode | undefined,
  style: React.CSSProperties | undefined,
): React.CSSProperties | undefined {
  if (!density) return style;
  const vars = getDensityCSS(density) as unknown as React.CSSProperties;
  return style ? { ...vars, ...style } : vars;
}

// ── Components ─────────────────────────────────────────────────────────────

/**
 * Card — viewport-adaptive container.
 *
 * Spacing and radii automatically scale with the density system
 * (comfortable / normal / compact) via CSS custom properties.
 *
 * Pass `density` to lock a specific mode; omit to auto-detect.
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, density, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-density-lg border border-border bg-white text-density-base text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100",
          className
        )}
        style={densityStyle(density, style)}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, density, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-density-sm p-density-xl", className)}
        style={densityStyle(density, style)}
        {...props}
      />
    );
  }
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          "text-density-xxl font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100",
          className
        )}
        {...props}
      />
    );
  }
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-density-sm text-gray-600 dark:text-gray-400", className)}
      {...props}
    />
  );
});
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, density, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-density-xl pt-0 text-density-base", className)}
        style={densityStyle(density, style)}
        {...props}
      />
    );
  }
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, density, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center p-density-xl pt-0", className)}
        style={densityStyle(density, style)}
        {...props}
      />
    );
  }
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

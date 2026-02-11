import * as React from "react";
import { cn } from "@/lib/utils";
import { type DensityMode, getDensityCSS } from "@/lib/density-tokens";

/** Merge optional density CSS variable overrides with an existing style prop. */
function densityStyle(
  density: DensityMode | undefined,
  style: React.CSSProperties | undefined,
): React.CSSProperties | undefined {
  if (!density) return style;
  const vars = getDensityCSS(density) as unknown as React.CSSProperties;
  return style ? { ...vars, ...style } : vars;
}

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { density?: DensityMode }
>(({ className, density, style, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card"
    className={cn("rounded-lg border border-border bg-card text-card-foreground", className)}
    style={densityStyle(density, style)}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { density?: DensityMode }
>(({ className, density, style, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-header"
    className={cn("flex flex-col space-y-density-sm p-density-xl", className)}
    style={densityStyle(density, style)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    data-slot="card-title"
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="card-description"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { density?: DensityMode }
>(({ className, density, style, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-content"
    className={cn("p-density-xl pt-0", className)}
    style={densityStyle(density, style)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { density?: DensityMode }
>(({ className, density, style, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-footer"
    className={cn("flex items-center p-density-xl pt-0", className)}
    style={densityStyle(density, style)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

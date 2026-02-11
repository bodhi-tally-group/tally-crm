"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TypographyProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface TypographyParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export interface TypographyBlockquoteProps extends React.HTMLAttributes<HTMLQuoteElement> {}
export interface TypographyListProps extends React.HTMLAttributes<HTMLUListElement> {}
export interface TypographyCodeProps extends React.HTMLAttributes<HTMLElement> {}

/** H1 – Page title. Density-aware: 4xl (36/30/24px) */
const H1 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, style, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn(
        "scroll-m-20 font-extrabold tracking-tight text-gray-900",
        className
      )}
      style={{ fontSize: "var(--tally-font-size-4xl)", lineHeight: "var(--tally-line-height-tight)", ...style }}
      {...props}
    />
  )
);
H1.displayName = "H1";

/** H2 – Section heading. Density-aware: 3xl (30/24/20px) */
const H2 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, style, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        "scroll-m-20 border-b border-border pb-2 font-semibold tracking-tight text-gray-900 first:mt-0",
        className
      )}
      style={{ fontSize: "var(--tally-font-size-3xl)", lineHeight: "var(--tally-line-height-tight)", ...style }}
      {...props}
    />
  )
);
H2.displayName = "H2";

/** H3 – Subsection heading. Density-aware: xxl (24/20/18px) */
const H3 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, style, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "scroll-m-20 font-semibold tracking-tight text-gray-900",
        className
      )}
      style={{ fontSize: "var(--tally-font-size-xxl)", lineHeight: "var(--tally-line-height-tight)", ...style }}
      {...props}
    />
  )
);
H3.displayName = "H3";

/** H4 – Minor heading. Density-aware: xl (20/18/16px) */
const H4 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, style, ...props }, ref) => (
    <h4
      ref={ref}
      className={cn(
        "scroll-m-20 font-semibold tracking-tight text-gray-900",
        className
      )}
      style={{ fontSize: "var(--tally-font-size-xl)", lineHeight: "var(--tally-line-height-tight)", ...style }}
      {...props}
    />
  )
);
H4.displayName = "H4";

/** P – Body paragraph. Density-aware: base (16/14/13px) */
const P = React.forwardRef<HTMLParagraphElement, TypographyParagraphProps>(
  ({ className, style, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-gray-900 [&:not(:first-child)]:mt-6", className)}
      style={{ fontSize: "var(--tally-font-size-base)", lineHeight: "var(--tally-line-height-relaxed)", ...style }}
      {...props}
    />
  )
);
P.displayName = "P";

/** Blockquote – Quoted text. Border left, italic, padding */
const Blockquote = React.forwardRef<HTMLQuoteElement, TypographyBlockquoteProps>(
  ({ className, style, ...props }, ref) => (
    <blockquote
      ref={ref}
      className={cn("mt-6 border-l-2 border-border pl-6 italic text-gray-700", className)}
      style={{ fontSize: "var(--tally-font-size-base)", lineHeight: "var(--tally-line-height-relaxed)", ...style }}
      {...props}
    />
  )
);
Blockquote.displayName = "Blockquote";

/** Ul – Unordered list. list-disc, margin */
const Ul = React.forwardRef<HTMLUListElement, TypographyListProps>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
      {...props}
    />
  )
);
Ul.displayName = "Ul";

/** Ol – Ordered list */
const Ol = React.forwardRef<HTMLOListElement, TypographyListProps>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn("my-6 ml-6 list-decimal [&>li]:mt-2", className)}
      {...props}
    />
  )
);
Ol.displayName = "Ol";

/** InlineCode – Inline code. bg-muted, font-mono, rounded */
const InlineCode = React.forwardRef<HTMLElement, TypographyCodeProps>(
  ({ className, style, ...props }, ref) => (
    <code
      ref={ref as React.Ref<HTMLElement>}
      className={cn(
        "relative rounded bg-gray-100 px-[0.3rem] py-[0.2rem] font-mono font-semibold text-gray-900",
        className
      )}
      style={{ fontSize: "var(--tally-font-size-sm)", ...style }}
      {...props}
    />
  )
);
InlineCode.displayName = "InlineCode";

/** Lead – Introductory or muted large text. Density-aware: xl */
const Lead = React.forwardRef<HTMLParagraphElement, TypographyParagraphProps>(
  ({ className, style, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-muted-foreground", className)}
      style={{ fontSize: "var(--tally-font-size-xl)", lineHeight: "var(--tally-line-height-normal)", ...style }}
      {...props}
    />
  )
);
Lead.displayName = "Lead";

/** Large – Emphasized text. Density-aware: lg */
const Large = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("font-semibold text-gray-900", className)}
      style={{ fontSize: "var(--tally-font-size-lg)", lineHeight: "var(--tally-line-height-normal)", ...style }}
      {...props}
    />
  )
);
Large.displayName = "Large";

/** Small – Small label or caption. Density-aware: sm */
const Small = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, style, ...props }, ref) => (
    <small
      ref={ref as React.Ref<HTMLElement>}
      className={cn("font-medium leading-none text-gray-700", className)}
      style={{ fontSize: "var(--tally-font-size-sm)", ...style }}
      {...props}
    />
  )
);
Small.displayName = "Small";

/** Muted – Secondary or helper text. Density-aware: sm */
const Muted = React.forwardRef<HTMLParagraphElement, TypographyParagraphProps>(
  ({ className, style, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-muted-foreground", className)}
      style={{ fontSize: "var(--tally-font-size-sm)", lineHeight: "var(--tally-line-height-normal)", ...style }}
      {...props}
    />
  )
);
Muted.displayName = "Muted";

export { H1, H2, H3, H4, P, Blockquote, Ul, Ol, InlineCode, Lead, Large, Small, Muted };

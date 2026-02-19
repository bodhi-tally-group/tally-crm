"use client";

import React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export interface PopoverTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export interface PopoverContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  /** When true (default), render content in a portal so it is not clipped by modal/overflow. */
  portal?: boolean;
}

const PopoverContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}>({ open: false, setOpen: () => {}, triggerRef: { current: null } });

const Popover = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: PopoverProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [controlledOpen, onOpenChange]
  );

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
};

const setRef = (
  ref: React.Ref<HTMLButtonElement> | undefined,
  el: HTMLButtonElement | null
) => {
  if (typeof ref === "function") ref(el);
  else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el;
};

const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(({ className, asChild, children, ...props }, ref) => {
  const { open, setOpen, triggerRef } = React.useContext(PopoverContext);

  const mergeRef = React.useCallback(
    (el: HTMLButtonElement | null) => {
      (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = el;
      setRef(ref, el);
    },
    [ref, triggerRef]
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ref: mergeRef,
      onClick: () => setOpen(!open),
      "aria-expanded": open,
    } as React.Attributes & { onClick: () => void; "aria-expanded": boolean });
  }

  return (
    <button
      ref={mergeRef}
      type="button"
      className={className}
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      {...props}
    >
      {children}
    </button>
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps
>(({ className, align = "center", portal = true, children, ...props }, ref) => {
  const { open, setOpen, triggerRef } = React.useContext(PopoverContext);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState<{ top: number; left: number; transform?: string } | null>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('[aria-expanded="true"]')
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  React.useLayoutEffect(() => {
    if (!open || !portal) {
      setPosition(null);
      return;
    }
    const trigger = (triggerRef as React.RefObject<HTMLButtonElement | null>).current;
    if (!trigger) {
      setPosition(null);
      return;
    }
    const rect = trigger.getBoundingClientRect();
    const gap = 8;
    const top = rect.bottom + gap;
    let left = rect.left;
    let transform: string | undefined;
    if (align === "center") {
      left = rect.left + rect.width / 2;
      transform = "translateX(-50%)";
    } else if (align === "end") {
      left = rect.right;
      transform = "translateX(-100%)";
    }
    setPosition({ top, left, transform });
  }, [open, portal, align, triggerRef]);

  if (!open) return null;
  if (portal && position === null) return null;

  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  };

  const content = (
    <div
      ref={(el) => {
        (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      className={cn(
        "z-[100] w-72 rounded-md border border-border bg-white p-4 shadow-md outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100",
        !portal && "absolute mt-2",
        !portal && alignClasses[align],
        portal && "fixed",
        className
      )}
      style={
        portal && position
          ? {
              top: position.top,
              left: position.left,
              transform: position.transform,
            }
          : undefined
      }
      {...props}
    >
      {children}
    </div>
  );

  if (portal && typeof document !== "undefined") {
    return createPortal(content, document.body);
  }

  return content;
});
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };


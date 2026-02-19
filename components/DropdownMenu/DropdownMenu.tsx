"use client";

import React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface DropdownMenuProps {
  children: React.ReactNode;
}

export interface DropdownMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export interface DropdownMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
}

export interface DropdownMenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive";
}

export type DropdownMenuLabelProps = React.HTMLAttributes<HTMLDivElement>;

export type DropdownMenuSeparatorProps = React.HTMLAttributes<HTMLHRElement>;

const DropdownMenuContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  setTriggerRef: (el: HTMLButtonElement | null) => void;
  setContentRef: (el: HTMLDivElement | null) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}>({
  open: false,
  setOpen: () => {},
  setTriggerRef: () => {},
  setContentRef: () => {},
  triggerRef: { current: null },
  contentRef: { current: null },
});

const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const setTriggerRef = React.useCallback((el: HTMLButtonElement | null) => {
    triggerRef.current = el;
  }, []);
  const setContentRef = React.useCallback((el: HTMLDivElement | null) => {
    contentRef.current = el;
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideTrigger = menuRef.current?.contains(target);
      const insideContent = contentRef.current?.contains(target);
      if (open && !insideTrigger && !insideContent) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <DropdownMenuContext.Provider
      value={{ open, setOpen, setTriggerRef, setContentRef, triggerRef, contentRef }}
    >
      <div ref={menuRef} className="relative inline-block">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ className, asChild, children, ...props }, ref) => {
  const { open, setOpen, setTriggerRef } = React.useContext(DropdownMenuContext);
  const refRef = React.useRef(ref);
  React.useEffect(() => {
    refRef.current = ref;
  }, [ref]);
  const setRefs = React.useCallback(
    (el: HTMLButtonElement | null) => {
      setTriggerRef(el);
      const r = refRef.current;
      if (typeof r === "function") r(el);
      else if (r) r.current = el;
    },
    [setTriggerRef]
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<Record<string, unknown>>,
      // ref is forwarded via setRefs and only read when the child mounts
      /* eslint-disable-next-line react-hooks/refs -- callback ref does not read ref during render */
      {
        ref: setRefs,
        onClick: () => setOpen(!open),
        "aria-expanded": open,
      } as React.Attributes & { onClick: () => void; "aria-expanded": boolean }
    );
  }

  return (
    <button
      ref={setRefs}
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
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const GAP_PX = 8;

function useDropdownPosition(
  open: boolean,
  triggerRef: React.RefObject<HTMLButtonElement | null>,
  contentRef: React.RefObject<HTMLDivElement | null>,
  align: "start" | "center" | "end"
) {
  const [position, setPosition] = React.useState({
    top: 0,
    left: 0,
    transform: "",
    ready: false,
  });

  const updatePosition = React.useCallback(() => {
    const trigger = triggerRef.current;
    const content = contentRef.current;
    if (!trigger || !content) return;
    const rect = trigger.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    let left = rect.left;
    const transform = "";
    if (align === "end") {
      left = rect.right - contentRect.width;
    } else if (align === "center") {
      left = rect.left + rect.width / 2 - contentRect.width / 2;
    }
    setPosition({
      top: rect.bottom + GAP_PX,
      left,
      transform,
      ready: true,
    });
  }, [triggerRef, contentRef, align]);

  React.useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  React.useEffect(() => {
    if (!open) setPosition((p) => ({ ...p, ready: false }));
  }, [open]);

  return position;
}

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ className, align = "start", children, ...props }, ref) => {
  const { open, setContentRef, triggerRef, contentRef } = React.useContext(DropdownMenuContext);
  const position = useDropdownPosition(open, triggerRef, contentRef, align);
  const setRefs = React.useCallback(
    (el: HTMLDivElement | null) => {
      setContentRef(el);
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    },
    [setContentRef, ref]
  );

  if (!open) return null;

  const content = (
    <div
      ref={setRefs}
      className={cn(
        "fixed z-[100] min-w-[8rem] overflow-hidden rounded-md border border-border bg-white p-1 text-gray-900 shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100",
        className
      )}
      style={{
        top: position.top,
        left: position.left,
        transform: position.transform,
        opacity: position.ready ? 1 : 0,
        pointerEvents: position.ready ? undefined : "none",
      }}
      {...props}
    >
      {children}
    </div>
  );

  if (typeof document === "undefined") return content;
  return createPortal(content, document.body);
});
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuItemProps
>(({ className, variant = "default", onClick, ...props }, ref) => {
  const { setOpen } = React.useContext(DropdownMenuContext);
  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      setOpen(false);
    },
    [onClick, setOpen]
  );
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "relative flex w-full cursor-default select-none items-center justify-start rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus:bg-gray-700 dark:focus:text-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        variant === "destructive" &&
          "text-[#C40000] hover:bg-red-50 focus:bg-red-50 focus:text-[#C40000] dark:hover:bg-red-950/30 dark:focus:bg-red-950/30",
        className
      )}
      onClick={handleClick}
      {...props}
    />
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  DropdownMenuLabelProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("px-2 py-1.5 text-sm font-semibold", className)}
      {...props}
    />
  );
});
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef<
  HTMLHRElement,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <hr
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
});
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};


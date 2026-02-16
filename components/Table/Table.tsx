"use client";

import {
  createContext,
  useContext,
  forwardRef,
  type TableHTMLAttributes,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

const TableContext = createContext<{ dense?: boolean }>({});

export interface TableProps
  extends TableHTMLAttributes<HTMLTableElement> {
  disableWrapper?: boolean;
  /** When true, reduces row padding to match compact tables (e.g. Cases list) */
  dense?: boolean;
}

export interface TableHeaderProps
  extends HTMLAttributes<HTMLTableSectionElement> {}

export interface TableBodyProps
  extends HTMLAttributes<HTMLTableSectionElement> {}

export interface TableFooterProps
  extends HTMLAttributes<HTMLTableSectionElement> {}

export interface TableRowProps
  extends HTMLAttributes<HTMLTableRowElement> {}

export interface TableHeadProps
  extends ThHTMLAttributes<HTMLTableCellElement> {}

export interface TableCellProps
  extends TdHTMLAttributes<HTMLTableCellElement> {}

export interface TableCaptionProps
  extends HTMLAttributes<HTMLTableCaptionElement> {}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, disableWrapper, dense, ...props }, ref) => {
    const table = (
      <TableContext.Provider value={{ dense }}>
        <table
          ref={ref}
          className={cn("w-full caption-bottom text-sm", className)}
          {...props}
        />
      </TableContext.Provider>
    );
    if (disableWrapper) {
      return table;
    }
    return (
      <div className="relative w-full overflow-auto">
        {table}
      </div>
    );
  }
);
Table.displayName = "Table";

const TableHeader = forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(({ className, ...props }, ref) => {
  return (
    <thead
      ref={ref}
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
});
TableHeader.displayName = "TableHeader";

const TableBody = forwardRef<
  HTMLTableSectionElement,
  TableBodyProps
>(({ className, ...props }, ref) => {
  return (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
});
TableBody.displayName = "TableBody";

const TableFooter = forwardRef<
  HTMLTableSectionElement,
  TableFooterProps
>(({ className, ...props }, ref) => {
  return (
    <tfoot
      ref={ref}
      className={cn(
        "border-t bg-gray-50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
});
TableFooter.displayName = "TableFooter";

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          "border-b border-gray-200 transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-50 dark:border-gray-700/60 dark:hover:bg-gray-700/50 dark:data-[state=selected]:bg-gray-700/50",
          className
        )}
        {...props}
      />
    );
  }
);
TableRow.displayName = "TableRow";

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, style, ...props }, ref) => {
    const { dense } = useContext(TableContext);
    const headerPadding = dense ? "var(--tally-spacing-md)" : "var(--tally-spacing-lg)";
    return (
      <th
        ref={ref}
        className={cn(
          "px-density-md text-left align-middle font-medium text-gray-900 dark:text-gray-100 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          className
        )}
        style={{
          paddingTop: headerPadding,
          paddingBottom: headerPadding,
          fontSize: "var(--tally-font-size-sm)",
          ...style,
        }}
        {...props}
      />
    );
  }
);
TableHead.displayName = "TableHead";

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, style, ...props }, ref) => {
    const { dense } = useContext(TableContext);
    const padding = dense ? "var(--tally-spacing-sm)" : "var(--tally-spacing-md)";
    return (
      <td
        ref={ref}
        className={cn(
          "px-density-md align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          className
        )}
        style={{
          paddingTop: padding,
          paddingBottom: padding,
          fontSize: "var(--tally-font-size-sm)",
          ...style,
        }}
        {...props}
      />
    );
  }
);
TableCell.displayName = "TableCell";

const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, ...props }, ref) => {
  return (
    <caption
      ref={ref}
      className={cn("mt-4 text-sm text-gray-600", className)}
      {...props}
    />
  );
});
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};


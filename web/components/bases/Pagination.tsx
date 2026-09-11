import type { ComponentProps } from "react";
import NextLink from "next/link";

import { cva } from "class-variance-authority";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const paginationLinkVariants = cva(
  "inline-flex size-9.5 shrink-0 items-center justify-center rounded-lg border wongnok-text-sm font-semibold transition-colors outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-disabled:pointer-events-none aria-disabled:text-muted-foreground/40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      isActive: {
        true: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        false:
          "border-border bg-card text-secondary-foreground hover:bg-muted hover:text-foreground",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
);

export type PaginationProps = ComponentProps<"nav">;

function Pagination({ className, ...props }: PaginationProps) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

export type PaginationContentProps = ComponentProps<"ul">;

function PaginationContent({ className, ...props }: PaginationContentProps) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      {...props}
    />
  );
}

export type PaginationItemProps = ComponentProps<"li">;

function PaginationItem(props: PaginationItemProps) {
  return <li data-slot="pagination-item" {...props} />;
}

export type PaginationLinkProps = ComponentProps<typeof NextLink> & {
  isActive?: boolean;
};

function PaginationLink({
  className,
  isActive = false,
  tabIndex,
  ...props
}: PaginationLinkProps) {
  const disabled =
    props["aria-disabled"] === true || props["aria-disabled"] === "true";

  return (
    <NextLink
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      tabIndex={disabled ? -1 : tabIndex}
      className={cn(paginationLinkVariants({ isActive, className }))}
      {...props}
    />
  );
}

export type PaginationPreviousProps = PaginationLinkProps & {
  text?: string;
};

function PaginationPrevious({
  text = "Previous",
  ...props
}: PaginationPreviousProps) {
  return (
    <PaginationLink aria-label="Go to previous page" {...props}>
      <ChevronLeftIcon />
      <span className="sr-only">{text}</span>
    </PaginationLink>
  );
}

export type PaginationNextProps = PaginationLinkProps & {
  text?: string;
};

function PaginationNext({ text = "Next", ...props }: PaginationNextProps) {
  return (
    <PaginationLink aria-label="Go to next page" {...props}>
      <span className="sr-only">{text}</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

export type PaginationEllipsisProps = ComponentProps<"span">;

function PaginationEllipsis({ className, ...props }: PaginationEllipsisProps) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-9.5 items-center justify-center text-muted-foreground/60 [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export default Pagination;
export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  paginationLinkVariants,
};

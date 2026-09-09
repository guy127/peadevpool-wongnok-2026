import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-full border whitespace-nowrap",
  {
    variants: {
      variant: {
        contained: "border-transparent",
        outlined: "bg-transparent",
      },
      color: {
        primary: "",
        accent: "",
        success: "",
        error: "",
        gray: "",
      },
      size: {
        medium: "h-5 px-2 wongnok-text-label",
        large: "h-6 px-2.5 wongnok-text-sm font-bold",
      },
    },
    defaultVariants: {
      variant: "contained",
      color: "primary",
      size: "medium",
    },
    compoundVariants: [
      {
        variant: "contained",
        color: "primary",
        className: "bg-primary text-primary-foreground",
      },
      {
        variant: "contained",
        color: "accent",
        className: "bg-accent text-accent-foreground",
      },
      {
        variant: "contained",
        color: "success",
        className: "bg-success text-primary-foreground",
      },
      {
        variant: "contained",
        color: "error",
        className: "bg-destructive text-primary-foreground",
      },
      {
        variant: "contained",
        color: "gray",
        className: "bg-muted-foreground text-primary-foreground",
      },
      {
        variant: "outlined",
        color: "primary",
        className: "border-primary text-primary",
      },
      {
        variant: "outlined",
        color: "accent",
        className: "border-accent text-accent",
      },
      {
        variant: "outlined",
        color: "success",
        className: "border-success text-success",
      },
      {
        variant: "outlined",
        color: "error",
        className: "border-destructive text-destructive",
      },
      {
        variant: "outlined",
        color: "gray",
        className: "border-muted-foreground text-muted-foreground",
      },
    ],
  },
);

export type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>;

function Badge({
  className,
  variant = "contained",
  color = "primary",
  size = "medium",
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, color, size, className }))}
      {...props}
    />
  );
}

export default Badge;
export { Badge, badgeVariants };

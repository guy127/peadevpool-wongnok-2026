import type { ReactNode } from "react";

import { Field } from "@base-ui/react/field";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * A button that opens a popover list — never a native `<select>` — so options
 * can carry their own colour dot and a check on the selected row. Heights and
 * focus ring match `TextField` so the two sit on the same form row.
 */
const selectTriggerVariants = cva(
  "flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-input bg-card text-foreground transition-[border-color,box-shadow] duration-150 outline-none select-none data-disabled:cursor-not-allowed data-disabled:bg-background data-disabled:text-muted-foreground",
  {
    variants: {
      size: {
        medium: "h-10 px-3 wongnok-text-sm",
        large: "h-11.5 px-3.5 wongnok-text-body",
      },
      error: {
        true: "border-destructive ring-3 ring-destructive/10 data-popup-open:border-destructive data-popup-open:ring-destructive/10",
        false:
          "data-popup-open:border-primary data-popup-open:ring-3 data-popup-open:ring-primary/12",
      },
    },
    defaultVariants: {
      size: "medium",
      error: false,
    },
  },
);

export type SelectOption<Value = string> = {
  label: ReactNode;
  value: Value;
  disabled?: boolean;
  /** Leading glyph shown in the popup only, e.g. a difficulty colour dot. */
  icon?: ReactNode;
};

export type SelectProps<Value = string> = Omit<
  SelectPrimitive.Root.Props<Value>,
  "items" | "children" | "multiple"
> &
  VariantProps<typeof selectTriggerVariants> & {
    options: SelectOption<Value>[];
    label?: ReactNode;
    helperText?: ReactNode;
    errorMessage?: ReactNode;
    placeholder?: ReactNode;
    emptyText?: ReactNode;
    className?: string;
    triggerClassName?: string;
    popupClassName?: string;
  };

function Select<Value = string>({
  options,
  className,
  triggerClassName,
  popupClassName,
  size = "medium",
  error = false,
  label,
  helperText,
  errorMessage,
  placeholder = "Select an option",
  emptyText = "No options",
  disabled,
  ...props
}: SelectProps<Value>) {
  const invalid = Boolean(error) || Boolean(errorMessage);

  return (
    <Field.Root
      data-slot="select-field"
      className={cn("flex w-full flex-col gap-1.75", className)}
      invalid={invalid}
      disabled={disabled}
    >
      {label ? (
        <Field.Label
          data-slot="select-label"
          nativeLabel={false}
          render={<div />}
          className="wongnok-text-sm font-semibold text-secondary-foreground data-disabled:text-muted-foreground"
        >
          {label}
        </Field.Label>
      ) : null}

      <SelectPrimitive.Root items={options} disabled={disabled} {...props}>
        <SelectPrimitive.Trigger
          data-slot="select-trigger"
          className={cn(
            selectTriggerVariants({ size, error: invalid }),
            triggerClassName,
          )}
        >
          <SelectPrimitive.Value
            data-slot="select-value"
            className="truncate text-left data-placeholder:text-muted-foreground"
            placeholder={placeholder}
          />
          <SelectPrimitive.Icon
            data-slot="select-icon"
            className="flex shrink-0 items-center text-muted-foreground"
          >
            <ChevronDown className="size-4" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Positioner
            side="bottom"
            align="start"
            sideOffset={8}
            alignItemWithTrigger={false}
            className="z-50 outline-none"
          >
            <SelectPrimitive.Popup
              data-slot="select-popup"
              className={cn(
                "min-w-[var(--anchor-width)] origin-[var(--transform-origin)] rounded-xl border border-border bg-card p-1.5 shadow-[0_16px_38px_rgba(24,24,27,0.14)] outline-none transition-[transform,opacity] duration-150 ease-out data-starting-style:scale-98 data-starting-style:opacity-0 data-ending-style:scale-98 data-ending-style:opacity-0",
                popupClassName,
              )}
            >
              {options.length === 0 ? (
                <p
                  data-slot="select-empty"
                  className="wongnok-text-sm px-2.5 py-2.25 text-muted-foreground"
                >
                  {emptyText}
                </p>
              ) : (
                <SelectPrimitive.List className="max-h-[var(--available-height)] overflow-y-auto">
                  {options.map((option, index) => (
                    <SelectPrimitive.Item
                      key={index}
                      data-slot="select-item"
                      value={option.value}
                      disabled={option.disabled}
                      className="wongnok-text-sm flex cursor-pointer items-center gap-2.25 rounded-md px-2.5 py-2.25 text-secondary-foreground outline-none select-none data-highlighted:bg-muted data-disabled:pointer-events-none data-disabled:text-muted-foreground/50"
                    >
                      {option.icon ? (
                        <span className="flex shrink-0 items-center [&_svg]:size-4">
                          {option.icon}
                        </span>
                      ) : null}
                      <SelectPrimitive.ItemText className="flex-1 truncate">
                        {option.label}
                      </SelectPrimitive.ItemText>
                      <SelectPrimitive.ItemIndicator
                        data-slot="select-item-indicator"
                        className="flex size-4 shrink-0 items-center justify-center text-primary"
                      >
                        <Check className="size-4" />
                      </SelectPrimitive.ItemIndicator>
                    </SelectPrimitive.Item>
                  ))}
                </SelectPrimitive.List>
              )}
            </SelectPrimitive.Popup>
          </SelectPrimitive.Positioner>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {errorMessage ? (
        <Field.Error
          match
          data-slot="select-error"
          className="wongnok-text-xs font-medium text-destructive-strong"
        >
          {errorMessage}
        </Field.Error>
      ) : helperText ? (
        <Field.Description
          data-slot="select-helper-text"
          className="wongnok-text-xs text-muted-foreground"
        >
          {helperText}
        </Field.Description>
      ) : null}
    </Field.Root>
  );
}

export default Select;
export { Select, selectTriggerVariants };

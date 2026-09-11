import type { ComponentProps, ReactNode } from "react";

import { Field } from "@base-ui/react/field";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * The border and focus ring live on the shell rather than the `<input>` so that
 * adornments sit inside the ring instead of beside it. The input itself is
 * transparent and borderless, and `focus-within` lifts the input's focus state
 * up to the shell.
 */
const textFieldVariants = cva(
  "flex w-full items-center gap-2 rounded-lg border border-input bg-card text-foreground transition-[border-color,box-shadow] duration-150 focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/12 has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-background has-[input:disabled]:text-muted-foreground",
  {
    variants: {
      size: {
        medium: "h-10 px-3 wongnok-text-sm",
        large: "h-11.5 px-3.5 wongnok-text-body",
      },
      error: {
        true: "border-destructive ring-3 ring-destructive/10 focus-within:border-destructive focus-within:ring-destructive/10",
        false: "",
      },
    },
    defaultVariants: {
      size: "medium",
      error: false,
    },
  },
);

const adornmentClassName =
  "flex shrink-0 items-center text-muted-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

export type TextFieldProps = Omit<
  ComponentProps<typeof InputPrimitive>,
  "size" | "className"
> &
  VariantProps<typeof textFieldVariants> & {
    label?: ReactNode;
    helperText?: ReactNode;
    errorMessage?: ReactNode;
    startAdornment?: ReactNode;
    endAdornment?: ReactNode;
    className?: string;
    inputClassName?: string;
  };

function TextField({
  className,
  inputClassName,
  size = "medium",
  error = false,
  label,
  helperText,
  errorMessage,
  startAdornment,
  endAdornment,
  disabled,
  ...props
}: TextFieldProps) {
  const invalid = Boolean(error) || Boolean(errorMessage);

  return (
    <Field.Root
      data-slot="text-field"
      className={cn("flex w-full flex-col gap-1.75", className)}
      invalid={invalid}
      disabled={disabled}
    >
      {label ? (
        <Field.Label
          data-slot="text-field-label"
          className="wongnok-text-sm font-semibold text-secondary-foreground data-disabled:text-muted-foreground"
        >
          {label}
        </Field.Label>
      ) : null}

      <div
        data-slot="text-field-shell"
        className={cn(textFieldVariants({ size, error: invalid }))}
      >
        {startAdornment ? (
          <span
            data-slot="text-field-start-adornment"
            className={adornmentClassName}
          >
            {startAdornment}
          </span>
        ) : null}

        <InputPrimitive
          data-slot="text-field-input"
          disabled={disabled}
          className={cn(
            "w-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
            inputClassName,
          )}
          {...props}
        />

        {endAdornment ? (
          <span
            data-slot="text-field-end-adornment"
            className={adornmentClassName}
          >
            {endAdornment}
          </span>
        ) : null}
      </div>

      {errorMessage ? (
        <Field.Error
          match
          data-slot="text-field-error"
          className="wongnok-text-xs font-medium text-destructive-strong"
        >
          {errorMessage}
        </Field.Error>
      ) : helperText ? (
        <Field.Description
          data-slot="text-field-helper-text"
          className="wongnok-text-xs text-muted-foreground"
        >
          {helperText}
        </Field.Description>
      ) : null}
    </Field.Root>
  );
}

export default TextField;
export { TextField, textFieldVariants };

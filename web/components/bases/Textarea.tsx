import { useId, type ComponentProps, type ReactNode } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "w-full resize-y rounded-lg border border-input bg-card px-3.5 py-3 wongnok-text-body text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:ring-3 disabled:cursor-not-allowed disabled:bg-background disabled:text-muted-foreground",
  {
    variants: {
      error: {
        true: "border-destructive ring-3 ring-destructive/10 focus-visible:border-destructive focus-visible:ring-destructive/10",
        false: "focus-visible:border-primary focus-visible:ring-primary/12",
      },
    },
    defaultVariants: {
      error: false,
    },
  },
);

export type TextareaProps = ComponentProps<"textarea"> &
  VariantProps<typeof textareaVariants> & {
    label?: ReactNode;
    helperText?: ReactNode;
    errorMessage?: ReactNode;
  };

function Textarea({
  className,
  id,
  label,
  helperText,
  errorMessage,
  error = false,
  rows = 3,
  disabled,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const messageId = `${textareaId}-message`;

  const showError = Boolean(error && errorMessage);
  const message = showError ? errorMessage : helperText;

  return (
    <div data-slot="textarea-field" className="flex w-full flex-col gap-1.75">
      {label ? (
        <label
          htmlFor={textareaId}
          className={cn(
            "wongnok-text-sm font-semibold text-secondary-foreground",
            disabled && "text-muted-foreground",
          )}
        >
          {label}
        </label>
      ) : null}
      <textarea
        data-slot="textarea"
        id={textareaId}
        rows={rows}
        disabled={disabled}
        aria-invalid={error || undefined}
        aria-describedby={message ? messageId : undefined}
        className={cn(textareaVariants({ error, className }))}
        {...props}
      />
      {message ? (
        <p
          id={messageId}
          className={cn(
            "wongnok-text-xs",
            showError
              ? "font-medium text-destructive-strong"
              : "text-muted-foreground",
          )}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

export default Textarea;
export { Textarea, textareaVariants };

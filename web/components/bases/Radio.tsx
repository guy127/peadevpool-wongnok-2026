"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

import { Field } from "@base-ui/react/field";
import { Fieldset } from "@base-ui/react/fieldset";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const radioVariants = cva(
  "flex aspect-square shrink-0 items-center justify-center rounded-full border border-input bg-card outline-none transition-[border-color,box-shadow] duration-150 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/12 data-checked:border-primary data-checked:bg-primary data-disabled:cursor-not-allowed data-disabled:bg-muted data-disabled:data-checked:border-muted-foreground/50 data-disabled:data-checked:bg-muted-foreground/50",
  {
    variants: {
      size: {
        small: "size-3.5",
        medium: "size-4",
        large: "size-5",
      },
      error: {
        true: "border-destructive",
        false: "",
      },
    },
    defaultVariants: {
      size: "medium",
      error: false,
    },
  },
);

const radioIndicatorVariants = cva("rounded-full bg-primary-foreground", {
  variants: {
    size: {
      small: "size-1.5",
      medium: "size-1.75",
      large: "size-2.25",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

/**
 * The label wraps the control so the whole row is clickable. The outlined
 * variant reads the control's `data-checked` / focus state through `has-*` so
 * the border and ring follow the radio without extra state.
 */
const radioItemVariants = cva(
  "cursor-pointer items-center font-medium text-foreground has-data-disabled:cursor-not-allowed has-data-disabled:text-muted-foreground",
  {
    variants: {
      variant: {
        default: "inline-flex",
        outlined:
          "flex rounded-lg border border-input bg-card transition-[border-color,box-shadow,background-color] duration-150 has-focus-visible:ring-3 has-focus-visible:ring-primary/12 has-data-checked:border-primary has-data-checked:bg-primary-subtle has-data-disabled:bg-background",
      },
      size: {
        small: "gap-2 wongnok-text-xs",
        medium: "gap-2.5 wongnok-text-sm",
        large: "gap-3 wongnok-text-body",
      },
      error: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "medium",
      error: false,
    },
    compoundVariants: [
      { variant: "outlined", size: "small", className: "px-3 py-2" },
      { variant: "outlined", size: "medium", className: "px-3.5 py-2.5" },
      { variant: "outlined", size: "large", className: "px-4 py-3" },
      {
        variant: "outlined",
        error: true,
        className:
          "border-destructive ring-3 ring-destructive/10 has-data-checked:border-destructive has-focus-visible:ring-destructive/10",
      },
    ],
  },
);

type RadioSize = NonNullable<VariantProps<typeof radioVariants>["size"]>;
type RadioVariant = NonNullable<
  VariantProps<typeof radioItemVariants>["variant"]
>;
type RadioChangeHandler<Value> = (
  value: Value,
  eventDetails: RadioGroupPrimitive.ChangeEventDetails,
) => void;

type RadioGroupContextValue = {
  size: RadioSize;
  variant: RadioVariant;
  invalid: boolean;
  register: (
    value: unknown,
    handler: RadioChangeHandler<unknown>,
  ) => () => void;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export type RadioGroupProps<Value = string> = Omit<
  RadioGroupPrimitive.Props<Value>,
  "onValueChange" | "onChange" | "className"
> & {
  size?: RadioSize;
  variant?: RadioVariant;
  error?: boolean;
  label?: ReactNode;
  helperText?: ReactNode;
  errorMessage?: ReactNode;
  onChange?: RadioChangeHandler<Value>;
  className?: string;
};

function RadioGroup<Value = string>({
  className,
  size = "medium",
  variant = "default",
  error = false,
  label,
  helperText,
  errorMessage,
  disabled,
  onChange,
  children,
  ...props
}: RadioGroupProps<Value>) {
  const invalid = Boolean(error) || Boolean(errorMessage);
  const handlersRef = useRef(new Map<unknown, RadioChangeHandler<unknown>>());

  const register = useCallback<RadioGroupContextValue["register"]>(
    (value, handler) => {
      handlersRef.current.set(value, handler);
      return () => {
        if (handlersRef.current.get(value) === handler) {
          handlersRef.current.delete(value);
        }
      };
    },
    [],
  );

  const contextValue = useMemo<RadioGroupContextValue>(
    () => ({ size, variant, invalid, register }),
    [size, variant, invalid, register],
  );

  const handleValueChange = (
    value: Value,
    eventDetails: RadioGroupPrimitive.ChangeEventDetails,
  ) => {
    onChange?.(value, eventDetails);
    handlersRef.current.get(value)?.(value, eventDetails);
  };

  return (
    <Field.Root
      data-slot="radio-group-field"
      className={cn("flex w-full flex-col gap-1.75", className)}
      invalid={invalid}
      disabled={disabled}
    >
      <Fieldset.Root
        data-slot="radio-group"
        className="flex flex-col gap-1.75"
        render={
          <RadioGroupPrimitive<Value>
            disabled={disabled}
            onValueChange={handleValueChange}
            {...props}
          />
        }
      >
        {label ? (
          <Fieldset.Legend
            data-slot="radio-group-label"
            className="wongnok-text-sm font-semibold text-secondary-foreground data-disabled:text-muted-foreground"
          >
            {label}
          </Fieldset.Legend>
        ) : null}

        <div
          data-slot="radio-group-items"
          className={cn(
            "flex flex-col",
            variant === "outlined" ? "gap-2.5" : "gap-2",
          )}
        >
          <RadioGroupContext.Provider value={contextValue}>
            {children}
          </RadioGroupContext.Provider>
        </div>
      </Fieldset.Root>

      {errorMessage ? (
        <Field.Error
          match
          data-slot="radio-group-error"
          className="wongnok-text-xs font-medium text-destructive-strong"
        >
          {errorMessage}
        </Field.Error>
      ) : helperText ? (
        <Field.Description
          data-slot="radio-group-helper-text"
          className="wongnok-text-xs text-muted-foreground"
        >
          {helperText}
        </Field.Description>
      ) : null}
    </Field.Root>
  );
}

export type RadioProps<Value = string> = Omit<
  RadioPrimitive.Root.Props<Value>,
  "className" | "onChange"
> & {
  size?: RadioSize;
  variant?: RadioVariant;
  label?: ReactNode;
  /** Only used when the radio is rendered outside a `RadioGroup`. */
  checked?: boolean;
  /** Only used when the radio is rendered outside a `RadioGroup`. */
  name?: string;
  /** Fires when this radio becomes selected. */
  onChange?: RadioChangeHandler<Value>;
  className?: string;
};

function Radio<Value = string>({
  className,
  size,
  variant,
  label,
  checked = false,
  name,
  onChange,
  value,
  ...props
}: RadioProps<Value>) {
  const group = useContext(RadioGroupContext);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    if (!group) return;
    return group.register(value, (nextValue, eventDetails) =>
      onChangeRef.current?.(nextValue as Value, eventDetails),
    );
  }, [group, value]);

  const resolvedSize = size ?? group?.size ?? "medium";
  const resolvedVariant = variant ?? group?.variant ?? "default";
  const invalid = group?.invalid ?? false;

  const itemClassName = cn(
    radioItemVariants({
      variant: resolvedVariant,
      size: resolvedSize,
      error: invalid,
    }),
    className,
  );

  const content = (
    <>
      <RadioPrimitive.Root
        data-slot="radio"
        value={value}
        className={radioVariants({ size: resolvedSize, error: invalid })}
        {...props}
      >
        <RadioPrimitive.Indicator
          data-slot="radio-indicator"
          className={radioIndicatorVariants({ size: resolvedSize })}
        />
      </RadioPrimitive.Root>
      {label ? <span data-slot="radio-label">{label}</span> : null}
    </>
  );

  // Inside the group's `Field.Root`, each radio needs its own `Field.Item`,
  // otherwise every radio shares the field's control id.
  if (group) {
    return (
      <Field.Item data-slot="radio-field-item" disabled={props.disabled}>
        <Field.Label data-slot="radio-item" className={itemClassName}>
          {content}
        </Field.Label>
      </Field.Item>
    );
  }

  // Base UI radios only check through a group, so a standalone radio gets its
  // own single-item group driven by `checked`.
  return (
    <RadioGroupPrimitive<Value | null>
      data-slot="radio-standalone"
      className="contents"
      name={name}
      value={checked ? value : null}
      onValueChange={(nextValue, eventDetails) => {
        if (nextValue !== null) onChange?.(nextValue, eventDetails);
      }}
    >
      <label data-slot="radio-item" className={itemClassName}>
        {content}
      </label>
    </RadioGroupPrimitive>
  );
}

export default Radio;
export {
  Radio,
  RadioGroup,
  radioVariants,
  radioItemVariants,
  radioIndicatorVariants,
};

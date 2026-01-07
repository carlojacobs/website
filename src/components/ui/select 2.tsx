// src/components/ui/select.tsx
"use client";
import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";

type SelectProps = {
  items?: Array<{ label: string; value: string }>;
  className?: string;
  value?: string;
  onValueChange?: (value: string | null) => void;
  children: React.ReactNode;
};

export function Select(props: SelectProps) {
  const { items: _items, className, children, ...rest } = props;
  return (
    <BaseSelect.Root {...(rest as object)} className={className}>
      {children}
    </BaseSelect.Root>
  );
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof BaseSelect.Trigger>>(
  function SelectTrigger({ className, ...props }, ref) {
    return (
      <BaseSelect.Trigger
        ref={ref}
        className={`inline-flex items-center gap-2 ${className ?? ""}`}
        {...props}
      />
    );
  },
);

export const SelectValue = BaseSelect.Value;

export const SelectPopup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof BaseSelect.Popup>>(
  function SelectPopup({ className, ...props }, ref) {
    return (
      <BaseSelect.Positioner>
        <BaseSelect.Popup
          ref={ref}
          className={`z-50 mt-2 min-w-[14rem] rounded-none border border-black/10 bg-[#f8f7f4] p-2 text-sm shadow-sm ${className ?? ""}`}
          {...props}
        />
      </BaseSelect.Positioner>
    );
  },
);

export const SelectItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof BaseSelect.Item>>(
  function SelectItem({ className, ...props }, ref) {
    return (
      <BaseSelect.Item
        ref={ref}
        className={`cursor-pointer select-none rounded-none px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-black/5 ${className ?? ""}`}
        {...props}
      />
    );
  },
);

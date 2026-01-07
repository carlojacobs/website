// src/components/issue-select.tsx
"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectItem, SelectPopup, SelectTrigger } from "@/components/ui/select";

type IssueOption = {
  value: string;
  label: string;
};

export function IssueSelect(props: {
  options: IssueOption[];
  value?: string | null;
}) {
  const { options, value } = props;
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const selectedValue = value ?? options[0]?.value ?? "";
  const selectedLabel = options.find((o) => o.value === selectedValue)?.label ?? "Select issue";

  const onValueChange = React.useCallback(
    (next: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next) params.set("issue", next);
      else params.delete("issue");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, searchParams],
  );

  if (!options.length) return null;

  return (
    <Select value={selectedValue} onValueChange={onValueChange} items={options}>
      <SelectTrigger
        aria-label="Select issue"
        className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-65"
      >
        <span>{selectedLabel}</span>
      </SelectTrigger>
      <SelectPopup>
        {options.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}

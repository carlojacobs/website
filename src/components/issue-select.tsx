// src/components/issue-select.tsx
"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IssueMeta } from "@/components/issue-meta";
import { Select, SelectItem, SelectPopup, SelectTrigger } from "@/components/ui/select";

type IssueOption = {
  value: string;
  label: string;
  volume: number;
  number: number;
  dateISO: string;
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
  const selectedOption = options.find((o) => o.value === selectedValue) ?? options[0];

  const onValueChange = React.useCallback(
    (next: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next) params.set("issue", next);
      else params.delete("issue");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  if (!options.length) return null;

  return (
    <Select value={selectedValue} onValueChange={onValueChange} items={options}>
      <SelectTrigger aria-label="Select issue" className="text-sm">
        {selectedOption ? (
          <IssueMeta
            volume={selectedOption.volume}
            number={selectedOption.number}
            dateISO={selectedOption.dateISO}
          />
        ) : (
          <span>Select issue</span>
        )}
        <span className="ml-1 text-[10px] leading-none opacity-60">▾</span>
      </SelectTrigger>
      <SelectPopup>
        {options.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            <IssueMeta volume={item.volume} number={item.number} dateISO={item.dateISO} />
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}

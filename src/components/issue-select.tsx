// src/components/issue-select.tsx
"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IssueMeta } from "@/components/issue-meta";

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
  const items = options.map((item) => ({ label: item.label, value: item.value }));

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
    <Select value={selectedValue} onValueChange={onValueChange} items={items}>
      <SelectTrigger
        aria-label="Select issue"
        className="!h-auto !min-h-0 !w-auto !min-w-0 !border-0 !bg-transparent !px-0 !py-0 !text-sm !leading-none !shadow-none focus-visible:ring-0 [&_[data-slot=select-icon]]:hidden"
      >
        <SelectValue className="sr-only" />
        {selectedOption ? (
          <IssueMeta
            volume={selectedOption.volume}
            number={selectedOption.number}
            dateISO={selectedOption.dateISO}
          />
        ) : (
          <span>Select issue</span>
        )}
      </SelectTrigger>
      <SelectPopup alignItemWithTrigger={false}>
        {options.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            <IssueMeta volume={item.volume} number={item.number} dateISO={item.dateISO} />
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}

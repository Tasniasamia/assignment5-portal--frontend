"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TIdeaCategory } from "@/types/idea.category.type";

interface IdeaFilterPanelProps {
  categories: TIdeaCategory[];
}

const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Under Review", value: "UNDER_REVIEW" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

export default function IdeaFilterPanel({ categories }: IdeaFilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
const categoryOptions = categories.map((c: { id: string; name: string }) => ({
  label: c.name,
  value: c.id,
}));
  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || !value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex items-center gap-2">
      {/* Status Filter */}
      <Select
        value={searchParams.get("status") ?? "all"}
        onValueChange={(val :any) => updateParam("status", val)}
      >
        <SelectTrigger className="w-[140px] h-9 bg-white text-sm">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {STATUS_OPTIONS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
  
 
  
       <Select value={searchParams.get("categoryId") ?? "all"} onValueChange={(val:any) => updateParam("categoryId", val)} >
              <SelectTrigger className="bg-white w-full">
              <SelectValue placeholder="All Categories">
  {categoryOptions.find((o) => o.value === (searchParams.get("categoryId") ?? "all"))?.label ?? "All Categories"}
</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white">
                {categoryOptions?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

 </div>
  );
}


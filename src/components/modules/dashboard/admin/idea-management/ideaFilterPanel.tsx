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
        onValueChange={(val) => updateParam("status", val)}
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

      {/* Category Filter */}
      <Select
        value={searchParams.get("categoryId") ?? "all"}
        onValueChange={(val) => updateParam("categoryId", val)}
      >
        <SelectTrigger className="w-[160px] h-9 bg-white text-sm">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
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

const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "ACTIVE" },
  { label: "Blocked", value: "BLOCKED" },
];

const ROLE_OPTIONS = [
  { label: "All Roles", value: "all" },
  { label: "Admin", value: "ADMIN" },
  { label: "Member", value: "MEMBER" },
];

export default function UserFilterPanel() {
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

      {/* Role Filter */}
      <Select
        value={searchParams.get("role") ?? "all"}
        onValueChange={(val:any) => updateParam("role", val)}
      >
        <SelectTrigger className="w-[130px] h-9 bg-white text-sm">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {ROLE_OPTIONS.map((r) => (
            <SelectItem key={r.value} value={r.value}>
              {r.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
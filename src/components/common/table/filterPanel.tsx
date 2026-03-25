"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ✅ filter field র type
export type FilterFieldConfig =
  | {
      type: "select";
      key: string;           // URL param key — e.g. "user.status", "gender"
      label: string;         // UI label — e.g. "User Status"
      placeholder?: string;
      options: { label: string; value: string }[];
    }
  | {
      type: "range";
      label: string;         // UI label — e.g. "Appointment Fee"
      gtKey: string;         // URL param key for min — e.g. "appointmentFee[gt]"
      ltKey: string;         // URL param key for max — e.g. "appointmentFee[lt]"
      placeholder?: { gt?: string; lt?: string };
    };

interface IFilterPanelProps {
  filters: FilterFieldConfig[];
}

export default function FilterPanel({ filters }: IFilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  // ✅ সব filter keys বের করো active count এর জন্য
  const allKeys = filters.flatMap((f) =>
    f.type === "select" ? [f.key] : [f.gtKey, f.ltKey],
  );
  const activeCount = allKeys.filter((key) => searchParams.get(key)).length;

  // ✅ local state — config থেকে dynamically বানাও
  const [localValues, setLocalValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    allKeys.forEach((key) => {
      init[key] = searchParams.get(key) ?? "";
    });
    return init;
  });

  const setValue = (key: string, value: string) => {
    setLocalValues((prev) => ({ ...prev, [key]: value }));
  };

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const handleApply = () => {
    updateParams(localValues);
    setOpen(false);
  };

  const handleReset = () => {
    const cleared: Record<string, string> = {};
    allKeys.forEach((key) => {
      cleared[key] = "";
    });
    setLocalValues(cleared);
    updateParams(cleared);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative gap-2">
          <Filter className="h-4 w-4" />
          Filter
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Filters</h4>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            )}
          </div>

          {/* ✅ config অনুযায়ী fields render করো */}
          {filters.map((filter, index) => {
            if (filter.type === "select") {
              return (
                <div key={index} className="space-y-1.5">
                  <Label className="text-xs">{filter.label}</Label>
                  <Select
                    value={localValues[filter.key] ?? ""}
                    onValueChange={(val) => setValue(filter.key, val)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder={filter.placeholder ?? `All ${filter.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {localValues[filter.key] && (
                    <button
                      type="button"
                      onClick={() => setValue(filter.key, "")}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <X className="h-3 w-3" /> Clear
                    </button>
                  )}
                </div>
              );
            }

            if (filter.type === "range") {
              return (
                <div key={index} className="space-y-1.5">
                  <Label className="text-xs">{filter.label}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder={filter.placeholder?.gt ?? "Min"}
                      value={localValues[filter.gtKey] ?? ""}
                      onChange={(e) => setValue(filter.gtKey, e.target.value)}
                      className="h-9"
                    />
                    <span className="text-muted-foreground text-sm">—</span>
                    <Input
                      type="number"
                      placeholder={filter.placeholder?.lt ?? "Max"}
                      value={localValues[filter.ltKey] ?? ""}
                      onChange={(e) => setValue(filter.ltKey, e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>
              );
            }
          })}

          <Button onClick={handleApply} className="w-full h-9">
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
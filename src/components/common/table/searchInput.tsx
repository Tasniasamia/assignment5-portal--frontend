"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ISearchInputProps {
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchInput({
  placeholder = "Search...",
  debounceMs = 500,
}: ISearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get("searchTerm") ?? "");

  // ✅ user নিজে type করছে কিনা track করো
  const isUserTyping = useRef(false);

  const updateParams = useCallback(
    (searchTerm: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("searchTerm", searchTerm);
      } else {
        params.delete("searchTerm");
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  // ✅ user type করলে debounce দিয়ে URL update
  useEffect(() => {
    if (!isUserTyping.current) return;

    const timer = setTimeout(() => {
      updateParams(value);
      isUserTyping.current = false;
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs, updateParams]);

  // ✅ back/forward button বা বাইরে থেকে URL বদলালে sync করো
  // কিন্তু user typing চলাকালীন sync করবে না
  useEffect(() => {
    if (isUserTyping.current) return;
    const urlValue = searchParams.get("searchTerm") ?? "";
    setValue(urlValue);
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isUserTyping.current = true; // ✅ user টাইপ করছে mark করো
    setValue(e.target.value);
  };

  const handleClear = () => {
    isUserTyping.current = true;
    setValue("");
  };

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
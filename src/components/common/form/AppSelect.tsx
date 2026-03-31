// components/common/form/AppSelect.tsx
"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption {
  label: string;
  value: string;
}
interface AppSelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string | null) => void; // ✅ string → string | null
  required?: boolean;
  error?: string;
  disabled?: boolean;
}
// interface AppSelectProps {
//   label?: string;
//   placeholder?: string;
//   options: SelectOption[];
//   value: string;
//   onChange: (value: string) => void;
//   required?: boolean;
//   error?: string;
//   disabled?: boolean;
// }

export default function AppSelect({
  label,
  placeholder = "Select an option",
  options,
  value,
  onChange,
  required,
  error,
  disabled,
}: AppSelectProps) {
  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <div className="space-y-1.5">
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </Label>
      )}

      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="bg-white w-full">
          <SelectValue placeholder={placeholder}>
            {selectedLabel ?? placeholder}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
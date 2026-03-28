"use client"

import { REGEXP_ONLY_DIGITS } from "input-otp"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { AnyFieldApi } from "@tanstack/react-form"

export default function InputOTPPattern({
  field,
  label = "Enter OTP",
  className,
}: {
  field: AnyFieldApi
  label?: string
  className?: string
}) {
  const hasError = field.state.meta.errors?.length > 0

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label
        htmlFor={field.name}
        className={cn(hasError && "text-destructive")}
      >
     
      </Label>

      <InputOTP
        id={field.name}
   
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
        value={field.state.value}
        onChange={(val) => field.handleChange(val)}
      >
        <InputOTPGroup className=" flex justify-center w-full">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      {hasError && (
        <p className="text-sm text-destructive">
          {field.state.meta.errors[0]}
        </p>
      )}
    </div>
  )
}
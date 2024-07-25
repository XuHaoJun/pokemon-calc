import * as React from "react"
import { clamp } from "remeda"

import { Input } from "./ui/input"

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value?: string | number
  onChange?: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue ?? "")

  React.useEffect(() => {
    setValue(initialValue ?? "")
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      let v: string | number
      if (props.type === "number") {
        v = Number(value)
        if (typeof props.min === "number") {
          v = clamp(v, { min: props.min })
        }
        if (typeof props.max === "number") {
          v = clamp(v, { max: props.max })
        }
      } else {
        v = value
      }
      onChange?.(v)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => {
        const nextValue = e.target.value
        setValue(nextValue)
      }}
    />
  )
}

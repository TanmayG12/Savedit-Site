import * as React from "react"
import { cn } from "@/lib/utils"

type SwitchProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked = false, className, onCheckedChange, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)
      if (e.defaultPrevented) return
      onCheckedChange?.(!checked)
    }

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        data-checked={checked ? "true" : "false"}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-input bg-input transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          checked && "bg-primary/80",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 translate-x-0 rounded-full bg-background shadow transition",
            checked && "translate-x-4"
          )}
        />
      </button>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }

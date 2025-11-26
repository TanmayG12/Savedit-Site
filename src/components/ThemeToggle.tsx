"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, MonitorSmartphone, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const options = [
  { label: "Light", value: "light" as const, icon: Sun },
  { label: "Dark", value: "dark" as const, icon: Moon },
  { label: "System", value: "system" as const, icon: MonitorSmartphone },
];

type ThemeToggleProps = {
  variant?: "default" | "compact";
};

export default function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
  const { theme, systemTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const effective = theme === "system" ? systemTheme : theme;
  const current = options.find((o) => o.value === theme) ?? options[0];

  const triggerClasses =
    variant === "compact"
      ? "h-10 px-3 rounded-full"
      : "w-full rounded-xl px-3 py-2";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "inline-flex items-center justify-center text-sm gap-2",
            triggerClasses
          )}
        >
          {current.icon ? <current.icon className="h-4 w-4" /> : <Palette className="h-4 w-4" />}
          <span className="hidden sm:inline">{current.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Theme
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className="flex items-center gap-2"
          >
            <opt.icon className="h-4 w-4" />
            <span className="flex-1">{opt.label}</span>
            {effective === opt.value && <span className="text-xs text-primary">●</span>}
            {opt.value === "system" && effective !== "light" && effective !== "dark" && (
              <span className="text-xs text-primary">●</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

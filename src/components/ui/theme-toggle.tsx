
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
      <Button
        variant={theme === 'light' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => setTheme("light")}
        className="h-10 rounded-md"
      >
        <Sun className="h-5 w-5" />
      </Button>
      <Button
        variant={theme === 'dark' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => setTheme("dark")}
        className="h-10 rounded-md"
      >
        <Moon className="h-5 w-5" />
      </Button>
    </div>
  );
}

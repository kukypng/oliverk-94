
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative flex w-[90px] items-center rounded-full border border-border/20 bg-muted/50 p-1 shadow-soft backdrop-blur-sm">
      <div
        className={`absolute h-[36px] w-[41px] rounded-full bg-background shadow-md transition-transform duration-300 ease-in-out
          ${theme === 'dark' ? 'translate-x-[45px]' : 'translate-x-[4px]'}`}
      ></div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className="z-10 h-10 flex-1 rounded-full text-muted-foreground transition-colors hover:text-foreground"
      >
        <Sun
          className={`h-5 w-5 transition-all duration-500 ease-out ${
            theme === 'light' ? 'rotate-0 scale-110 text-primary' : 'rotate-90 scale-100'
          }`}
        />
        <span className="sr-only">Mudar para tema claro</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className="z-10 h-10 flex-1 rounded-full text-muted-foreground transition-colors hover:text-foreground"
      >
        <Moon
          className={`h-5 w-5 transition-all duration-500 ease-out ${
            theme === 'dark' ? 'rotate-0 scale-110 text-primary' : '-rotate-90 scale-100'
          }`}
        />
        <span className="sr-only">Mudar para tema escuro</span>
      </Button>
    </div>
  );
}

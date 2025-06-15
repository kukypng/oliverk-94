"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
export function ThemeToggle() {
  const {
    theme,
    setTheme
  } = useTheme();
  return <div className="relative rounded-xl bg-muted/50 p-1 border border-border/50 shadow-soft backdrop-blur-sm">
      {/* Background slider */}
      <div className="px-[128px]" />
      
      <div className="relative grid grid-cols-2 gap-1">
        <Button variant="ghost" size="sm" onClick={() => setTheme("light")} className={`h-10 rounded-lg transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${theme === 'light' ? 'text-foreground shadow-none' : 'text-muted-foreground hover:text-foreground'}`}>
          <Sun className={`h-5 w-5 transition-all duration-500 ease-out ${theme === 'light' ? 'rotate-0 scale-110' : 'rotate-90 scale-100'}`} />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setTheme("dark")} className={`h-10 rounded-lg transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${theme === 'dark' ? 'text-foreground shadow-none' : 'text-muted-foreground hover:text-foreground'}`}>
          <Moon className={`h-5 w-5 transition-all duration-500 ease-out ${theme === 'dark' ? 'rotate-0 scale-110' : '-rotate-90 scale-100'}`} />
        </Button>
      </div>
    </div>;
}
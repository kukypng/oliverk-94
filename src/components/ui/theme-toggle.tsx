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
  return <div className="relative rounded-xl bg-secondary/50 p-1 border border-border/50 shadow-soft backdrop-blur-sm">
      {/* Background slider */}
      <div className="bg-zinc-800" />
      
      <div className="relative grid grid-cols-2 gap-1 bg-zinc-900 rounded-full">
        <Button variant="ghost" size="sm" onClick={() => setTheme("light")} className="px-[22px]">
          <Sun className={`h-4 w-4 transition-all duration-500 ease-out ${theme === 'light' ? 'rotate-0 scale-110' : 'rotate-90 scale-100'}`} />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setTheme("dark")} className="my-0 mx-0 font-normal text-9xl px-[14px] py-[21px] text-white">
          <Moon className={`h-4 w-4 transition-all duration-500 ease-out ${theme === 'dark' ? 'rotate-0 scale-110' : '-rotate-90 scale-100'}`} />
        </Button>
      </div>
    </div>;
}
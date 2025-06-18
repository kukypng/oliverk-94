
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative rounded-xl bg-secondary/30 p-1 border border-primary/20 shadow-soft backdrop-blur-sm">
      {/* Background slider */}
      <div 
        className={`absolute top-1 bottom-1 w-10 bg-primary rounded-lg transition-all duration-300 ease-out shadow-medium ${
          theme === 'light' ? 'left-1' : 'left-11'
        }`} 
      />
      
      <div className="relative grid grid-cols-2 gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme("light")}
          className={`h-10 w-10 rounded-lg transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${
            theme === 'light' 
              ? 'text-primary-foreground shadow-none z-10' 
              : 'text-muted-foreground hover:text-primary'
          }`}
        >
          <Sun className={`h-4 w-4 transition-all duration-500 ease-out ${
            theme === 'light' ? 'rotate-0 scale-110' : 'rotate-90 scale-100'
          }`} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme("dark")}
          className={`h-10 w-10 rounded-lg transition-all duration-300 ease-out hover:scale-105 active:scale-95 ${
            theme === 'dark' 
              ? 'text-primary-foreground shadow-none z-10' 
              : 'text-muted-foreground hover:text-primary'
          }`}
        >
          <Moon className={`h-4 w-4 transition-all duration-500 ease-out ${
            theme === 'dark' ? 'rotate-0 scale-110' : '-rotate-90 scale-100'
          }`} />
        </Button>
      </div>
    </div>
  );
}

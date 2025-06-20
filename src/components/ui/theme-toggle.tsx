
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative rounded-2xl bg-secondary/50 p-1 border border-border/50 shadow-soft backdrop-blur-sm">
      {/* Background slider animado */}
      <div 
        className={`absolute top-1 h-9 w-9 rounded-xl bg-primary shadow-medium transition-all duration-300 ease-out ${
          theme === 'light' ? 'left-1' : 'left-11'
        }`}
      />
      
      <div className="relative grid grid-cols-2 gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setTheme("light")} 
          className={`h-9 w-9 rounded-xl transition-all duration-300 ease-out hover:scale-105 active:scale-95 relative z-10 ${
            theme === 'light' 
              ? 'text-primary-foreground shadow-none' 
              : 'text-muted-foreground hover:text-primary'
          }`}
        >
          <Sun className={`h-4 w-4 transition-all duration-300 ease-out ${
            theme === 'light' ? 'rotate-0 scale-110' : 'rotate-90 scale-100'
          }`} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setTheme("dark")} 
          className={`h-9 w-9 rounded-xl transition-all duration-300 ease-out hover:scale-105 active:scale-95 relative z-10 ${
            theme === 'dark' 
              ? 'text-primary-foreground shadow-none' 
              : 'text-muted-foreground hover:text-primary'
          }`}
        >
          <Moon className={`h-4 w-4 transition-all duration-300 ease-out ${
            theme === 'dark' ? 'rotate-0 scale-110' : '-rotate-90 scale-100'
          }`} />
        </Button>
      </div>
    </div>
  );
}

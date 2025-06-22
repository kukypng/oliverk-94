
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="relative inline-flex items-center rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-1 border border-slate-200/60 dark:border-slate-700/60 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-xl">
      {/* Background slider with smooth animation */}
      <div 
        className={`absolute top-1 h-9 w-9 bg-white dark:bg-slate-700 rounded-xl shadow-md transform transition-all duration-300 ease-out ${
          theme === 'light' ? 'translate-x-0' : 'translate-x-10'
        }`}
      />
      
      <div className="relative flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setTheme("light")} 
          className={`relative z-10 h-9 w-9 p-0 rounded-xl transition-all duration-300 hover:scale-110 ${
            theme === 'light' 
              ? 'text-amber-600 hover:text-amber-700' 
              : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
          }`}
        >
          <Sun className={`h-4 w-4 transition-all duration-500 ease-out ${
            theme === 'light' ? 'rotate-0 scale-110' : 'rotate-90 scale-90'
          }`} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setTheme("dark")} 
          className={`relative z-10 h-9 w-9 p-0 rounded-xl transition-all duration-300 hover:scale-110 ${
            theme === 'dark' 
              ? 'text-blue-400 hover:text-blue-300' 
              : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
          }`}
        >
          <Moon className={`h-4 w-4 transition-all duration-500 ease-out ${
            theme === 'dark' ? 'rotate-0 scale-110' : '-rotate-90 scale-90'
          }`} />
        </Button>
      </div>
    </div>
  );
}

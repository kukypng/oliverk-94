
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  // Prioriza 'dark' se nenhum tema estiver salvo ou se o sistema preferir escuro.
  const [theme, setTheme] = React.useState<"light" | "dark">(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      if (savedTheme) {
        return savedTheme;
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "dark"; // Default para SSR ou ambientes sem window
  });

  React.useEffect(() => {
    // Aplica o tema ao carregar
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden rounded-full h-10 w-10 hover:bg-accent/20 transition-all duration-300 ease-out hover:scale-110" // Ajustado hover:bg-accent/20 para melhor visibilidade no tema escuro
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-foreground" /> {/* Adicionado text-foreground */}
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-foreground" /> {/* Adicionado text-foreground */}
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}

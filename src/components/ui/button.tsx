
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] hover:scale-[1.02] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 mobile-touch relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-medium hover:shadow-strong hover:bg-primary/95 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-white/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        destructive: "bg-destructive text-destructive-foreground shadow-medium hover:shadow-strong hover:bg-destructive/95 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-white/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        outline: "border border-primary/20 bg-background/70 hover:bg-primary/8 hover:text-primary hover:border-primary/40 backdrop-blur-sm shadow-soft hover:shadow-medium",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 backdrop-blur-sm shadow-soft hover:shadow-medium border border-border/30 hover:border-border/50",
        ghost: "hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:shadow-sm",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105 transition-all duration-200",
        success: "bg-success text-success-foreground shadow-medium hover:shadow-strong hover:bg-success/95 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-white/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        warning: "bg-warning text-warning-foreground shadow-medium hover:shadow-strong hover:bg-warning/95 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-white/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs font-medium",
        lg: "h-12 rounded-xl px-8 text-base font-semibold",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

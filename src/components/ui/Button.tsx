import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "glass";
    size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95",
                    {
                        "bg-primary text-primary-foreground shadow hover:bg-primary/90": variant === "default",
                        "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
                        "border border-input bg-background hover:bg-muted hover:text-muted-foreground": variant === "outline",
                        "hover:bg-muted hover:text-muted-foreground": variant === "ghost",
                        "text-primary underline-offset-4 hover:underline": variant === "link",
                        "glass hover:bg-white/40 dark:hover:bg-white/5 text-foreground shadow-sm border border-white/20": variant === "glass",
                        "h-10 px-4 py-2": size === "default",
                        "h-9 rounded-md px-3": size === "sm",
                        "h-12 rounded-md px-8 text-base": size === "lg",
                        "h-10 w-10 p-0": size === "icon",
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

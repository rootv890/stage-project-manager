import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-foreground text-background shadow hover:bg-foreground/90 transition-colors duration-150",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 transition-colors duration-150",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-150",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 transition-colors duration-150",
        ghost:
          "bg-transparent text-primary hover:bg-accent hover:text-accent-foreground transition-colors duration-150",
        link: "text-primary underline-offset-4 hover:underline transition-colors duration-150",
        subtle:
          "bg-muted text-muted-foreground shadow hover:bg-muted/80 transition-colors duration-150",
        gradient:
          "bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground shadow hover:opacity-90 transition-all duration-150",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-full px-3 text-xs",
        lg: "h-10 rounded-full px-8",
        icon: "h-9 w-9",
        xl: "h-12 px-6 text-lg rounded-md",
        compact: "h-7 px-2 text-sm rounded",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

// Fonction utilitaire cn pour combiner les classes conditionnellement
const cn = (...classes: any) => {
  return classes.filter(Boolean).join(' ')
}

// Composant Slot simplifié pour remplacer @radix-ui/react-slot
const Slot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { asChild?: boolean }>(
  ({ children, asChild, ...props }, ref) => {
    const Comp = asChild ? React.Children.only(children) : 'span'
    return React.isValidElement(Comp)
      ? React.cloneElement(Comp, { ...props, ref })
      : <Comp {...props} ref={ref}>{children}</Comp>
  }
)
Slot.displayName = "Slot"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        destructive:
          "bg-red-500 text-white hover:bg-red-600",
        outline:
          "border border-gray-300 bg-transparent hover:bg-gray-100",
        secondary:
          "bg-gray-200 text-gray-800 hover:bg-gray-300",
        ghost: "hover:bg-gray-100",
        link: "text-blue-500 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
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
  },
)
Button.displayName = "Button"

export { Button, buttonVariants } 
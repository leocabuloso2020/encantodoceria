"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const SidebarContext = React.createContext<{ open: boolean }>({ open: false })

const Sidebar = ({
  open = false,
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { open?: boolean }) => (
  <SidebarContext.Provider value={{ open }}>
    <div
      data-open={open}
      className={cn(
        "flex flex-col h-full [&>div]:h-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  </SidebarContext.Provider>
)
Sidebar.displayName = "Sidebar"

const sidebarVariants = cva(
  "group/sidebar flex flex-col h-full gap-2 p-4 data-[open=true]:animate-in data-[open=false]:animate-out data-[open=false]:fade-out-0 data-[open=true]:fade-in-0 data-[open=false]:zoom-out-95 data-[open=true]:zoom-in-95",
  {
    variants: {
      variant: {
        default: "bg-sidebar text-sidebar-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  asChild?: boolean
}

const SidebarBody = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    return (
      <Comp
        className={cn(sidebarVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
SidebarBody.displayName = "SidebarBody"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center h-fit px-2 py-4", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center h-fit px-2 py-4 mt-auto", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarNav = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn("flex flex-col gap-2 text-sm font-medium", className)}
    {...props}
  />
))
SidebarNav.displayName = "SidebarNav"

const SidebarNavItem = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    active?: boolean
    icon?: React.ReactNode
  }
>(({ className, active, icon, ...props }, ref) => {
  const { open } = React.useContext(SidebarContext)
  return (
    <a
      ref={ref}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        active && "bg-sidebar-accent text-sidebar-accent-foreground",
        className
      )}
      {...props}
    >
      {icon}
      <span
        className={cn(
          "transition-all duration-300",
          !open && "lg:hidden"
        )}
      >
        {props.children}
      </span>
    </a>
  )
})
SidebarNavItem.displayName = "SidebarNavItem"

export {
  Sidebar,
  SidebarBody,
  SidebarNavItem,
  SidebarNav,
  SidebarHeader,
  SidebarFooter,
}
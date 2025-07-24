"use client"

import { useTheme } from "next-themes"
import { Toaster as SonnerToaster } from "sonner"

/**
 * Glassmorphism-ready toast provider based on the “sonner” library.
 *
 * Usage (already in app/layout.tsx):
 *   import { Toaster } from "@/components/ui/sonner"
 *   …
 *   <Toaster richColors closeButton position="top-center" />
 */
const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme()

  return (
    <SonnerToaster
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

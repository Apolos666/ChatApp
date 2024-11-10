import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50">
      <Loader2 className={cn("h-4 w-4 animate-spin text-primary", className)} />
    </div>
  )
} 
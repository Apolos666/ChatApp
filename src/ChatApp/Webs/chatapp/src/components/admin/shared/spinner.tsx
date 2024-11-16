import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface SpinnerProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  textClassName?: string
}

export function Spinner({ text, size = 'md', className, textClassName }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      {text && (
        <span className={cn('text-sm text-black', textClassName)}>
          {text}
        </span>
      )}
    </div>
  )
}
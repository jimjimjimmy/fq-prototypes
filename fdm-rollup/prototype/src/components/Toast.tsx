import { useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'

interface ToastProps {
  message: string
  onDismiss: () => void
}

export function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-[#1d2433] text-white rounded-lg shadow-lg text-[13px]">
      <CheckCircle2 size={16} className="text-[#1fac76]" />
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-2 text-[#adb2bb] hover:text-white">
        <X size={14} />
      </button>
    </div>
  )
}

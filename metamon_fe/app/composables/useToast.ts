/**
 * useToast — Global notification state.
 * Shows success / error / info / warning toasts anywhere in the app.
 */
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  type: ToastType
  message: string
  duration: number
}

// ── Module-level singleton ──────────────────────────────────────────────────
const toasts = ref<Toast[]>([])
let _id = 0

export function useToast() {
  function show(message: string, type: ToastType = 'info', duration = 4000) {
    const id = ++_id
    toasts.value.push({ id, type, message, duration })

    // Auto-remove after duration
    setTimeout(() => remove(id), duration)
  }

  function remove(id: number) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const success = (msg: string, duration?: number) => show(msg, 'success', duration)
  const error   = (msg: string, duration?: number) => show(msg, 'error', duration ?? 6000)
  const warning = (msg: string, duration?: number) => show(msg, 'warning', duration)
  const info    = (msg: string, duration?: number) => show(msg, 'info', duration)

  return { toasts, show, remove, success, error, warning, info }
}

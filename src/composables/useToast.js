import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

const addToast = ({ title, description, variant = 'default', duration = 4000 }) => {
  const id = ++toastId
  toasts.value.push({ id, title, description, variant })

  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  return id
}

const removeToast = (id) => {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

export const useToast = () => {
  const toast = ({ title, description, variant = 'default', duration = 4000 }) => {
    return addToast({ title, description, variant, duration })
  }

  toast.success = (title, description) => addToast({ title, description, variant: 'default' })
  toast.error = (title, description) => addToast({ title, description, variant: 'destructive' })

  return { toast, toasts, removeToast }
}

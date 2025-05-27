import { toast, type ToastOptions } from 'react-toastify'

const ToastSuccessOptions: ToastOptions = {
  autoClose: 2000,
}

export const ToastSuccess = (text: string, options?: ToastOptions) => {
  options = { ...ToastSuccessOptions, ...options }
  toast.success(text, options)
}

const ToastErrorOptions: ToastOptions = {
  autoClose: 2000,
}

export const ToastError = (text: string, options?: ToastOptions) => {
  options = { ...ToastErrorOptions, ...options }
  toast.error(text, options)
}

import { AxiosError } from 'axios'
import { ToastError } from './toast.config'

export const ErrorHandle = (error: unknown, errorMessage: string) => {
  if (error instanceof AxiosError) {
    errorMessage = error.response?.data?.message || error?.response?.data[0] || errorMessage
    ToastError(errorMessage)
  } else {
    ToastError('An unexpected error occurred')
  }
  console.error(error)
}

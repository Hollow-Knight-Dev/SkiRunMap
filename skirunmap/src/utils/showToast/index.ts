import { toast, ToastOptions } from 'react-toastify'

const showToast = (
  type: 'success' | 'warn' | 'error' | 'info',
  message: string,
  onClose?: () => void
) => {
  const options: ToastOptions = {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: 'light',
    onClose: onClose || (() => {})
  }

  switch (type) {
    case 'success':
      toast.success(message, options)
      break
    case 'warn':
      toast.warn(message, options)
      break
    case 'error':
      toast.error(message, options)
      break
    case 'info':
      toast.info(message, options)
      break
  }
}

export default showToast

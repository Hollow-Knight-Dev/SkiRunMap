interface ModalProps {
  title: string
  message: string
  confirmTitle: string
  onConfirm: () => void
  middleTitle?: string
  onMiddleOption?: () => void
  cancelTitle: string
  onCancel: () => void
}

const Modal: React.FC<ModalProps> = ({
  title,
  message,
  confirmTitle: confirmButton,
  onConfirm,
  middleTitle,
  onMiddleOption,
  cancelTitle: cancelButton,
  onCancel
}) => {
  return (
    <div className='h-screen-64px absolute z-20 flex w-full items-center justify-center'>
      <div className='mb-16 flex h-80 w-80 flex-col items-center rounded-lg bg-white p-8 font-bold shadow-[0px_0px_10px_-3px_#000000]'>
        <p className='break-word mb-2 text-center text-2xl'>{title}</p>
        <p className='break-word mb-4 text-center text-lg font-normal'>{message}</p>
        <div className='mt-auto flex w-full flex-col items-center gap-2 text-lg'>
          <button
            className='w-full rounded-full bg-blue-100 p-1 shadow-[3px_5px_7px_-6px_#7e7e7e] duration-300 hover:bg-blue-200 hover:shadow-[10px_12px_10px_-12px_#7e7e7e]'
            onClick={onConfirm}
          >
            {confirmButton}
          </button>
          {middleTitle && (
            <button
              className='w-full rounded-full bg-blue-100 p-1 shadow-[3px_5px_7px_-6px_#7e7e7e] duration-300 hover:bg-blue-200 hover:shadow-[10px_12px_10px_-12px_#7e7e7e]'
              onClick={onMiddleOption}
            >
              {middleTitle}
            </button>
          )}
          <button
            className='w-full rounded-full bg-blue-100 p-1 shadow-[3px_5px_7px_-6px_#7e7e7e] duration-300 hover:bg-blue-200 hover:shadow-[10px_12px_10px_-12px_#7e7e7e]'
            onClick={onCancel}
          >
            {cancelButton}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal

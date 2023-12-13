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
    <div className='h-screen-64px flex w-full items-center justify-center'>
      <div className='mb-16 flex h-64 w-64 flex-col'>
        <div className='flex h-64 w-64 flex-col items-center rounded-lg p-8 font-bold shadow-[0px_0px_10px_-2px_#53a3f3]'>
          <p className='break-word mb-1 text-center text-2xl'>{title}</p>
          <p className='break-word mb-1 text-center text-lg'>{message}</p>
          <div className='mt-auto flex w-full justify-between text-lg'>
            <button className='w-20 rounded-full bg-blue-100 p-1' onClick={onConfirm}>
              {confirmButton}
            </button>
            {middleTitle && (
              <button className='w-20 rounded-full bg-blue-100 p-1' onClick={onMiddleOption}>
                {middleTitle}
              </button>
            )}
            <button className='w-20 rounded-full bg-blue-100 p-1' onClick={onCancel}>
              {cancelButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal

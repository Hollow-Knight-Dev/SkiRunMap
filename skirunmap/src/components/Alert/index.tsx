interface AlertProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

const Alert: React.FC<AlertProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className='h-screen-64px flex w-full items-center justify-center'>
      <div className='mb-16 flex h-64 w-64 flex-col'>
        <div className='flex h-64 w-64 flex-col items-center rounded-lg p-8 font-bold shadow-[0px_0px_10px_-2px_#53a3f3]'>
          <p className='break-word mb-1 text-center text-2xl'>{message}</p>
          <div className='mt-auto flex w-full justify-between text-lg'>
            <button className='w-20 rounded-full bg-blue-100 p-1' onClick={onConfirm}>
              Confirm
            </button>
            <button className='w-20 rounded-full bg-blue-100 p-1' onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alert

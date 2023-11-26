interface AlertProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

const Alert: React.FC<AlertProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className='flex h-56 w-56 flex-col bg-zinc-100'>
      <p>{message}</p>
      <div className='flex w-full justify-around'>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

export default Alert

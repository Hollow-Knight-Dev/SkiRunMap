import WorldIcon from './worldwide.gif'

const SmallScreen = () => {
  return (
    <div className='h-screen-64px flex flex-col items-center justify-center'>
      <img className='h-auto w-40' src={WorldIcon} alt='World Icon' />
      <p className='text-center text-2xl'>
        For better user experience, <br></br>please kindly use wider screen to view the contents.
      </p>
    </div>
  )
}

export default SmallScreen

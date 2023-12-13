import { useBlocker } from 'react-router-dom'
import Modal from '../components/Modal'
import { useRouteStore } from '../store/useRoute'

const Temp = () => {
  const { isSaveToLeave } = useRouteStore()
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isSaveToLeave !== true && currentLocation.pathname !== nextLocation.pathname
  )
  return (
    <div>
      {blocker.state === 'blocked' ? (
        <Modal
          title='Start Over?'
          message='If you go away now, you will lose this draft.'
          confirmTitle='Start over'
          onConfirm={() => console.log('Start over')}
          middleTitle='Save draft'
          onMiddleOption={() => console.log('Save draft')}
          cancelTitle='Keep editing'
          onCancel={() => console.log('Keep editing')}
        />
      ) : null}
    </div>
  )
}

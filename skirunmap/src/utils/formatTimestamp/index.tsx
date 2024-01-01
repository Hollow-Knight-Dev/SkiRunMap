import { Timestamp } from 'firebase/firestore'

export const formatTimestamp = (timestamp: Timestamp) => {
  const time = timestamp
    .toDate()
    .toLocaleDateString('en-UK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour12: false,
      hour: 'numeric',
      minute: 'numeric'
    })
    .replace(',', ' at')

  return time
}

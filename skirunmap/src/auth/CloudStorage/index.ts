import { getFirestore } from '@firebase/firestore'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: 'AIzaSyC_F8P7qOtAZ-go0RGE9OIoqXRB4VjHMr8',
  authDomain: 'skirunmap.firebaseapp.com',
  projectId: 'skirunmap',
  storageBucket: 'skirunmap.appspot.com',
  messagingSenderId: '1070163450195',
  appId: '1:1070163450195:web:1e4264da092f377e77e9a6',
  measurementId: 'G-GNSJKWWCK5'
}

const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app);

/* Firestore */
const db = getFirestore(app)

/* Storage */
const storage = getStorage(app)

/* Authentication */
const auth = getAuth(app)

export { app, auth, db, storage }

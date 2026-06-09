import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyB7oaAAVm7nX-mJbBAaKfD4gG-opPfNhvs',
  authDomain: 'sportsexetest.firebaseapp.com',
  projectId: 'sportsexetest',
  storageBucket: 'sportsexetest.firebasestorage.app',
  messagingSenderId: '722816384930',
  appId: '1:722816384930:web:7277f9bc75240c89a43cfb',
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

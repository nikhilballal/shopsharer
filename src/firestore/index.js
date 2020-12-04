import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

//firebase SDK configuration - line 6-14
var firebaseConfig = {
  apiKey: 'AIzaSyDX-j3qJtFT1fEajB7dZXQjWaNfGZ9Vctw',
  authDomain: 'firestore-react-31f4d.firebaseapp.com',
  projectId: 'firestore-react-31f4d',
  storageBucket: 'firestore-react-31f4d.appspot.com',
  messagingSenderId: '1078017007151',
  appId: '1:1078017007151:web:9d03ac5b36aec04de130da',
}

const firebaseApp = !firebase.apps.length //initializes it once
  ? firebase.initializeApp(firebaseConfig) //initializes the firebase app
  : firebase.app()
const db = firebaseApp.firestore()
const auth = firebaseApp.auth()
const storage = firebaseApp.storage()

//enable google from authentication (in firebase)
export async function signInWithGoogle() {
  new firebase.
}

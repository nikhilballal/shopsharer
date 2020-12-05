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
  const provider = new firebase.auth.GoogleAuthProvider()
  await auth.signInWithPopup(provider)
  window.location.reload() //redirect
}

export function checkAuth(cb) {
  return auth.onAuthStateChanged(cb)
}

//logout
export async function logOut() {
  await auth.signOut()
  window.location.reload()
}

export async function getCollection(id) {
  const snapshot = await db.collection(id).get()
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  console.log(data)
}

export async function getUserLists(userId) {
  const snapshot = await db
    .collection('lists')
    .where('author', '==', userId)
    .get()

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

function uploadCoverImage(file) {
  const uploadTask = storage
    .ref(`images/${file.name}-${file.lastModified}`)
    .put(file)

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => console.log('image uploading', snapshot),
      reject,
      () => {
        storage
          .ref('images')
          .child(`${file.name}-${file.lastModified}`)
          .getDownloadURL()
          .then(resolve)
      }
    )
  })
}

export async function createList(list, user) {
  const { name, description, image } = list
  await db.collection('lists').add({
    name,
    description,
    image: image ? await uploadCoverImage(image) : null,
    created: firebase.firestore.FieldValue.serverTimestamp(),
    author: user.uid,
    userIds: [user.uid],
    users: [
      {
        id: user.uid,
        name: user.displayName,
      },
    ],
  })
}

export async function getList(listId) {
  try {
    const list = await db.collection('lists').doc(listId).get()
    if (!list.exists) throw Error(`List doesn't exist`)
    return list.data()
  } catch (error) {
    console.error(error)
    throw Error(error)
  }
}

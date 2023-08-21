// Importing the functions from the SDKs we need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore';
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase, ref, set } from "firebase/database";

// app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnVyYOKx-LmpF6xMlLX3haieEKQIo8S60",
  authDomain: "smartnotes-f0e6d.firebaseapp.com",
  projectId: "smartnotes-f0e6d",
  storageBucket: "smartnotes-f0e6d.appspot.com",
  messagingSenderId: "539613810890",
  appId: "1:539613810890:web:adf40a5ef157261926a433"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const database = {
    // folders: collection(db, 'folders'),
    // files: collection(db, 'files'),
    profileImage: collection(db, 'profileImage'),
    saveSecretValues: (userId, secretValues) => {
      const dbRef = ref(getDatabase(app), `userSecrets/${userId}`);
      return set(dbRef, secretValues);
    },
    // formatDoc: doc =>{
    //     return {id: doc.id, ...doc.data()}
    // },
    // created at timestamp
    // we will get it from firebase
    // firebase has a unique way to create a timestamp, when the data get actually gets to server
    // getCurrentTimeStamp: serverTimestamp()
}

// creating collection : collection("name of database", "created collection")
export const notesCollection = collection(db, "notes");

export const secretsCollection = collection(db, "secrets");

export const auth = getAuth(app);

export default app;

export const storage = getStorage(app);
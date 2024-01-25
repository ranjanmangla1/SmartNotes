// Importing the functions from the SDKs we need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore';
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase, set } from "firebase/database";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
// import { loadEnv } from "vite";

// app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
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

export const storage = getStorage(app);

export async function uploadImageToFirebaseStorage(userId, file) {
  const storageRef = ref(storage, `users/${userId}/images/${file.name}`);

  try {
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl; // Return the URL of the uploaded image
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

export const notesCollection = collection(db, "notes");

export const secretsCollection = collection(db, "secrets");

export const auth = getAuth(app);

export default app;

export const handleImageUpload = async (blob) => {
  // Get the initialized Firebase Storage instance from your exported storage
  const storageRef = ref(storage, `images/${Math.random().toString(16).slice(1,)}`);

  try {
    await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl; // Return the URL of the uploaded image
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};
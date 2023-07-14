import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwI-69YeQWKLw5GW-C2889y4USLt2hVdU",
  authDomain: "dubbeez-ventures.firebaseapp.com",
  projectId: "dubbeez-ventures",
  storageBucket: "dubbeez-ventures.appspot.com",
  messagingSenderId: "792702878707",
  appId: "1:792702878707:web:d7bd883fc3dcc864ed4886"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app;
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBKKYFXMVpSMCcGSJ_uwFYQtslQO9X2eC8",
  authDomain: "learnf1-a912b.firebaseapp.com",
  projectId: "learnf1-a912b",
  storageBucket: "learnf1-a912b.appspot.com",
  messagingSenderId: "20998095561",
  appId: "1:20998095561:web:87dbae56e06e3707754318",
  measurementId: "G-P01NPL2GSW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

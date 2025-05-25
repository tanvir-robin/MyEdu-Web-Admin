import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXwbpmnG5pTpQrxKsM6EAe6YPPRooo9So",
  authDomain: "myedu-d90cd.firebaseapp.com",
  projectId: "myedu-d90cd",
  storageBucket: "myedu-d90cd.appspot.com",
  messagingSenderId: "1078584898104",
  appId: "1:1078584898104:web:abcd1234efgh5678",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
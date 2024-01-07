import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'
// import { getAuth } from 'firebase/auth';



const firebaseConfig = {
    apiKey: "AIzaSyABZOA8qx3lXr7Z2POXoPaT-pToiXvVEfc",
    authDomain: "notas-307ba.firebaseapp.com",
    projectId: "notas-307ba",
    storageBucket: "notas-307ba.appspot.com",
    messagingSenderId: "558524290384",
    appId: "1:558524290384:web:9eb7b1df7b7b0921df8855"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export { db };




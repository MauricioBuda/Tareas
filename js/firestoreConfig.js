import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'
// import { getAuth } from 'firebase/auth';



const firebaseConfig = {
    apiKey: "AIzaSyAtncuSygg7ItrzkFxphN35TefDmSuMgDQ",
    authDomain: "proyectotareas-b5dfc.firebaseapp.com",
    projectId: "proyectotareas-b5dfc",
    storageBucket: "proyectotareas-b5dfc.appspot.com",
    messagingSenderId: "662589482589",
    appId: "1:662589482589:web:54a114a005e36e992d0fb4"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export { db };




import { initializeApp, getApps } from "firebase/app";
import {
    getFirestore,
    collection,
    addDoc,
    setDoc,
    doc,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy,
} from "firebase/firestore";
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    updatePassword,
    deleteUser,
    signOut,
} from "firebase/auth";
import { getDatabase, ref, onValue, set } from "firebase/database";
// import { getDoc } from 'firebase/firestore'
const firebaseConfig = {
    apiKey: "AIzaSyD2c5D7MtdLHYcTQpm2GJsDb2PY36lGmss",
    authDomain: "sniiz-sendr.firebaseapp.com",
    databaseURL: "https://sniiz-sendr-default-rtdb.firebaseio.com",
    projectId: "sniiz-sendr",
    storageBucket: "sniiz-sendr.appspot.com",
    messagingSenderId: "762806681066",
    appId: "1:762806681066:web:90d314bbed15da56cb8693",
};
if (!getApps().length) initializeApp(firebaseConfig);
export {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    updatePassword,
    signOut,
    collection,
    addDoc,
    getFirestore,
    onSnapshot,
    serverTimestamp,
    query,
    orderBy,
    getDatabase,
    ref,
    onValue,
    set,
    setDoc,
    doc,
    deleteUser,
};

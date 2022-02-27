import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";

const firebaseConfig = {
    apiKey: "AIzaSyD2c5D7MtdLHYcTQpm2GJsDb2PY36lGmss",
    authDomain: "sniiz-sendr.firebaseapp.com",
    projectId: "sniiz-sendr",
    storageBucket: "sniiz-sendr.appspot.com",
    messagingSenderId: "762806681066",
    appId: "1:762806681066:web:b8f9f8f8f9f8f8f8",
    databaseURL: Constants.manifest.extra.databaseURL,
};

initializeApp(firebaseConfig);

export const auth = getAuth();
export const database = getFirestore();

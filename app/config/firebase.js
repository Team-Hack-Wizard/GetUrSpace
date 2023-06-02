import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
// may be do if else statement to give different info based on ios or android
// or separate the files and pass in to app.js differently or something
const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

// persist auth state with AsyncStorage from react-native-community
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });
// for ease of testing, we will not use presistence
const auth = getAuth(app);

export { auth, db };

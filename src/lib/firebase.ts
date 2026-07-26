import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Get Firestore database with specific databaseId if present
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const auth = getAuth(app);

// Authenticate anonymously for secure rule evaluation
signInAnonymously(auth).catch((err) => {
  console.warn('Firebase anonymous auth warning:', err);
});

export { collection, onSnapshot, addDoc, deleteDoc, doc, setDoc };

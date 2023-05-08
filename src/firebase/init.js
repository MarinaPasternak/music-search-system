import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc, getDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_FIREBASE_APP_ID,
    measurementId: process.env.VUE_APP_FIREBASE_MEASURMENT_ID
};

const app = initializeApp(firebaseConfig);

export const firebaseStore = getFirestore(app);

export const auth = getAuth();

export const user = auth.currentUser ? auth.currentUser : { uid: 'anonymous' };
export let userId = user.uid;

export const likedSongsAll = collection(firebaseStore, 'likedSongs');
export let likedSongsByUserRef = doc(firebaseStore, "likedSongs", userId);

export function updateUserId(newUserId) {
    userId = newUserId;
    likedSongsByUserRef = doc(firebaseStore, "likedSongs", userId);
}

export async function isSongLiked(songTitle, artistName) {
    const song = `${songTitle}~${artistName}`;
    const doc = await getDoc(likedSongsByUserRef);
  
    if (doc.exists()) {
      const likedSongsByUser = doc.data().AllLikedSongs;
      return likedSongsByUser.includes(song);
    }
    return false;
  }

export async function addSongToLikedSongs(songTitle, artistName) {
    const song = `${songTitle}~${artistName}`;
    const doc = await getDoc(likedSongsByUserRef);
    if (doc.exists()) {
      const likedSongsByUser = doc.data().AllLikedSongs;
      likedSongsByUser.push(song);
      await setDoc(likedSongsByUserRef, { AllLikedSongs: likedSongsByUser });
    } else {
      await setDoc(likedSongsByUserRef, { AllLikedSongs: [song] });
    }
  }


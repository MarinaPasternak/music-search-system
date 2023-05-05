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
    console.log(userId);
}

console.log(userId);

export async function addSongToLikedSongs(songTitle, artistName) {

    let likedSongsByUser = [];
    if ((await getDoc(likedSongsByUserRef)).data()) {
        likedSongsByUser = (await getDoc(likedSongsByUserRef)).data().AllLikedSongs;
    }

  // Add the new song to the array
  likedSongsByUser.push(`${songTitle}~${artistName}`);

  // Update the document with the new array
  await setDoc(likedSongsByUserRef, { AllLikedSongs: likedSongsByUser });
}

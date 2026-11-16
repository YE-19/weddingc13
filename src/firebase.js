import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// إعدادات فايربيز الخاصة بمشروعك
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB6gTO2IUy8RjVBClnEGNh6iQWhid-fUKY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "weddindc13.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "weddindc13",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "weddindc13.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "315593114956",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:315593114956:web:640deaac3d8ff9bc2cbbe9",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HNC053WYK9",
};

// التحقق من وجود الإعدادات
export const isFirebaseConfigured = () => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
};

// تهيئة تطبيق فايربيز وقاعدة بيانات Firestore
let app = null;
let db = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (err) {
  console.error("Firebase init error:", err);
}

/**
 * حفظ تهنئة جديدة في فايربيز
 */
export async function addGuestWish({ name, message }) {
  if (!db) {
    throw new Error("Firebase Firestore is not initialized");
  }

  const wishesRef = collection(db, "wishes");
  const docRef = await addDoc(wishesRef, {
    name: name.trim(),
    message: message.trim(),
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * الاستماع المباشر للتهاني في الوقت الفعلي (Real-time) لجميع الأجهزة
 */
export function subscribeToGuestWishes(onWishesUpdate, onError) {
  if (!db) {
    return () => {};
  }

  try {
    const wishesQuery = query(collection(db, "wishes"), orderBy("createdAt", "desc"));

    return onSnapshot(
      wishesQuery,
      (snapshot) => {
        const wishes = snapshot.docs.map((doc) => {
          const data = doc.data();
          let formattedTime = "منذ قليل";
          if (data.createdAt?.toDate) {
            const date = data.createdAt.toDate();
            formattedTime = date.toLocaleDateString("ar-EG", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
          }
          return {
            id: doc.id,
            name: data.name,
            wishes: data.message,
            timestamp: formattedTime,
          };
        });
        onWishesUpdate(wishes);
      },
      (error) => {
        console.warn("Firestore onSnapshot error:", error);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn("Error setting up Firestore listener:", err);
    return () => {};
  }
}

export { app, db };

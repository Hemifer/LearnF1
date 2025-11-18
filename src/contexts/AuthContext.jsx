// src/contexts/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
  onSnapshot,
  getDoc
} from "firebase/firestore";

const AuthContext = createContext();

// ✅ Hook (must be top-level stable function)
export function useAuth() {
  return useContext(AuthContext);
}

// ✅ Provider (must be top-level stable function)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- FAVORITE HELPERS ---
  const addFavorite = async (topicId) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), {
      favorites: arrayUnion(topicId),
    });
  };

  const removeFavorite = async (topicId) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), {
      favorites: arrayRemove(topicId),
    });
  };

  const toggleFavorite = async (topicId) => {
    if (!userData) return;

    const isFav = userData.favorites?.includes(topicId);

    if (isFav) {
      await removeFavorite(topicId);
    } else {
      await addFavorite(topicId);
    }
  };

  const isFavorite = (topicId) =>
    userData?.favorites?.includes(topicId) ?? false;

  // --- AUTH + USER DOC LISTENERS ---
  useEffect(() => {
    let unsubscribeUserDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const ref = doc(db, "users", currentUser.uid);

        // Real-time Firestore sync
        unsubscribeUserDoc = onSnapshot(ref, (snapshot) => {
          setUserData({ uid: currentUser.uid, ...snapshot.data() });
        });
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUserDoc) unsubscribeUserDoc();
    };
  }, []);

  const logout = () => signOut(auth);

  // --- CONTEXT VALUE ---
  const value = {
    user,
    userData,
    logout,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

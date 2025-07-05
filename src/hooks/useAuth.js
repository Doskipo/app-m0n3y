import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function useAuth() {
  const [user, setUser] = useState(undefined); // undefined = carregant, null = no autenticat

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return user;
}

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function PrivateRoute({ children }) {
  const [user, setUser] = useState(undefined);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  if (user === undefined) return null; // opcional: pantalla de càrrega

  return user ? children : <Navigate to="/login" />;
}

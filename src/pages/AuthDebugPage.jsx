import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut, signInAnonymously } from "firebase/auth";
import { Link } from "react-router-dom";

export default function AuthDebugPage() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
    });
    return () => unsubscribe();
  }, []);

  const handleAnonLogin = async () => {
    const auth = getAuth();
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Error iniciant sessió anònimament:", error);
    }
  };

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  if (user === undefined) return <p className="p-4">Carregant usuari...</p>;

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">🔐 Pàgina de debug d'autenticació</h1>

      <div className="bg-gray-100 p-4 rounded shadow text-sm">
        {user ? (
          <>
            <p><strong>UID:</strong> {user.uid}</p>
            <p><strong>Email:</strong> {user.email || "(Anònim)"}</p>
            <p><strong>Anonymous:</strong> {user.isAnonymous ? "Sí" : "No"}</p>
          </>
        ) : (
          <p className="text-red-600">No hi ha cap usuari loguejat.</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleAnonLogin}
          className="flex-1 bg-blue-600 text-white py-2 rounded"
        >
          Iniciar sessió com a convidat
        </button>
        <button
          onClick={handleLogout}
          className="flex-1 bg-red-600 text-white py-2 rounded"
        >
          Tancar sessió
        </button>
      </div>

      <Link
        to="/"
        className="block text-center text-blue-600 underline mt-4"
      >
        ← Tornar a l'inici
      </Link>
    </div>
  );
}

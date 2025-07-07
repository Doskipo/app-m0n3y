import { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  linkWithCredential,
  EmailAuthProvider
} from "firebase/auth";
import useAuth from "../hooks/useAuth";

export default function AuthModal({ open, onClose }) {
  const { user } = useAuth();
  const auth = getAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async () => {
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        } else {
        if (user?.isAnonymous) {
            const credential = EmailAuthProvider.credential(email, password);
            await linkWithCredential(user, credential);
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
        }
        }

      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-center">Configuració d'usuari</h2>

        {user && !user.isAnonymous ? (
          <div className="text-center space-y-4">
            <p className="text-gray-700 dark:text-gray-200">Sessió iniciada com:</p>
            <p className="font-medium">{user.email}</p>
            <button onClick={handleLogout} className="w-full bg-red-600 text-white py-2 rounded">Tancar sessió</button>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Contrasenya"
              className="w-full p-2 border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button onClick={handleAuth} className="w-full bg-green-600 text-white py-2 rounded">
              {isLogin ? "Iniciar sessió" : "Registrar-se"}
            </button>
            <button onClick={() => setIsLogin(!isLogin)} className="w-full text-sm text-gray-500 hover:underline">
              {isLogin ? "Crear un compte nou" : "Ja tens un compte? Inicia sessió"}
            </button>
          </div>
        )}

        <button onClick={onClose} className="mt-4 text-sm text-gray-500 hover:underline block w-full text-center">
          Tancar
        </button>
      </div>
    </div>
  );
}

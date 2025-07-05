import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError("Credencials incorrectes o compte inexistent.");
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 pt-24 text-center">
      <h1 className="text-2xl font-bold mb-4">Iniciar sessió</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Correu electrònic"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          required
        />
        <input
          type="password"
          placeholder="Contrasenya"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}

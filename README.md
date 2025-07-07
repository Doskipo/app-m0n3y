# 🧾 necse — Web-app de finances personals

**necse** és una aplicació web per gestionar les teves finances personals, on pots registrar guanys, despeses, i organitzar-les per categories i subcategories. Ha estat desenvolupada amb **React**, **Firebase**, **TailwindCSS** i **Recharts**, i es desplega automàticament a Firebase Hosting mitjançant **GitHub Actions**.

---

## 🛠️ Tecnologies utilitzades

- [React](https://react.dev)
- [Firebase (Auth + Firestore)](https://firebase.google.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [GitHub Actions](https://github.com/features/actions)

---

## ✅ Funcionalitats actuals

### 📦 Backend / sincronització
- Sincronització completa amb **Firestore**
- Dades emmagatzemades sota `users/{uid}/expenses`, `earnings`, `categories`
- Eliminació total de `localStorage` → ús exclusiu de Firestore

### 💡 Experiència d’usuari
- Tema **clar/fosc** amb commutador persistent
- **Pantalla de càrrega** moderna
- Confirmacions visuals amb `ConfirmDialog`
- Formularis per afegir **despeses** i **guanys**
- Gestor de **categories** i **subcategories**

### 📊 Visualització
- `SummaryPage`: resum del mes actual o seleccionat
- **Gràfic de pastís** amb percentatges per categoria
- `RecapPage`: taula amb el resum **anual**
- `SummaryDetailPage`: detalls d’un mes concret

### 👤 Autenticació
- Login, registre i logout amb **Firebase Auth**
- Hook `useAuth()` centralitzat
- `AuthDebugPage` per proves de sessió
- Control de sessió des del menú ⚙️

### 🌐 Altres
- Navegació per mesos i anys amb **React Router**
- **Deploy automàtic** mitjançant GitHub → Firebase Hosting

---

## 🎯 Objectius actuals

- ✅ Separar dades per usuari (implementat)
- 🟡 Fer que per defecte l’usuari sigui “invitado” (sessió anònima)
- 🟡 Permetre login/registre des del menú ⚙️
- 🟡 Mostrar/ocultar funcionalitats segons si l’usuari és anònim o registrat

---

## 🔒 Notes de privadesa

Les dades dels usuaris s’emmagatzemen únicament sota el seu `uid` a Firestore. Cap informació es comparteix entre comptes. En mode anònim, les dades es mantenen separades fins que es perd la sessió.

---

## 🚀 Desplegament

El desplegament és automàtic via [GitHub Actions](https://github.com/features/actions), amb pujada directa a [Firebase Hosting](https://firebase.google.com/products/hosting).

---

## 🔧 Desenvolupament

En desenvolupament actiu. Nous objectius inclouen:
- Gestió avançada d’usuaris
- Exportació de dades
- App nativa (o PWA)

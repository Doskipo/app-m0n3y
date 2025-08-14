  # 🧾 necse — Web-app de finances personals

  **necse** és una aplicació web per gestionar les teves finances personals, on pots registrar guanys, despeses, i organitzar-les per categories i subcategories. Ha estat desenvolupada amb **React**, **Firebase**, **TailwindCSS** i **Recharts**, i es desplega automàticament a Firebase Hosting mitjançant **GitHub Actions**.

  ---

  ## 🛠️ Tecnologies utilitzades

  - [React](https://react.dev)
  - [Firebase (Auth + Firestore)](https://firebase.google.com/)
  - [TailwindCSS](https://tailwindcss.com/)
  - [Recharts](https://recharts.org/)
  - [GitHub Actions](https://github.com/features/actions)
  - [PWA Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

  ---

  ## ✅ Funcionalitats actuals

  ### 📦 Backend / sincronització
  - Sincronització completa amb **Firestore**
  - Totes les dades s’emmagatzemen sota la ruta `users/{uid}/...`
  - Eliminació total de `localStorage` → ús exclusiu de Firestore

  ### 👤 Autenticació i usuaris
  - **Login, registre i logout** amb Firebase Auth
  - Sessió **anònima** per defecte (usuari "invitado")
  - Persistència de dades entre sessió anònima i usuari registrat
  - `useAuth()` com a hook global
  - Menú ⚙️ per gestionar sessió
  - Mostra o oculta funcionalitats segons si l’usuari és anònim o registrat

  ### 💡 Experiència d’usuari
  - Tema **clar/fosc** amb commutador (🌙/☀️ amb icones personalitzades)
  - **Pantalla de càrrega** amb logo diferenciat per mode fosc/clar
  - Confirmacions visuals amb `ConfirmDialog` (substitueix `window.confirm`)
  - Gestor visual de **categories** i **subcategories**
  - Pestanyes de gestió estèticament coherents amb la resta de l'app

  ### 📊 Visualització
  - `SummaryPage`: resum del mes actual
  - `SummaryDetailPage`: detalls mensuals amb:
    - **Gràfic de pastís** per categories
    - Percentatges per categoria i subcategoria
  - `RecapPage`: taula amb el resum **anual** mes a mes
    - Botó "Deeply" per accedir al resum mensual

  ### 🧭 Navegació
  - Navegació per mesos i anys amb React Router
  - Botons “← Enrere” posicionats correctament sota el `Layout`

  ### 🌐 Altres
  - App instal·lable com a **PWA** (manifest i icons actualitzats)
  - Icones adaptades per a la pantalla d'inici del mòbil
  - Favicon i nom d'app actualitzats a **NECSE**

  ---

  ## 🎯 Objectius actuals

  - ✅ Separar dades per usuari (Firestore per UID)
  - ✅ Sessió anònima per defecte
  - ✅ Permetre login/registre des del menú ⚙️
  - ✅ Mostrar/ocultar funcionalitats segons l'usuari
  - 🟡 Millorar la bústia d'importació de transaccions
  - 🟡 Vinculació amb targetes de dèbit/crèdit (fase exploratòria)
  - 🟡 IA per classificació automàtica de transaccions (idea futura)

  ---

  ## 🔒 Notes de privadesa

  Les dades dels usuaris s’emmagatzemen exclusivament a `users/{uid}` dins Firestore. Cap informació es comparteix entre comptes. En mode anònim, les dades es conserven mentre duri la sessió.

  ---

  ## 🚀 Desplegament

  El desplegament és automàtic via GitHub → Firebase Hosting gràcies a **GitHub Actions**. El projecte és una **Progressive Web App (PWA)** que pot instal·lar-se al mòbil.

  ---

  ## 🔧 Desenvolupament

  Projecte en desenvolupament actiu. Noves funcionalitats planejades:
  - Gestió avançada d’usuaris
  - Bústia d’importacions des de targeta bancària
  - IA per reconeixement automàtic
  - Exportació de dades
  - Aplicació nativa (futur)

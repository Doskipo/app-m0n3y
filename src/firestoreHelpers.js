import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

/**
 * Llegeix totes les despeses de l'usuari
 */
export const getAllExpenses = async (uid) => {
  const snapshot = await getDocs(collection(db, `users/${uid}/expenses`));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Llegeix totes les categories de l'usuari
 */
export const getAllCategories = async (uid) => {
  const snapshot = await getDocs(collection(db, `users/${uid}/categories`));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Llegeix tots els guanys de l'usuari
 */
export const getAllEarnings = async (uid) => {
  const snapshot = await getDocs(collection(db, `users/${uid}/earnings`));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Llegeix despeses per any i mes de l'usuari
 */
export const getExpensesByMonth = async (uid, year, month) => {
  const all = await getAllExpenses(uid);
  return all.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
};

/**
 * Llegeix guanys per any i mes de l'usuari
 */
export const getEarningsByMonth = async (uid, year, month) => {
  const all = await getAllEarnings(uid);
  return all.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
};

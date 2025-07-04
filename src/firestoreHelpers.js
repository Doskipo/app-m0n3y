import { db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

/**
 * Llegeix totes les despeses
 */
export const getAllExpenses = async () => {
  const snapshot = await getDocs(collection(db, "expenses"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Llegeix totes les categories
 */
export const getAllCategories = async () => {
  const snapshot = await getDocs(collection(db, "categories"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Llegeix tots els guanys
 */
export const getAllEarnings = async () => {
  const snapshot = await getDocs(collection(db, "earnings"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Llegeix despeses per any i mes (format: YYYY i MM)
 */
export const getExpensesByMonth = async (year, month) => {
  const all = await getAllExpenses();
  return all.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
};

/**
 * Llegeix guanys per any i mes
 */
export const getEarningsByMonth = async (year, month) => {
  const all = await getAllEarnings();
  return all.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
};

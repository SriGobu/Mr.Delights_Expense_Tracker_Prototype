import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_BUDGETS, DEFAULT_CATEGORIES, EXTRA_PALETTE, SEED_EXPENSES } from "../constants/appConstants";
import { useToast } from "./ToastContext";

const KEYS = {
  expenses: "mrd_expenses_v2",
  categories: "mrd_categories_v1",
  budgets: "mrd_budgets_v1",
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// Expenses saved before bills were removed still carry a `bill` field; drop it on load.
const withoutBill = (list) =>
  list.map((e) => {
    if (!("bill" in e)) return e;
    const next = { ...e };
    delete next.bill;
    return next;
  });

const ExpenseContext = createContext(null);

export function useExpenses() {
  return useContext(ExpenseContext);
}

export function ExpenseProvider({ children }) {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState(() => withoutBill(load(KEYS.expenses, SEED_EXPENSES)));
  const [categories, setCategories] = useState(() => load(KEYS.categories, DEFAULT_CATEGORIES));
  const [budgets, setBudgetsState] = useState(() => load(KEYS.budgets, DEFAULT_BUDGETS));

  useEffect(() => {
    if (!save(KEYS.expenses, expenses)) toast("Browser storage is full.", "error");
  }, [expenses, toast]);
  useEffect(() => {
    save(KEYS.categories, categories);
  }, [categories]);
  useEffect(() => {
    save(KEYS.budgets, budgets);
  }, [budgets]);

  const addExpense = useCallback((data) => {
    setExpenses((prev) => [{ ...data, id: Date.now() }, ...prev]);
  }, []);

  const updateExpense = useCallback((id, patch) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }, []);

  const deleteExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const addCategory = useCallback(
    (rawName) => {
      const name = rawName.trim();
      if (!name) return null;
      const existing = categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
      if (existing) return existing.name;
      const colors = EXTRA_PALETTE[(categories.length - DEFAULT_CATEGORIES.length) % EXTRA_PALETTE.length];
      setCategories((prev) => [...prev, { name, ...colors }]);
      return name;
    },
    [categories],
  );

  const setBudgets = useCallback((next) => setBudgetsState(next), []);

  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((c) => (map[c.name] = c));
    return map;
  }, [categories]);

  const value = { expenses, categories, categoryMap, budgets, addExpense, updateExpense, deleteExpense, addCategory, setBudgets };
  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}

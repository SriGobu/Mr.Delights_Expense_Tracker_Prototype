export const COMPANY = {
  NAME: "MR Delights",
  TAGLINE: "Expense Tracker",
};

// Same file the ERP Sidebar uses (public/logo.PNG)
export const LOGO_SRC = "/logo.PNG";

export const PAYMENT_METHODS = ["Cash", "UPI", "Card", "Bank Transfer"];

export const PAYMENT_COLORS = {
  Cash: "#b5813a",
  UPI: "#3d7a4f",
  Card: "#5b6fb5",
  "Bank Transfer": "#8b968f",
};

// bg/fg = pill colours (dark text on a light tint for readability), chart = chart colour
export const DEFAULT_CATEGORIES = [
  { name: "Products", bg: "#fbefc6", fg: "#6b4f0a", chart: "#d4af37" },
  { name: "Packaging Items", bg: "#d9ecf6", fg: "#1c5670", chart: "#5aa5c6" },
  { name: "Transportation", bg: "#dcf1e2", fg: "#1f5f37", chart: "#3d7a4f" },
  { name: "Salary/Labour", bg: "#e9defa", fg: "#52337a", chart: "#8e6bc2" },
  { name: "Rent & Utilities", bg: "#fbe0dc", fg: "#8a2f22", chart: "#d9695a" },
  { name: "Marketing", bg: "#fbdcea", fg: "#842b57", chart: "#d2689f" },
  { name: "Miscellaneous", bg: "#e6e9e6", fg: "#3d4741", chart: "#8b968f" },
];

// Used for categories the admin adds later
export const EXTRA_PALETTE = [
  { bg: "#ffe6cf", fg: "#8a4a0e", chart: "#e39a4b" },
  { bg: "#d6f1ee", fg: "#17605a", chart: "#3fb0a5" },
  { bg: "#e3e6fb", fg: "#34408f", chart: "#6f7fe0" },
  { bg: "#f1f1c9", fg: "#5d5d0e", chart: "#b9b92e" },
];

export const DEFAULT_BUDGETS = {
  Products: 18000,
  "Packaging Items": 5000,
  Transportation: 3000,
  "Rent & Utilities": 6000,
  Marketing: 4000,
};

export const BATCH = 20; // rows added each time the list is scrolled to the end

export const SEED_EXPENSES = [
  { id: 1, date: "2026-10-02", amount: 200, description: "PVC Shrink", category: "Packaging Items", payment: "UPI", vendor: "Packwell", notes: "" },
  { id: 2, date: "2026-10-02", amount: 10, description: "500g sample box", category: "Packaging Items", payment: "Cash", vendor: "Local supplier", notes: "" },
  { id: 3, date: "2026-10-02", amount: 300, description: "Fuel for Auto", category: "Transportation", payment: "Cash", vendor: "HP Fuel", notes: "" },
  { id: 4, date: "2026-10-02", amount: 870, description: "Mixed 8 Nuts (Ajwa)", category: "Products", payment: "UPI", vendor: "Ajwa Traders", notes: "" },
  { id: 5, date: "2026-09-30", amount: 853, description: "10 items (Arasi)", category: "Products", payment: "Bank Transfer", vendor: "Arasi Foods", notes: "" },
  { id: 6, date: "2026-10-05", amount: 965, description: "2 items (Ajwa)", category: "Products", payment: "Card", vendor: "Ajwa Traders", notes: "" },
  { id: 7, date: "2026-10-04", amount: 420, description: "Instagram promotion", category: "Marketing", payment: "Card", vendor: "Meta", notes: "" },
  { id: 8, date: "2026-10-03", amount: 540, description: "Store electricity", category: "Rent & Utilities", payment: "UPI", vendor: "KSEB", notes: "" },
  { id: 9, date: "2026-09-25", amount: 1250, description: "Cashew 5kg (bulk)", category: "Products", payment: "Bank Transfer", vendor: "Kollam Traders", notes: "" },
  { id: 10, date: "2026-09-18", amount: 380, description: "Zip pouches 200pcs", category: "Packaging Items", payment: "UPI", vendor: "Packwell", notes: "" },
  { id: 11, date: "2026-09-12", amount: 6000, description: "Shop rent – September", category: "Rent & Utilities", payment: "Bank Transfer", vendor: "Landlord", notes: "" },
  { id: 12, date: "2026-09-08", amount: 260, description: "Delivery auto charges", category: "Transportation", payment: "Cash", vendor: "Local auto", notes: "" },
];

import { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./components/Sidebar";
import AddExpense from "./pages/AddExpense";
import Dashboard from "./pages/Dashboard";

const TITLES = {
  "/expenses": ["Add Expense", "Record and manage your business spending"],
  "/dashboard": ["Expense Dashboard", "See where your money goes"],
};

export default function App() {
  // Start with the slim sidebar on smaller laptops / tablets
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 1100);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const [title, subtitle] = TITLES[pathname] || TITLES["/expenses"];

  return (
    <div className="flex min-h-screen">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        closeMobile={() => setMobileOpen(false)}
      />
      <main
        className={`min-w-0 flex-1 transition-[margin-left] duration-200 print:ml-0 ${collapsed ? "md:ml-16" : "md:ml-[210px]"}`}
      >
        <header className="sticky top-0 z-20 flex h-[54px] items-center gap-2.5 border-b border-line bg-cream/95 px-3 backdrop-blur-[10px] md:h-[60px] md:px-[22px] print:hidden">
          <button
            type="button"
            className="p-1 text-side md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-[19px] leading-tight font-normal text-accent md:text-[21px]">
              {title}
            </h1>
            <p className="mt-0.5 hidden text-[12.5px] text-muted md:block">
              {subtitle}
            </p>
          </div>
          <div className="rounded-full bg-side px-[13px] py-1.5 text-[12.5px] font-semibold text-white">
            Admin
          </div>
        </header>

        {/* Shared page wrapper: pages render only their own content */}
        <div className="mx-auto max-w-[1400px] px-3 pt-3 pb-9 md:px-[22px] md:pt-[18px] md:pb-11 print:p-0">
          <Routes>
            <Route path="/" element={<Navigate to="/expenses" replace />} />
            <Route path="/expenses" element={<AddExpense />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/expenses" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

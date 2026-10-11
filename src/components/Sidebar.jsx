import { NavLink } from "react-router-dom";
import { ChevronLeft, LayoutDashboard, Plus, X } from "lucide-react";
import { COMPANY } from "../constants/appConstants";
import Logo from "./Logo";

const NAV = [
  { to: "/expenses", label: "Add Expense", icon: Plus },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

// Desktop (md+): fixed sidebar, 210px or a 64px icon strip when collapsed.
// Phones: a drawer that slides in from the left (the "collapsed" setting is ignored there).
export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  closeMobile,
}) {
  const hideWhenCollapsed = collapsed ? "md:hidden" : "";

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[39] bg-[rgba(10,20,12,0.5)] md:hidden print:hidden"
          onClick={closeMobile}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[min(260px,82vw)] flex-col border-r border-white/5 bg-side text-white transition-[width,transform] duration-200 md:translate-x-0 print:hidden ${
          collapsed ? "md:w-16" : "md:w-[210px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className={`flex min-h-[76px] items-center gap-2.5 px-3 py-3.5 ${collapsed ? "md:justify-center md:px-0" : ""}`}
        >
          <Logo size={collapsed ? 40 : 52} />
          <div className={hideWhenCollapsed}>
            <div className="font-serif text-[17px] leading-[1.15] text-gold">
              {COMPANY.NAME}
            </div>
            <div className="mt-0.5 text-xs text-white/80">
              {COMPANY.TAGLINE}
            </div>
          </div>
          <button
            type="button"
            className="ml-auto p-1 text-white md:hidden"
            onClick={closeMobile}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-2.5 py-1.5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeMobile}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-[11px] rounded-[10px] border px-3 py-2.5 text-sm font-medium no-underline ${
                  collapsed ? "md:justify-center md:px-0" : ""
                } ${
                  isActive
                    ? "border-[rgba(110,186,133,0.45)] bg-brand-2/30 text-[#9be0b3]"
                    : "border-transparent text-white/85 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              <span className={hideWhenCollapsed}>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-2.5 pt-2.5 pb-4">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden w-full items-center justify-center gap-1.5 rounded-[10px] border border-white/20 bg-transparent p-2 text-[13px] text-white/80 hover:bg-white/10 hover:text-white md:flex"
          >
            <ChevronLeft size={18} className={collapsed ? "rotate-180" : ""} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

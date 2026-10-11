import { useExpenses } from "../context/ExpenseContext";

// Colours come from the stored category (admins can add new ones), so they stay inline styles.
export default function CategoryPill({ category, onClick, active = false }) {
  const { categoryMap } = useExpenses();
  const c = categoryMap[category] || { bg: "#e6e9e6", fg: "#3d4741" };
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`inline-block rounded-full border-0 px-2.5 py-[3px] text-xs font-bold whitespace-nowrap ${active ? "outline-2 outline-brand" : ""}`}
      style={{ background: c.bg, color: c.fg }}
    >
      {category}
    </Tag>
  );
}
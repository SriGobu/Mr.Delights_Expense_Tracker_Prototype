import { LayoutGrid, List } from "lucide-react";

const OPTIONS = [
  { id: "list", label: "List view", icon: List },
  { id: "grid", label: "Grid view", icon: LayoutGrid },
];

// Grid / list switch. Pair it with useViewMode + DataView.
export default function ViewToggle({ mode, onChange, className = "" }) {
  return (
    <div role="group" aria-label="Layout" className={`inline-flex gap-0.5 rounded-[10px] bg-[#ebe5d5] p-1 ${className}`}>
      {OPTIONS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          title={label}
          aria-label={label}
          aria-pressed={mode === id}
          onClick={() => onChange(id)}
          className={`grid size-8 place-items-center rounded-[7px] ${
            mode === id ? "bg-white text-brand shadow-[0_2px_6px_rgba(26,43,28,0.12)]" : "text-muted hover:bg-white/60"
          }`}
        >
          <Icon size={17} />
        </button>
      ))}
    </div>
  );
}
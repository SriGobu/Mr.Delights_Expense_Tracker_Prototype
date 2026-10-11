export default function Card({ as: Tag = "section", className = "", children, ...rest }) {
  return (
    <Tag className={`min-w-0 rounded-xl border border-line bg-paper shadow-card print:break-inside-avoid print:shadow-none ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

// Small gold label + serif title, with an optional right-hand slot (children).
export function CardHead({ eyebrow, title, className = "", children }) {
  return (
    <div className={`flex items-start justify-between gap-2.5 ${className}`}>
      <div className="min-w-0">
        {eyebrow && <span className="mb-0.5 block text-[11px] font-bold tracking-widest text-gold-dark uppercase">{eyebrow}</span>}
        <h2 className="font-serif text-lg leading-tight font-normal">{title}</h2>
      </div>
      {children}
    </div>
  );
}
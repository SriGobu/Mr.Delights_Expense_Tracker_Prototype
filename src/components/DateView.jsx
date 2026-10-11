const GRID_COLS = "@lg:grid-cols-2 @3xl:grid-cols-3 @6xl:grid-cols-4";

// Reusable grid / list renderer.
//   mode       "grid" | "list"  (from useViewMode)
//   items      array to show
//   getKey     (item) => unique key
//   renderCard (item) => node            used in grid mode
//   renderRow  (item, listCols) => node  used in list mode; put `listCols` on the row's grid
//   columns    [{ label, className? }]   list header (shown only when the area is wide)
//   listCols   e.g. "@3xl:grid-cols-[100px_1fr_90px]"  one template shared by header + rows
//   gridCols   optional override of the card-grid columns
//   empty      node shown when items is empty
// Layout reacts to the width of this block (container queries), so it behaves the
// same whether the sidebar is open or collapsed.
export default function DataView({
  mode,
  items,
  getKey,
  renderCard,
  renderRow,
  columns = [],
  listCols = "",
  gridCols = GRID_COLS,
  empty = null,
}) {
  if (!items.length) return empty;

  return (
    <div className="@container">
      {mode === "grid" ? (
        <ul className={`grid grid-cols-1 gap-3 p-3.5 ${gridCols}`}>
          {items.map((item) => (
            <li key={getKey(item)} className="min-w-0">
              {renderCard(item)}
            </li>
          ))}
        </ul>
      ) : (
        <div>
          {columns.length > 0 && (
            <div className={`hidden gap-3 border-b border-line bg-white px-5 py-2.5 text-[11.5px] font-bold tracking-wider text-muted uppercase @3xl:grid ${listCols}`}>
              {columns.map((c) => (
                <span key={c.label} className={c.className}>
                  {c.label}
                </span>
              ))}
            </div>
          )}
          <ul className="divide-y divide-[#efeade]">
            {items.map((item) => (
              <li key={getKey(item)}>{renderRow(item, listCols)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
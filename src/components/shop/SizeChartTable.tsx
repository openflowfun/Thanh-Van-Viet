import type { SizeChart } from "@/lib/size-charts";

export function SizeChartTable({ chart, compact = false }: { chart: SizeChart; compact?: boolean }) {
  return (
    <div>
      {!compact && <h3 className="display text-2xl">{chart.title}</h3>}
      <div className={`${compact ? "" : "mt-5"} -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0`} data-lenis-prevent>
        <table className="w-full min-w-[420px] border-collapse text-left text-sm">
          <caption className="sr-only">{chart.title} — measurements in centimetres</caption>
          <thead>
            <tr className="border-b border-ink">
              {chart.columns.map((c) => (
                <th key={c.key} scope="col" className="py-3 pr-4 text-[0.62rem] font-medium uppercase tracking-[0.2em]">
                  {c.label}
                  {c.key !== "size" && c.key !== "au" && <span className="ml-1 normal-case tracking-normal text-stone">{c.key === "weight" ? "kg" : "cm"}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((r) => (
              <tr key={r.size} className="border-b border-line">
                {chart.columns.map((c, i) =>
                  i === 0 ? (
                    <th key={c.key} scope="row" className="py-3 pr-4 font-medium">
                      {r[c.key]}
                    </th>
                  ) : (
                    <td key={c.key} className="py-3 pr-4 tabular-nums text-ink/80">
                      {r[c.key] ?? "—"}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-stone">{chart.note}</p>
    </div>
  );
}

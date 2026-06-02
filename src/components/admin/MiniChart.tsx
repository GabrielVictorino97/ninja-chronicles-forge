interface Point {
  date?: string;
  name?: string;
  rank?: string;
  value: number;
}

export function BarChart({ data, color = "var(--primary)" }: { data: Point[]; color?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-1 h-40">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div
            className="w-full rounded-t bg-primary/70 hover:bg-primary transition-all relative"
            style={{ height: `${(d.value / max) * 100}%`, background: color }}
            title={`${d.date ?? d.name ?? d.rank}: ${d.value}`}
          />
          <span className="text-[9px] text-muted-foreground truncate w-full text-center">
            {d.date ?? d.name ?? d.rank}
          </span>
        </div>
      ))}
    </div>
  );
}

export function LineChart({ data }: { data: Point[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const W = 100,
    H = 40;
  const pts = data
    .map((d, i) => `${(i / (data.length - 1)) * W},${H - (d.value / max) * H}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-40" preserveAspectRatio="none">
      <defs>
        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke="var(--primary)" strokeWidth="0.6" points={pts} />
      <polygon fill="url(#g1)" points={`0,${H} ${pts} ${W},${H}`} />
    </svg>
  );
}

export function DonutChart({ data }: { data: Point[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let acc = 0;
  const R = 16,
    C = 2 * Math.PI * R;
  const palette = [
    "#ef4444",
    "#3b82f6",
    "#a855f7",
    "#22c55e",
    "#eab308",
    "#14b8a6",
    "#f97316",
    "#ec4899",
  ];
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 40 40" className="w-32 h-32 -rotate-90">
        <circle cx="20" cy="20" r={R} fill="none" stroke="var(--muted)" strokeWidth="6" />
        {data.map((d, i) => {
          const len = (d.value / total) * C;
          const dash = `${len} ${C - len}`;
          const offset = -((acc / total) * C);
          acc += d.value;
          return (
            <circle
              key={i}
              cx="20"
              cy="20"
              r={R}
              fill="none"
              stroke={palette[i % palette.length]}
              strokeWidth="6"
              strokeDasharray={dash}
              strokeDashoffset={offset}
            />
          );
        })}
      </svg>
      <ul className="text-xs space-y-1 flex-1">
        {data.map((d, i) => (
          <li key={i} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-sm"
              style={{ background: palette[i % palette.length] }}
            />
            <span className="flex-1 truncate">{d.name ?? d.rank}</span>
            <span className="text-muted-foreground">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

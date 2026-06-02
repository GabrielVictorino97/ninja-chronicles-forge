import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode } from "react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  empty = "Sem registros",
}: {
  columns: Column<T>[];
  rows: T[];
  empty?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            {columns.map((c) => (
              <TableHead key={c.key} className={c.className}>
                {c.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-muted-foreground py-10"
              >
                {empty}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                {columns.map((c) => (
                  <TableCell key={c.key} className={c.className}>
                    {c.render ? c.render(row) : (row as Record<string, ReactNode>)[c.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function StatusPill({
  tone,
  children,
}: {
  tone: "success" | "danger" | "warn" | "info" | "muted";
  children: ReactNode;
}) {
  const toneCls: Record<string, string> = {
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    danger: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    warn: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    info: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    muted: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${toneCls[tone]}`}
    >
      {children}
    </span>
  );
}

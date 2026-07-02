import { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { ClientReport } from "@/lib/reports-admin.functions";

type Props = { reports: ClientReport[] };

export function ReportTrendsChart({ reports }: Props) {
  const data = useMemo(() => {
    return [...reports]
      .sort(
        (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime(),
      )
      .map((r) => ({
        month: new Date(r.month).toLocaleDateString(undefined, {
          month: "short",
          year: "2-digit",
        }),
        visitors: r.site_visitors,
        leads: r.leads_from_forms,
      }));
  }, [reports]);

  if (data.length < 2) {
    return (
      <p className="text-sm text-muted-foreground">
        Trend chart will appear once at least two monthly reports exist.
      </p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="left"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar
            yAxisId="left"
            dataKey="visitors"
            name="Site Visitors"
            fill="hsl(var(--brand))"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="leads"
            name="Leads Generated"
            stroke="hsl(var(--cta))"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "hsl(var(--cta))" }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

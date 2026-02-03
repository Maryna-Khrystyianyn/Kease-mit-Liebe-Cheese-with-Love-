"use client";

import { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Batch } from "@/types/global";
import { ChevronDown } from "lucide-react";

interface ChartDataEntry {
  name: string;
  weight: number;
}

// Hardcoded German labels for the chart as per user request
const GERMAN_MONTHS = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const CHART_TITLE = "Monatliche Käseproduktion";
const Y_AXIS_LABEL = "Gewicht (kg)";
const LOADING_TEXT = "Diagramm wird geladen...";
const YEAR_SELECT_LABEL = "Jahr auswählen:";

export default function UserProductionChart({ nickname }: { nickname: string }) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    async function fetchBatches() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/cheese-batches/user/${nickname}`);
        const data: Batch[] = await res.json();
        setBatches(data);
      } catch (error) {
        console.error("Failed to fetch batches for chart:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBatches();
  }, [nickname]);

  // Extract available years from batches
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    years.add(new Date().getFullYear()); // Always include current year
    
    batches.forEach(batch => {
      if (batch.createdAt) {
        years.add(new Date(batch.createdAt).getFullYear());
      }
    });
    
    return Array.from(years).sort((a, b) => b - a); // Sort descending
  }, [batches]);

  // Process data for the selected year
  const chartData = useMemo(() => {
    const monthlyStats: Record<number, number> = {};
    
    // Initialize months
    for (let i = 0; i < 12; i++) {
        monthlyStats[i] = 0;
    }

    batches.forEach((batch) => {
      if (batch.createdAt) {
        const date = new Date(batch.createdAt);
        if (date.getFullYear() === selectedYear) {
          const month = date.getMonth();
          monthlyStats[month] += batch.cheeseWeight || 0;
        }
      }
    });

    return GERMAN_MONTHS.map((name, index) => ({
      name,
      weight: Number(monthlyStats[index].toFixed(2)),
    }));
  }, [batches, selectedYear]);

  if (loading) {
    return <div className="h-64 flex items-center justify-center text-(--olive_dark)">{LOADING_TEXT}</div>;
  }

  const hasAnyData = batches.length > 0;

  if (!hasAnyData) {
    return null;
  }

  return (
    <div className="bg-(--bg) p-6 rounded-2xl shadow-lg border border-(--gray) mt-8 transition-all hover:shadow-xl mb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h3 className="text-2xl font-bold text-(--olive_dark) tracking-tight">{CHART_TITLE}</h3>
        
        <div className="flex items-center gap-3">
          <label htmlFor="year-select" className="text-sm font-medium text-gray-500 whitespace-nowrap">
            {YEAR_SELECT_LABEL}
          </label>
          <div className="relative group">
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-(--olive_bright) focus:border-transparent transition-all cursor-pointer font-semibold"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-(--olive_bright) transition-colors" size={18} />
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%" >
          <BarChart  data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F3F4F6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 13, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 13, fontWeight: 500 }}
              dx={-5}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(151, 161, 99, 0.05)', radius: 4 }}
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                padding: '12px',
                backgroundColor: 'white'
              }}
              labelStyle={{ fontWeight: 700, color: 'var(--olive_dark)', marginBottom: '4px' }}
              itemStyle={{ fontWeight: 600, color: 'var(--olive_bright)' }}
              formatter={(value: number) => [`${value} kg`, Y_AXIS_LABEL]}
            />
            <Bar dataKey="weight" radius={[6, 6, 0, 0]} barSize={32}>
              {chartData.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={entry.weight > 0 ? "var(--olive_bright)" : "rgba(229, 231, 235, 0.5)"} 
                    className="transition-all hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {!chartData.some(d => d.weight > 0) && (
        <div className="text-center py-4 text-gray-400 italic text-sm">
          Keine Produktion für das Jahr {selectedYear} gefunden.
        </div>
      )}
    </div>
  );
}

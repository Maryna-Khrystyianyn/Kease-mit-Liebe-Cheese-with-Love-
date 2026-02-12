
import dayjs from "dayjs";
 

type TimelineBatch = {
    id: number;
    recipeName: string;
    createdAt: string;
    readyAt: string; 
  };

type MonthGroup = {
  monthKey: string;      
  monthLabel: string;    
  items: TimelineBatch[];
};

export function groupBatchesByReadyMonth(batches: TimelineBatch[]): MonthGroup[] {
  const sorted = [...batches].sort(
    (a, b) => dayjs(a.readyAt).unix() - dayjs(b.readyAt).unix()
  );

  const map = new Map<string, MonthGroup>();

  for (const batch of sorted) {
    const d = dayjs(batch.readyAt);
    const key = d.format("YYYY-MM");

    if (!map.has(key)) {
      map.set(key, {
        monthKey: key,
        monthLabel: d.format("MMMM YYYY"), 
        items: [],
      });
    }

    map.get(key)!.items.push(batch);
  }

  return Array.from(map.values());
}
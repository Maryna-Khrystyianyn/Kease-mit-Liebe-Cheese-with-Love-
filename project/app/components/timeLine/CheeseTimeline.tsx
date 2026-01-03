import { useEffect, useRef, useState } from "react";
import { Timeline } from "vis-timeline";
import { DataSet } from "vis-data";
import { useRouter } from "next/navigation";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";

type TimelineBatch = {
  id: number;
  recipeName: string;
  createdAt: string;
  readyAt: string;
};

type Props = {
  batches: TimelineBatch[];
  onHide: (id: number) => void; // функція, яка оновлює onTimeLine=false
};

export default function CheeseTimeline({ batches, onHide }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const router = useRouter();

  useEffect(() => {
    if (!containerRef.current) return;
    const recipeGroups = Array.from(new Set(batches.map((b) => b.recipeName)));

    // Групи + підгрупи
    const groups = new DataSet([
      // Основні групи — рецепти
      ...recipeGroups.map((name) => ({
        id: name,
        content: name,
        nestedGroups: batches
          .filter((b) => b.recipeName === name)
          .map((b) => `batch-${b.id}`),
      })),
      // Підгрупи — окремі партії
      ...batches.map((b) => ({
        id: `batch-${b.id}`,
        content: `Charge #${b.createdAt.slice(0, 10)}`,
      })),
    ]);

    const items = new DataSet(
      batches.flatMap((b) => [
        {
          id: `${b.id}-aging`,
          group: `batch-${b.id}`,
          start: b.createdAt,
          end: b.readyAt,
          className: "aging",
          content: "Reifung",
        },
        {
          id: `${b.id}-ready`,
          group: `batch-${b.id}`,
          start: b.readyAt,
          end: new Date(), // наприклад поки що до сьогодні
          className: "ready",
          content: "Fertig",
        },
      ])
    );

    const timeline = new Timeline(containerRef.current, items, groups, {
      stack: false,
      zoomable: true,
      moveable: true,
      orientation: "top",
    });

    // 👉 RIGHT CLICK MENU
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    timeline.on("contextmenu", (props: any) => {
      props.event.preventDefault();
      if (!props.item || !containerRef.current) return;

      const rawId = props.item;
      const batchId = Number(String(rawId).split("-")[0]);

      const rect = containerRef.current.getBoundingClientRect();

      setSelectedBatch(batchId);
      setMenuPos({
        x: props.event.clientX - rect.left,
        y: props.event.clientY - rect.top,
      });
    });

    // ❌ закривати меню при кліку лівою кнопкою
    timeline.on("click", () => {
      setSelectedBatch(null);
    });

    return () => {
      timeline.destroy();
    };
  }, [batches]);

  return (
    <div className="relative w-full mb-20">
      {/* Timeline container */}
      <div ref={containerRef} />

      {/* Context menu */}
      {selectedBatch && (
        <div
          className="absolute bg-white shadow-xl rounded-lg p-3 z-50 border border-gray-200"
          style={{
            top: menuPos.y,
            left: menuPos.x,
          }}
        >
          <button
            className="block w-full text-left text-red-600 hover:underline"
            onClick={() => {
              onHide(selectedBatch);
              setSelectedBatch(null);
            }}
          >
            Nicht anzeigen
          </button>

          <button
            className="block w-full text-left text-(--olive_bright) hover:underline mt-2"
            onClick={() => {
              router.push(`/cheese-batches/${selectedBatch}`);
              setSelectedBatch(null);
            }}
          >
            Geh zur Käsecharge
          </button>

          <button
            className="block w-full text-left text-gray-500 hover:underline mt-2"
            onClick={() => setSelectedBatch(null)}
          >
            Schließen
          </button>
        </div>
      )}
    </div>
  );
}

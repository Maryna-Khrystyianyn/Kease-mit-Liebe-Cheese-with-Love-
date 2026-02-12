import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import dayjs from "dayjs";
import "dayjs/locale/de";

dayjs.locale("de");

/* ---------- TYPES ---------- */

type Batch = {
  id: number;
  recipeName: string;
  createdAt: string;
  readyAt: string;
};

type MonthGroup = {
  monthKey: string;
  monthLabel: string;
  items: Batch[];
};

/* ---------- COMPONENT ---------- */

export default function CheeseTimelineVertical({
  groups,
  onHide,
}: {
  groups: MonthGroup[];
  onHide: (id: number) => void;
}) {
  const router = useRouter();
  return (
    <ScrollView style={styles.container}>
      {groups.map((group, index) => (
        <View key={group.monthKey} style={styles.row}>
          {/* LEFT — month */}
          <View style={styles.left}>
            <Text style={styles.monthText}>{group.monthLabel}</Text>
          </View>

          {/* CENTER — line*/}
          <View style={styles.center}>
            <View style={styles.dot} />
            {index !== groups.length - 1 && <View style={styles.line} />}
          </View>

          {/* RIGHT - cheeses*/}
          <View style={styles.right}>
            {group.items.map((b) => (
              <TouchableOpacity 
                key={b.id} 
                style={styles.cheeseCard}
                onPress={() => router.push(`/cheese/${b.id}`)}
              >
                <Text style={styles.recipe}>🧀 {b.recipeName}</Text>
                <Text style={styles.dates}>
                  {dayjs(b.createdAt).format("DD.MM.YYYY")} →{" "}
                  {dayjs(b.readyAt).format("DD.MM.YYYY")}
                </Text>
                <Text style={styles.hideBtn} onPress={() => onHide(b.id)}>
                Nicht  zeigen
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

/* ---------- STYLES ---------- */

const OLIVE = "#7A8F2A";
const ORANGE = "#F5A623";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  /* ЛІВО — місяць */
  left: {
    width: 90,
    alignItems: "flex-end",
    paddingRight: 8,
  },

  monthText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
  },

  /* ЦЕНТР — лінія */
  center: {
    width: 30,
    alignItems: "center",
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: ORANGE,
    marginTop: 4,
  },

  line: {
    width: 2,
    flex: 1,
    backgroundColor: OLIVE,
    marginTop: 2,
  },

  /* ПРАВО — контент */
  right: {
    flex: 1,
    paddingBottom: 24,
  },

  cheeseCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },

  recipe: {
    fontSize: 15,
    fontWeight: "600",
  },

  dates: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  hideBtn: {
    marginTop: 6,
    fontSize: 13,
    color: "#7A8F2A",
    fontWeight: "600",
  },
});

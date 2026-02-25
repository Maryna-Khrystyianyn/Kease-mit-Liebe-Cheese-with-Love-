import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import dayjs from "dayjs";
import "dayjs/locale/de";
import { useColorScheme } from "nativewind";

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
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const OLIVE = "#7A8F2A";
  const ORANGE = "#F5A623";

  return (
    <ScrollView className="flex-1 py-4">
      {groups.map((group, index) => (
        <View key={group.monthKey} className="flex-row items-start">
          {/* LEFT — month */}
          <View className="w-[90px] items-end pr-2">
            <Text className={`text-sm font-semibold text-right ${isDark ? 'text-neutral-100' : 'text-textmain'}`}>
              {group.monthLabel}
            </Text>
          </View>

          {/* CENTER — line*/}
          <View className="w-[30px] items-center">
            <View 
              className="w-3 h-3 rounded-full mt-1" 
              style={{ backgroundColor: ORANGE }} 
            />
            {index !== groups.length - 1 && (
              <View 
                className="w-[2px] flex-1 mt-[2px]" 
                style={{ backgroundColor: OLIVE }} 
              />
            )}
          </View>

          {/* RIGHT - cheeses*/}
          <View className="flex-1 pb-6">
            {group.items.map((b) => (
              <TouchableOpacity 
                key={b.id} 
                className={`p-[10px] rounded-lg mb-2 shadow-sm ${isDark ? 'bg-neutral-800' : 'bg-white border border-neutral-100'}`}
                onPress={() => router.push(`/cheese/${b.id}`)}
              >
                <Text className={`text-[15px] font-semibold ${isDark ? 'text-neutral-100' : 'text-textmain'}`}>
                  🧀 {b.recipeName}
                </Text>
                <Text className={`text-xs mt-[2px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {dayjs(b.createdAt).format("DD.MM.YYYY")} →{" "}
                  {dayjs(b.readyAt).format("DD.MM.YYYY")}
                </Text>
                <Text 
                  className="mt-[6px] text-[13px] color-[#7A8F2A] font-semibold" 
                  onPress={() => onHide(b.id)}
                >
                  Nicht zeigen
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

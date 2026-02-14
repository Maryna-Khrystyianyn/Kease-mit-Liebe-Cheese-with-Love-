import { ScrollView, Pressable, Text, View, Linking } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { actions } from "@/constants/actions";

export default function HomeActions() {
  const router = useRouter();

  const handlePress = (action: typeof actions[0]) => {
    if (action.externalUrl) {
      // відкриваємо зовнішній веб-сайт
      Linking.openURL(action.externalUrl);
    } else if (action.route) {
      router.push(action.route as any);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-2 mt-4"
    >
      {actions.map((item) => (
        <Pressable
          key={item.label}
          onPress={() => handlePress(item)}
          className=" items-center"
        >
          <View className="w-16 h-16 rounded-full mx-4 bg-olive_bright items-center justify-center">
            <MaterialCommunityIcons name={item.icon as any} size={32} color="white" />
          </View>
          <Text className="text-[10px] font-bold text-center mt-2 w-20 text-textmain">
            {item.label}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

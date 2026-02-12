import React from "react";
import { View, Text } from "react-native";
import CheeseCard from "./CheeseCard";
import { useRouter } from "expo-router";

export default function CheeseRecommendations() {
  const router = useRouter();

  const cheeses = [
    { id: 1, title: "Feta", subtitle: "Einfach & schnell", image: require("../assets/feta.webp"), link: "/recipes/7" },
    { id: 2, title: "Caciotta", subtitle: "Mild & cremig", image: require("../assets/caciotta.jpg"), link: "/recipes/9" },
  ];

  return (
    <View className="mt-8">
      <Text className="text-xl font-bold text-textmain mb-4">
        Unsere Empfehlung für den Start:
      </Text>
      <View className="flex-row gap-4">
        {cheeses.map((cheese) => (
          <CheeseCard
            key={cheese.id}
            title={cheese.title}
            subtitle={cheese.subtitle}
            image={cheese.image}
            onPress={() => router.push(cheese.link as any)}
          />
        ))}
      </View>
    </View>
  );
}

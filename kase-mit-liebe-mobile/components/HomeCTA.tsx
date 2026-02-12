import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { useRouter } from "expo-router";

export default function HomeCTA() {
  const router = useRouter();
  const wiggleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = () => {
      Animated.sequence([
        Animated.timing(wiggleAnim, { toValue: 1.05, duration: 200, useNativeDriver: true }),
        Animated.timing(wiggleAnim, { toValue: 0.95, duration: 200, useNativeDriver: true }),
        Animated.timing(wiggleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(3000),
      ]).start(() => loop());
    };
    loop();
  }, []);

  return (
    <View className="mt-10 bg-olive_light/20 p-6 rounded-3xl border border-olive_bright/30">
      <Text className="text-2xl font-bold text-textmain mb-2">
        Bereit für deinen eigenen Käse?
      </Text>
      <Text className="text-textmain/70 mb-6 leading-5">
        Entdecke unsere Rezepte und wähle den ersten Käse, den du selbst herstellen möchtest.
        Wir begleiten dich Schritt für Schritt – mit guter Laune, kleinen Tipps und ganz viel Lust aufs Selbermachen.
      </Text>

      <View className="flex-row items-center justify-between">
        <Animated.View style={{ transform: [{ scale: wiggleAnim }] }}>
          <Pressable
            onPress={() => router.push("/recipes")}
            className="bg-olive_bright px-6 py-3 rounded-full shadow-md items-center justify-center"
            style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.95 : 1 }] })}
          >
            <Text className="text-white font-bold">Rezepte ansehen</Text>
          </Pressable>
        </Animated.View>

        <Pressable
          onPress={() => router.push("/cheese/new")}
          className="bg-orange-500/10 border border-orange-500 px-6 py-3 rounded-full items-center justify-center"
          style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.95 : 1 }] })}
        >
          <Text className="text-orange-600 font-bold">Neue Charge</Text>
        </Pressable>
      </View>
    </View>
  );
}

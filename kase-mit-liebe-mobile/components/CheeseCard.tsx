import React from "react";
import { Pressable, ImageBackground, View, Text } from "react-native";

interface Props {
  title: string;
  subtitle: string;
  image: any;
  onPress: () => void;
}

export default function CheeseCard({ title, subtitle, image, onPress }: Props) {
  return (
    <Pressable onPress={onPress} className="flex-1 rounded-2xl overflow-hidden border border-gray-100">
      <ImageBackground
        source={image}
        className="w-full h-36 justify-center"
        imageStyle={{ borderRadius: 16 }}
      >
        <View className="bg-white/85 p-2">
          <Text className="font-bold text-lg text-olive_bright text-center">{title}</Text>
          <Text className="text-[12px] text-gray-500 text-center">{subtitle}</Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

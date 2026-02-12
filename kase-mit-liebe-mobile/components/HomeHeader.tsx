import React from "react";
import { View, Image, Text } from "react-native";
import HomeActions from "./HomeActions";

export default function HomeHeader() {
  return (
    <View className="px-5 pt-5 pb-2.5">
      <View className="flex-row items-end justify-between">
        <View className="flex-row items-center space-x-2">
          <Image source={require("@/assets/logo.png")} className="w-14 h-14" />
          <Text className="font-bold text-[40px] pb-1 p-4 h-20 text-textmain">
            Tagebuch
          </Text>
        </View>
      </View>
      <HomeActions />
    </View>
  );
}

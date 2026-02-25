import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { useColorScheme } from "nativewind";
import { Sun, Moon } from "lucide-react-native";
import HomeActions from "./HomeActions";

export default function HomeHeader() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <View className="px-5 pt-5 pb-2.5">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center space-x-2">
          <Image source={require("@/assets/logo.png")} className="w-14 h-14" />
          <Text className="font-bold text-[40px] pb-1 p-4 h-20 text-textmain dark:text-neutral-100">
            Tagebuch
          </Text>
        </View>
        <TouchableOpacity 
          onPress={toggleColorScheme}
          className="p-2 mr-2 rounded-full bg-neutral-100 dark:bg-neutral-800"
        >
          {colorScheme === "dark" ? (
            <Sun size={24} color="#fcd34d" />
          ) : (
            <Moon size={24} color="#4b5563" />
          )}
        </TouchableOpacity>
      </View>
      <HomeActions />
    </View>
  );
}

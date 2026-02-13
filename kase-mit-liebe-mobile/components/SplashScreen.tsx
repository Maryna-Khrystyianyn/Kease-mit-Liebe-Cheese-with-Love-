// components/SplashScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Dimensions, Text, ActivityIndicator, Animated } from 'react-native';
import * as Progress from 'react-native-progress';

type SplashScreenProps = {
  onFinish: () => void;
};

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  
 const scaleAnim = useRef(new Animated.Value(1)).current;
   useEffect(() => {
    // infinite scale animation (breathing)
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
 

  return (
    <View className="flex-1 justify-center items-center bg-white">

      {/* Logo & Name */}
      <View className="flex-row items-center mb-10">
        <Image
          source={require("@/assets/logo.png")}
          className="w-[150px] h-[150px] m-5"
        />
        <View>
          <Text className="text-8xl font-bold text-textmain">Käse</Text>
          <Text className="text-6xl font-bold text-textmain">mit Liebe</Text>
        </View>
      </View>

      {/* Loading Spinner */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <ActivityIndicator size="large" color="#a8b6a6" />
      </Animated.View>
    </View>
  );
}

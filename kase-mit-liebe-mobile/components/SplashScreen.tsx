// components/SplashScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Image, Dimensions, Text } from 'react-native';
import * as Progress from 'react-native-progress';

type SplashScreenProps = {
  onFinish: () => void;
};

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 1) {
          clearInterval(interval);
          // додаткова затримка 1 секунда
          setTimeout(() => onFinish(), 1000);
          return 1;
        }
        return prev + 0.02;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">

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
      <Progress.Bar
        progress={progress}
        width={Dimensions.get('window').width * 0.8}
        height={20}
        color="#a8b6a6"
        style={{ marginTop: 20 }} 
      />
    </View>
  );
}
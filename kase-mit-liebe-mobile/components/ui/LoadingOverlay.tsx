import React from "react";
import { View, ActivityIndicator, StyleSheet, Modal } from "react-native";

interface LoadingOverlayProps {
  visible: boolean;
  color?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  visible, 
  color = "#e29b03" 
}) => {
  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={visible}
      statusBarTranslucent={true}
    >
      <View className="flex-1 bg-black/40 justify-center items-center">
        <View className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-xl">
          <ActivityIndicator size="large" color={color} />
        </View>
      </View>
    </Modal>
  );
};

import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type HeaderPageProps = {
  title: string;
  hasFilter?: boolean;
};

export const HeaderPage = ({ title, hasFilter }: HeaderPageProps) => {
  return (
    <View className="flex-row items-center justify-between w-full">
      <Text className="text-2xl font-poppins-bold text-white">| {title}</Text>
      {hasFilter && <Ionicons name="filter" size={24} color="black" />}
    </View>
  );
};

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

type HeaderPageProps = {
  title: string;
  hasBack?: boolean;
};

export const HeaderPage = ({ title, hasBack }: HeaderPageProps) => {
  const navigation = useNavigation();

  return (
    <View className="flex-row items-center justify-between w-full">
      {hasBack ? (
        <>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="flex-row items-center"
          >
            <Ionicons name="chevron-back" size={24} color="white" />
            <Text className="text-white ml-1">Voltar</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-poppins-bold text-white">{title}</Text>
        </>
      ) : (
        <Text className="text-2xl font-poppins-bold text-white">| {title}</Text>
      )}
    </View>
  );
};

import { View, Image, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export const Recomendation = ({
  title,
  image,
  onPress,
}: {
  title: string;
  image: string;
  onPress?: () => void;
}) => {
  const [hasError, setHasError] = useState(false);

  const renderPlaceholder = () => (
    <View className="w-[157px] h-[95px] rounded-xl bg-gray-200 items-center justify-center">
      <Ionicons name="image-outline" size={32} color="#666" />
      <Text className="text-gray-500 font-poppins-regular text-sm mt-1">
        {!image ? "Sem foto" : "Erro ao carregar"}
      </Text>
    </View>
  );

  return (
    <View className="items-center border border-[#E5E5E5] rounded-2xl pb-2 w-[157px] h-[138px]">
      <View className="relative">
        {image && !hasError ? (
          <Image
            source={{ uri: image }}
            className="w-[157px] h-[95px] rounded-xl"
            resizeMode="cover"
            onError={() => setHasError(true)}
          />
        ) : (
          renderPlaceholder()
        )}
        {onPress && (
          <TouchableOpacity
            className="absolute bottom-2 right-2 bg-secondary p-2 rounded-full"
            onPress={onPress}
          >
            <Ionicons name="play" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
      <Text
        className="text-primary font-poppins-regular text-lg mt-2"
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );
};

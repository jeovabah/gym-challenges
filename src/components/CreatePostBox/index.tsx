import { View, Text, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type CreatePostBoxProps = {
  onPress: () => void;
  userAvatar: string;
}

export function CreatePostBox({ onPress, userAvatar }: CreatePostBoxProps) {
  return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <View className="flex-row items-center">
        <Image 
          source={{ uri: userAvatar }}
          className="w-10 h-10 rounded-full"
        />
        <TouchableOpacity 
          onPress={onPress}
          className="flex-1 ml-3 bg-gray-100 rounded-full px-4 py-2"
        >
          <Text className="text-gray-500">No que você está pensando?</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row mt-4 pt-4 border-t border-gray-200">
        <TouchableOpacity 
          className="flex-1 flex-row items-center justify-center"
          onPress={onPress}
        >
          <MaterialIcons name="photo-library" size={22} color="#4CAF50" />
          <Text className="ml-2 text-gray-600">Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-1 flex-row items-center justify-center"
          onPress={onPress}
        >
          <MaterialIcons name="videocam" size={22} color="#F44336" />
          <Text className="ml-2 text-gray-600">Vídeo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-1 flex-row items-center justify-center"
          onPress={onPress}
        >
          <MaterialIcons name="event" size={22} color="#2196F3" />
          <Text className="ml-2 text-gray-600">Evento</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 
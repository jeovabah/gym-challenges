import { Challenge } from "@/api/challenges";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export const ChallengeCard = (item: Challenge) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return `${date.getDate()} de ${months[date.getMonth()]}`;
  };

  return (
    <TouchableOpacity className="flex-row bg-white shadow-lg rounded-[20px] p-4 mb-4">
      <View className="flex-1 pr-4">
        <View className="mb-2">
          <View className="bg-green-500 self-start px-2 py-1 rounded-full mb-1">
            <Text className="text-xs text-white font-poppins-regular">
              Ativo
            </Text>
          </View>
          <Text className="text-black font-poppins-bold text-lg">
            {item?.title}
          </Text>
        </View>

        <View className="mb-2">
          <Text className="text-gray-500 font-poppins-regular">2 Dias</Text>
        </View>

        <View className="flex-row items-center">
          <MaterialIcons name="group" size={16} color="#666" />
          <Text className="text-gray-600 ml-1 font-poppins-regular">
            {Array.isArray(item.participant_count)
              ? item.participant_count[0].count
              : item.participant_count}
            {item.max_participants && ` Participantes`}
          </Text>
        </View>
      </View>

      <View className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
        <Image
          source={{ uri: item?.image_url || "https://placeholder.com/150" }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );
};

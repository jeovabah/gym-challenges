import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/theme";
import { Recomendation } from "./recomendation";
import { getTrainners } from "@/api/trainners";
import { useEffect, useState } from "react";

export type Trainer = {
  id: string;
  name: string;
  photoLink: string;
  occupation: string;
};

export const Recomendations = () => {
  const [trainners, setTrainners] = useState<Trainer[]>([]);

  const fetchTrainners = async () => {
    try {
      const data = await getTrainners();
      setTrainners(data?.trainner || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTrainners();
  }, []);

  return (
    <View>
      <View className="flex-row justify-between items-center">
        <Text className="text-primary font-poppins-semibold text-lg">
          Recomendações
        </Text>
        <TouchableOpacity className="flex-row items-center gap-2">
          <Text className="text-primary font-poppins-semibold text-md">
            Ver todos
          </Text>
          <Ionicons
            name="chevron-forward-outline"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={trainners}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Recomendation
            title={item.name}
            image={item.photoLink}
            onPress={() => {}}
          />
        )}
        ItemSeparatorComponent={() => <View className="w-4" />}
        className="mt-4"
      />
    </View>
  );
};

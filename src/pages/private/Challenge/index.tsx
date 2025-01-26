import { HeaderPage } from "@/components/HeaderPage";
import {
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Button,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import {
  createChallenge,
  CreateChallengeInput,
  getChallenges,
} from "@/api/challenges";
import { Challenge as ChallengeProps } from "@/api/challenges";
import { ChallengeCard } from "@/components/Challenge/Card";

export const Challenge = () => {
  const [challenges, setChallenges] = useState<ChallengeProps[]>([]);
  const [loading, setLoading] = useState(true);

  const list = async () => {
    try {
      const response = await getChallenges();
      setChallenges(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    list();
  }, []);

  const createChallengeMock = async () => {
    const challenge = {
      title: "Desafio 1",
      type: "public",
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
      reward_points: 100,
      creator_id: "d6420acc-0673-413e-ad99-d76b88a51bdb",
    } as CreateChallengeInput;

    const response = await createChallenge(challenge);
    console.log(response);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background py-2">
        <View className="px-4 my-4">
          <HeaderPage title="Desafios" />
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background py-2">
      <View className="px-4 my-4">
        <HeaderPage title="Desafios" />
      </View>
      <View className="px-4 mb-4">
        <TouchableOpacity
          className="bg-secondary rounded-lg p-3 items-center"
          onPress={createChallengeMock}
        >
          <Text className="text-white font-poppins-regular">Criar desafio</Text>
        </TouchableOpacity>
      </View>
      <View className="px-4 flex-1">
        <FlatList
          data={challenges}
          renderItem={({ item }) => <ChallengeCard {...item} />}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <Text className="text-white text-center font-poppins-regular">
              Nenhum desafio encontrado
            </Text>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

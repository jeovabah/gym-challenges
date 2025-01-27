import { HeaderPage } from "@/components/HeaderPage";
import {
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import {
  createChallenge,
  CreateChallengeInput,
  getChallenges,
  Challenge as ChallengeType,
} from "@/api/challenges";
import { ChallengeCard } from "@/components/Challenge/Card";
import { useSession } from "@/providers/SessionProvider";

const TAB_BAR_HEIGHT = 64;

export const Challenge = () => {
  const [challenges, setChallenges] = useState<ChallengeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useSession();

  const list = async () => {
    try {
      const response = await getChallenges(user?.auth?.id);
      setChallenges(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await list();
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    list();
  }, []);

  const createChallengeMock = async () => {
    const challenge = {
      creator_id: user?.auth?.id || "",
      title: "Desafio de Supino",
      rules: "Complete 100kg em 10 repetições",
      start_date: "2025-01-01T00:00:00Z",
      end_date: "2025-01-10T23:59:59Z",
      reward_points: 100,
      type: "public",
      max_participants: 10,
      workout_type: "volume" as const,
      muscle_group: "Peito",
      image_url: "https://picsum.photos/200/300",
    } as CreateChallengeInput;

    try {
      const response = await createChallenge(challenge);
      setChallenges((prev) => [
        ...prev,
        { ...response, isParticipating: true },
      ]);
    } catch (error) {
      console.error(error);
    }
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
          renderItem={({ item }) => (
            <ChallengeCard
              key={item.id}
              updateFront={setChallenges}
              {...item}
            />
          )}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + 16 }}
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

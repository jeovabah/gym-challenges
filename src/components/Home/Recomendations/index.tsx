import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/theme";
import { Recomendation } from "./recomendation";
import { getGyms, getTrainners } from "@/api/trainners";
import { getChallenges } from "@/api/challenges";
import { useEffect, useState } from "react";
import { useActiveTab } from "../TabComponent/event";
import { navigate } from "@/routes/utils";

export type Trainer = {
  id: string;
  name: string;
  photoLink: string;
  occupation: string;
};

export type Gym = {
  id: string;
  name: string;
  logo: string;
  description: string;
  address: string;
  images: string[];
};

export const Recomendations = () => {
  const [trainners, setTrainners] = useState<Trainer[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const activeTab = useActiveTab();

  const fetchTrainners = async () => {
    try {
      const data = await getTrainners();
      setTrainners(data?.trainner || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchChallenges = async () => {
    try {
      const data = await getChallenges();
      setChallenges(data.slice(0, 2));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchGyms = async () => {
    try {
      const data = await getGyms();
      console.log(JSON.stringify(data, null, 2));
      setGyms(data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    switch (activeTab) {
      case "challenges":
        fetchChallenges();
        break;

      case "gyms":
        fetchGyms();
        break;

      default:
        fetchTrainners();
        break;
    }
  }, [activeTab]);

  const handleSeeAll = () => {
    if (activeTab === "challenges") {
      navigate("Challenge" as never);
    }
  };

  const getRenderData = () => {
    switch (activeTab) {
      case "challenges":
        return challenges;
      case "gyms":
        return gyms;
      default:
        return trainners;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case "challenges":
        return "Desafios";
      case "gyms":
        return "Academias";
      default:
        return "Recomendações";
    }
  };

  const renderData = getRenderData();
  const title = getTitle();

  return (
    <View>
      <View className="flex-row justify-between items-center">
        <Text className="text-primary font-poppins-semibold text-lg">
          {title}
        </Text>
        {activeTab === "challenges" && (
          <TouchableOpacity
            className="flex-row items-center gap-2"
            onPress={handleSeeAll}
          >
            <Text className="text-primary font-poppins-semibold text-md">
              Ver todos
            </Text>
            <Ionicons
              name="chevron-forward-outline"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={renderData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Recomendation
            title={activeTab === "challenges" ? item.title : item.name}
            image={
              activeTab === "challenges"
                ? item.image_url
                : activeTab === "gyms"
                ? item.logo
                : item.photoLink
            }
            onPress={() => {
              if (activeTab === "challenges") {
                navigate("ChallengeDetails" as never, {
                  challengeId: item.id,
                });
              }
              if (activeTab === "gyms") {
                navigate("GymDetails" as never, {
                  gym: item,
                });
              }
            }}
          />
        )}
        ItemSeparatorComponent={() => <View className="w-4" />}
        className="mt-4"
      />
    </View>
  );
};

import { View, Text, TouchableOpacity, Image } from "react-native";
import { useChallenges } from "../Recomendations/event";
import { navigate } from "@/routes/utils";

export const MainChallenge = () => {
  const challenges = useChallenges();

  const challenge = {
    title: "Premio Mensal",
    description: "Participe & Ganhe Brindes",
    image: challenges[0]?.image_url,
  };
  return (
    <>
      {!challenge ? (
        <TouchableOpacity className="bg-secondary px-4 py-[30px]">
          <View className="bg-background p-4 rounded-2xl">
            <View className="flex-row items-center justify-center">
              <Text className="text-white font-poppins-semibold text-xl">
                Veja os desafios do momento
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="bg-secondary px-4 py-[30px]"
          onPress={() => navigate("Challenge")}
        >
          <View className="bg-background p-4 rounded-2xl">
            <View className="flex-row items-center justify-between">
              <View className="flex-col">
                <Text className="text-tertiary font-poppins-semibold text-3xl">
                  {challenge.title}
                </Text>
                <Text className="text-white font-poppins-regular text-sm text-center">
                  {challenge.description}
                </Text>
              </View>
              <View>
                <Image
                  source={{
                    uri: challenge.image,
                  }}
                  className="rounded-[20px]"
                  width={130}
                  height={125}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

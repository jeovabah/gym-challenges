import { Challenge, joinChallenge } from "@/api/challenges";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSession } from "@/providers/SessionProvider";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { navigate } from "@/routes/utils";

type ChallengeCardProps = Challenge & {
  updateFront: Dispatch<SetStateAction<Challenge[]>>;
};

export const ChallengeCard = ({ updateFront, ...item }: ChallengeCardProps) => {
  const { user } = useSession();
  const [loading, setLoading] = useState(false);

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

  const isActive = () => {
    const end = new Date(item?.end_date);
    const today = new Date();
    return end >= today;
  };

  const getTimeRemaining = () => {
    const end = new Date(item?.end_date);
    const today = new Date();
    const diffDays = Math.ceil(
      (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
      return "Encerrado";
    } else if (diffDays === 0) {
      return "Termina hoje";
    } else if (diffDays === 1) {
      return "Termina amanhã";
    } else if (diffDays <= 7) {
      return `Termina em ${diffDays} dias`;
    } else {
      return `${formatDate(item?.start_date)} - ${formatDate(item?.end_date)}`;
    }
  };

  const handleJoinChallenge = async () => {
    Alert.alert(
      "Participar do Desafio",
      `Deseja participar do desafio "${item.title}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim, participar",
          onPress: async () => {
            try {
              if (!user?.auth?.id) return;
              setLoading(true);
              await joinChallenge(user.auth.id, item.id);
              updateFront((prevChallenges: any) =>
                prevChallenges.map((challenge: any) =>
                  challenge.id === item.id
                    ? { ...challenge, isParticipating: true }
                    : challenge
                )
              );
              Alert.alert("Sucesso", "Você entrou no desafio!");
            } catch (error: any) {
              Alert.alert("Erro", error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderRightActions = () => {
    if (item.isParticipating) return null;

    return (
      <TouchableOpacity
        className="bg-green-500 justify-center px-8 rounded-r-[20px]"
        onPress={handleJoinChallenge}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-poppins-bold">Participar</Text>
        )}
      </TouchableOpacity>
    );
  };

  const isMyChallenge = item.creator_id === user?.auth?.id;

  const handlePress = () => {
    navigate("ChallengeDetails", { challengeId: item.id });
  };

  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableOpacity
          className={`flex-row bg-white shadow-lg rounded-[20px] p-4 mb-4 ${
            isMyChallenge ? "border-2 border-secondary" : ""
          } ${item.isParticipating ? "border-2 border-green-500" : ""}`}
          onPress={handlePress}
        >
          <View className="flex-1 pr-4">
            <View className="mb-2">
              {item.status === "completed" ? (
                <View className="bg-red-500 self-start px-2 py-1 rounded-full mb-1">
                  <Text className="text-xs text-white font-poppins-regular">
                    Finalizado
                  </Text>
                </View>
              ) : isActive() ? (
                <View className="bg-green-500 self-start px-2 py-1 rounded-full mb-1">
                  <Text className="text-xs text-white font-poppins-regular">
                    {item.isParticipating ? "Participando" : "Ativo"}
                  </Text>
                </View>
              ) : (
                <View className="bg-red-500 self-start px-2 py-1 rounded-full mb-1">
                  <Text className="text-xs text-white font-poppins-regular">
                    Encerrado
                  </Text>
                </View>
              )}
              <View className="flex-row items-center">
                <Text className="text-black font-poppins-bold text-lg">
                  {item?.title}
                </Text>
                {isMyChallenge && (
                  <MaterialIcons
                    name="stars"
                    size={20}
                    color="#FFD700"
                    style={{ marginLeft: 8 }}
                  />
                )}
                {item.type === "private" && (
                  <View className="flex-row items-center ml-2">
                    <MaterialIcons name="lock" size={16} color="#666" />
                    <Text className="text-gray-600 ml-1 font-poppins-regular">
                      Privado
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View className="mb-2 flex-row items-center">
              <MaterialIcons
                name="calendar-today"
                size={16}
                color="#666"
                className="mr-1"
              />
              <Text className="text-gray-500 font-poppins-regular">
                {getTimeRemaining()}
              </Text>
            </View>

            <View className="flex-row items-center">
              <MaterialIcons name="group" size={16} color="#666" />
              <Text className="text-gray-600 ml-1 font-poppins-regular">
                {Array.isArray(item.participant_count)
                  ? item.participant_count[0].count
                  : item.participant_count}
                {item.max_participants
                  ? ` / ${item.max_participants} Participantes`
                  : " Participante(s)"}
              </Text>
            </View>
          </View>

          <View className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
            <Image
              source={{ uri: item?.image_url }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

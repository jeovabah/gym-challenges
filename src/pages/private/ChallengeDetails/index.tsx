import {
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Image,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import { useEffect, useCallback, useReducer, useState } from "react";
import {
  joinChallenge,
  registerWorkout,
  getChatMessages,
  sendMessageChallenge,
  Challenge as ChallengeType,
  showChallenge,
} from "@/api/challenges";
import { useSession } from "@/providers/SessionProvider";
import { HeaderPage } from "@/components/HeaderPage";
import { format, isAfter, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Camera, CameraView } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

type State = {
  challenge: ChallengeType | null;
  chatMessages: any[];
  loading: boolean;
  refreshing: boolean;
  message: string;
  workoutVolume: string;
  workoutImage: string;
  reps: string;
  sets: string;
  weight: string;
  showWorkoutInfo: boolean;
  hasWorkoutToday: boolean;
  todayWorkout: any;
  accessCode: string;
  savingWorkout: boolean;
  sendingMessage: boolean;
  loadingChat: boolean;
};

type Action =
  | { type: "SET_CHALLENGE"; payload: ChallengeType }
  | { type: "SET_CHAT_MESSAGES"; payload: any[] }
  | { type: "ADD_CHAT_MESSAGE"; payload: any }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_REFRESHING"; payload: boolean }
  | { type: "SET_MESSAGE"; payload: string }
  | { type: "SET_WORKOUT_VOLUME"; payload: string }
  | { type: "SET_WORKOUT_IMAGE"; payload: string }
  | { type: "SET_REPS"; payload: string }
  | { type: "SET_SETS"; payload: string }
  | { type: "SET_WEIGHT"; payload: string }
  | { type: "UPDATE_CHALLENGE_PARTICIPATION"; payload: boolean }
  | { type: "TOGGLE_WORKOUT_INFO" }
  | { type: "SET_HAS_WORKOUT_TODAY"; payload: boolean }
  | { type: "SET_TODAY_WORKOUT"; payload: any }
  | { type: "SET_ACCESS_CODE"; payload: string }
  | { type: "SET_SAVING_WORKOUT"; payload: boolean }
  | { type: "SET_SENDING_MESSAGE"; payload: boolean }
  | { type: "SET_LOADING_CHAT"; payload: boolean };

const initialState: State = {
  challenge: null,
  chatMessages: [],
  loading: true,
  refreshing: false,
  message: "",
  workoutVolume: "",
  workoutImage: "",
  reps: "",
  sets: "",
  weight: "",
  showWorkoutInfo: true,
  hasWorkoutToday: false,
  todayWorkout: null,
  accessCode: "",
  savingWorkout: false,
  sendingMessage: false,
  loadingChat: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_CHALLENGE":
      return { ...state, challenge: action.payload };
    case "SET_CHAT_MESSAGES":
      return { ...state, chatMessages: action.payload };
    case "ADD_CHAT_MESSAGE":
      return {
        ...state,
        chatMessages: [action.payload, ...state.chatMessages],
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_REFRESHING":
      return { ...state, refreshing: action.payload };
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "SET_WORKOUT_VOLUME":
      return { ...state, workoutVolume: action.payload };
    case "SET_WORKOUT_IMAGE":
      return { ...state, workoutImage: action.payload };
    case "SET_REPS":
      return { ...state, reps: action.payload };
    case "SET_SETS":
      return { ...state, sets: action.payload };
    case "SET_WEIGHT":
      return { ...state, weight: action.payload };
    case "UPDATE_CHALLENGE_PARTICIPATION":
      return {
        ...state,
        challenge: state.challenge
          ? { ...state.challenge, isParticipating: action.payload }
          : null,
      };
    case "TOGGLE_WORKOUT_INFO":
      return { ...state, showWorkoutInfo: !state.showWorkoutInfo };
    case "SET_HAS_WORKOUT_TODAY":
      return { ...state, hasWorkoutToday: action.payload };
    case "SET_TODAY_WORKOUT":
      return { ...state, todayWorkout: action.payload };
    case "SET_ACCESS_CODE":
      return { ...state, accessCode: action.payload };
    case "SET_SAVING_WORKOUT":
      return { ...state, savingWorkout: action.payload };
    case "SET_SENDING_MESSAGE":
      return { ...state, sendingMessage: action.payload };
    case "SET_LOADING_CHAT":
      return { ...state, loadingChat: action.payload };
    default:
      return state;
  }
}

export const ChallengeDetails = ({ route }: any) => {
  const { challengeId } = route.params;
  const { user } = useSession();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showChat, setShowChat] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraRef, setCameraRef] = useState<any>(null);
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);

  const calculateVolume = () => {
    const reps = parseInt(state.reps) || 0;
    const sets = parseInt(state.sets) || 0;
    const weight = parseInt(state.weight) || 0;
    const volume = reps * sets * weight;
    dispatch({ type: "SET_WORKOUT_VOLUME", payload: volume.toString() });
  };

  const takePhoto = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Erro", "Precisamos de permissão para acessar a câmera");
        return;
      }

      setShowCamera(true);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível acessar a câmera");
    }
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync();
        dispatch({ type: "SET_WORKOUT_IMAGE", payload: photo.uri });
        setShowCamera(false);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível tirar a foto");
      }
    }
  };

  const fetchDetails = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const challengeData = await showChallenge(challengeId, user?.auth?.id);
      dispatch({ type: "SET_CHALLENGE", payload: challengeData });

      const chat = await getChatMessages(challengeId);

      const today = new Date().toLocaleDateString();
      const todayWorkout = chat.find((message) => {
        const messageDate = new Date(
          message?.created_at || ""
        ).toLocaleDateString();
        return (
          messageDate === today &&
          message.workout_log &&
          message.user?.id === user?.auth?.id
        );
      });

      if (todayWorkout) {
        dispatch({ type: "SET_HAS_WORKOUT_TODAY", payload: true });
        dispatch({ type: "SET_TODAY_WORKOUT", payload: todayWorkout });
      }

      dispatch({ type: "SET_CHAT_MESSAGES", payload: chat });
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar os detalhes do desafio");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleJoinChallenge = async () => {
    try {
      if (state.challenge?.type == "private") {
        setShowAccessCodeModal(true);
        return;
      }

      await joinChallenge(user?.auth?.id || "", challengeId);
      dispatch({ type: "UPDATE_CHALLENGE_PARTICIPATION", payload: true });
      Alert.alert("Sucesso", "Você entrou no desafio!");
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  const handleJoinPrivateChallenge = async () => {
    try {
      await joinChallenge(user?.auth?.id || "", challengeId, state.accessCode);
      dispatch({ type: "UPDATE_CHALLENGE_PARTICIPATION", payload: true });
      setShowAccessCodeModal(false);
      Alert.alert("Sucesso", "Você entrou no desafio!");
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  const handleRegisterWorkout = async () => {
    try {
      if (!state.workoutVolume || !state.workoutImage) {
        Alert.alert(
          "Erro",
          "Preencha todos os campos e tire uma foto do treino!"
        );
        return;
      }

      if (state.hasWorkoutToday) {
        Alert.alert("Aviso", "Você já registrou um treino hoje!");
        return;
      }

      dispatch({ type: "SET_SAVING_WORKOUT", payload: true });

      await registerWorkout({
        user_id: user?.auth?.id || "",
        challenge_id: challengeId,
        muscle_group: state.challenge?.muscle_group!,
        volume: parseInt(state.workoutVolume, 10),
        image_url: state.workoutImage,
      });

      dispatch({ type: "SET_HAS_WORKOUT_TODAY", payload: true });
      Alert.alert("Sucesso", "Treino registrado com sucesso!");
      dispatch({ type: "SET_WORKOUT_VOLUME", payload: "" });
      dispatch({ type: "SET_WORKOUT_IMAGE", payload: "" });
      dispatch({ type: "SET_REPS", payload: "" });
      dispatch({ type: "SET_SETS", payload: "" });
      dispatch({ type: "SET_WEIGHT", payload: "" });

      fetchDetails();
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    } finally {
      dispatch({ type: "SET_SAVING_WORKOUT", payload: false });
    }
  };

  const handleSendMessage = async () => {
    try {
      if (!state.message) return;

      dispatch({ type: "SET_SENDING_MESSAGE", payload: true });

      const newMessage = {
        id: Date.now().toString(),
        message: state.message,
        user: {
          name: user?.auth?.user_metadata?.name,
        },
        created_at: new Date()?.toISOString(),
      };

      await sendMessageChallenge({
        user_id: user?.auth?.id || "",
        challenge_id: challengeId,
        message: state.message,
      });

      dispatch({ type: "ADD_CHAT_MESSAGE", payload: newMessage });
      dispatch({ type: "SET_MESSAGE", payload: "" });
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    } finally {
      dispatch({ type: "SET_SENDING_MESSAGE", payload: false });
    }
  };

  const fetchChat = async () => {
    dispatch({ type: "SET_LOADING_CHAT", payload: true });
    try {
      const chat = await getChatMessages(challengeId);
      dispatch({ type: "SET_CHAT_MESSAGES", payload: chat });
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar o chat");
    } finally {
      dispatch({ type: "SET_LOADING_CHAT", payload: false });
    }
  };

  const onRefresh = useCallback(async () => {
    dispatch({ type: "SET_REFRESHING", payload: true });
    try {
      await fetchDetails();
    } finally {
      dispatch({ type: "SET_REFRESHING", payload: false });
    }
  }, []);

  useEffect(() => {
    fetchDetails();
  }, []);

  useEffect(() => {
    if (showChat) {
      fetchChat();
    }
  }, [showChat]);

  useEffect(() => {
    if (state.reps && state.sets && state.weight) {
      calculateVolume();
    }
  }, [state.reps, state.sets, state.weight]);

  const isChallengeEnded = () => {
    if (!state.challenge?.end_date) return false;

    const endDate = addDays(new Date(state.challenge.end_date), 1);
    return isAfter(new Date(), endDate);
  };

  if (state.loading) {
    return (
      <SafeAreaView className="flex-1 bg-background py-2">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  if (showCamera) {
    return (
      <View className="flex-1">
        <CameraView ref={(ref) => setCameraRef(ref)} style={{ flex: 1 }}>
          <View className="flex-1 bg-transparent flex-row justify-center items-end pb-10">
            <TouchableOpacity
              onPress={takePicture}
              className="w-16 h-16 bg-white rounded-full"
            />
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background py-2">
      <ScrollView>
        <View className="px-4 my-4">
          <HeaderPage
            hasBack
            title={state.challenge?.title || "Detalhes do Desafio"}
          />
          {state.challenge?.image_url && (
            <Image
              source={{ uri: state.challenge.image_url }}
              style={{ height: 200, borderRadius: 12 }}
              resizeMode="cover"
              className="mt-4"
            />
          )}

          <TouchableOpacity
            className="mt-4 bg-zinc-800 p-4 rounded-lg flex-row justify-between items-center"
            onPress={() => dispatch({ type: "TOGGLE_WORKOUT_INFO" })}
          >
            <Text className="text-white font-poppins-medium text-lg">
              Informações do Desafio
            </Text>
            <Ionicons
              name={state.showWorkoutInfo ? "chevron-up" : "chevron-down"}
              size={24}
              color="white"
            />
          </TouchableOpacity>

          {state.showWorkoutInfo && (
            <View className="bg-zinc-800 px-4 pb-4 rounded-b-lg">
              <Text className="text-gray-300 mb-1">
                Tipo:{" "}
                {state.challenge?.workout_type === "volume"
                  ? "Volume"
                  : "Regular"}
              </Text>
              <Text className="text-gray-300 mb-1">
                Grupo Muscular: {state.challenge?.muscle_group}
              </Text>
              <Text className="text-gray-300 mb-1">
                Pontos: {state.challenge?.reward_points}
              </Text>
              <Text className="text-gray-300 mb-1">
                Período:{" "}
                {format(
                  new Date(state.challenge?.start_date || ""),
                  "dd/MM/yyyy",
                  { locale: ptBR }
                )}{" "}
                -
                {format(
                  new Date(state.challenge?.end_date || ""),
                  "dd/MM/yyyy",
                  {
                    locale: ptBR,
                  }
                )}
              </Text>
              <Text className="text-gray-300 mb-1">
                Participantes: {state.challenge?.participant_count || 0}
                {state.challenge?.max_participants
                  ? `/${state.challenge.max_participants}`
                  : ""}
              </Text>
              <Text className="text-gray-300">
                Regras: {state.challenge?.rules}
              </Text>
              {state.challenge?.type == "private" && (
                <Text className="text-purple-400 mt-2">
                  Este é um desafio privado
                </Text>
              )}
              {(state.challenge?.status === "completed" ||
                isChallengeEnded()) && (
                <View className="bg-purple-600 p-4 rounded-lg mt-4">
                  <Text className="text-white font-poppins-medium text-center">
                    Desafio Finalizado!
                  </Text>
                  <Text className="text-white text-center mt-2">
                    Vencedor: {state?.challenge?.winner?.name || "Não definido"}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View className="px-4">
          {!state.challenge?.isParticipating ? (
            <TouchableOpacity
              className="bg-purple-600 rounded-lg p-4 items-center"
              onPress={handleJoinChallenge}
            >
              <Text className="text-white font-poppins-medium text-lg">
                Participar do desafio
              </Text>
            </TouchableOpacity>
          ) : state.challenge?.status === "completed" || isChallengeEnded() ? (
            <View className="bg-zinc-800 p-4 rounded-lg">
              <Text className="text-white text-center">
                Este desafio já foi finalizado
              </Text>
            </View>
          ) : (
            <>
              <View className="bg-zinc-800 p-4 rounded-lg mb-4">
                <Text className="text-white font-poppins-medium text-lg mb-3">
                  Registrar Treino
                </Text>

                {state.hasWorkoutToday ? (
                  <View className="bg-zinc-700 p-4 rounded-lg">
                    <Text className="text-white text-center font-poppins-medium ">
                      Treino já registrado hoje!
                    </Text>
                  </View>
                ) : (
                  <>
                    <TextInput
                      placeholder="Repetições"
                      placeholderTextColor="#9ca3af"
                      value={state.reps}
                      onChangeText={(text) =>
                        dispatch({ type: "SET_REPS", payload: text })
                      }
                      keyboardType="numeric"
                      className="bg-zinc-700 rounded-lg text-white p-4 mb-3"
                    />
                    <TextInput
                      placeholder="Séries"
                      placeholderTextColor="#9ca3af"
                      value={state.sets}
                      onChangeText={(text) =>
                        dispatch({ type: "SET_SETS", payload: text })
                      }
                      keyboardType="numeric"
                      className="bg-zinc-700 rounded-lg text-white p-4 mb-3"
                    />
                    <TextInput
                      placeholder="Peso (kg)"
                      placeholderTextColor="#9ca3af"
                      value={state.weight}
                      onChangeText={(text) =>
                        dispatch({ type: "SET_WEIGHT", payload: text })
                      }
                      keyboardType="numeric"
                      className="bg-zinc-700 rounded-lg text-white p-4 mb-3"
                    />

                    <TouchableOpacity
                      className="bg-zinc-700 rounded-lg p-4 mb-4 items-center"
                      onPress={takePhoto}
                    >
                      <Text className="text-white font-poppins-medium">
                        {state.workoutImage
                          ? "Tirar outra foto"
                          : "Tirar foto do treino"}
                      </Text>
                    </TouchableOpacity>

                    {state.workoutImage && (
                      <Image
                        source={{ uri: state.workoutImage }}
                        style={{ height: 200, borderRadius: 8 }}
                        resizeMode="cover"
                        className="mb-4"
                      />
                    )}

                    <TouchableOpacity
                      className="bg-purple-600 rounded-lg p-4 items-center"
                      onPress={handleRegisterWorkout}
                      disabled={state.savingWorkout}
                    >
                      {state.savingWorkout ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text className="text-white font-poppins-medium text-lg">
                          Salvar Treino
                        </Text>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </View>

              <TouchableOpacity
                className="bg-purple-600 rounded-lg p-4 items-center"
                onPress={() => setShowChat(true)}
              >
                <Text className="text-white font-poppins-medium text-lg">
                  Abrir Chat do Desafio
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showAccessCodeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAccessCodeModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-background w-4/5 rounded-3xl p-4">
            <Text className="text-white font-poppins-medium text-lg mb-4 text-center">
              Digite o código de acesso
            </Text>
            <TextInput
              placeholder="Código de acesso"
              placeholderTextColor="#9ca3af"
              value={state.accessCode}
              onChangeText={(text) =>
                dispatch({ type: "SET_ACCESS_CODE", payload: text })
              }
              className="bg-zinc-700 rounded-lg text-white p-4 mb-4"
            />
            <TouchableOpacity
              className="bg-purple-600 rounded-lg p-4 items-center mb-2"
              onPress={handleJoinPrivateChallenge}
            >
              <Text className="text-white font-poppins-medium">Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-zinc-700 rounded-lg p-4 items-center"
              onPress={() => setShowAccessCodeModal(false)}
            >
              <Text className="text-white font-poppins-medium">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showChat}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowChat(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background h-3/4 rounded-t-3xl p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white font-poppins-medium text-lg">
                Chat do Desafio
              </Text>
              <TouchableOpacity onPress={() => setShowChat(false)}>
                <Text className="text-white text-lg">✕</Text>
              </TouchableOpacity>
            </View>

            {state.loadingChat ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <FlatList
                data={state.chatMessages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View className="bg-zinc-800 p-3 rounded-lg mb-2">
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-purple-400 font-poppins-medium">
                        {item.user?.name}
                      </Text>
                      <Text className="text-gray-400">
                        {format(new Date(item?.created_at || ""), "HH:mm")}
                      </Text>
                    </View>
                    <Text className="text-white mb-2">{item?.message}</Text>
                    {item.image_url && (
                      <Image
                        source={{ uri: item.image_url }}
                        style={{ height: 150, borderRadius: 8 }}
                        resizeMode="cover"
                      />
                    )}
                    {item.workout_log && (
                      <View className="bg-zinc-700 p-2 rounded-lg mt-2">
                        <Text className="text-purple-400">
                          Registro de Treino
                        </Text>
                        <Text className="text-white">
                          Volume: {item.workout_log.volume}
                        </Text>
                        <Text className="text-white">
                          Grupo Muscular: {item.workout_log.muscle_group}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
                refreshControl={
                  <RefreshControl
                    refreshing={state.refreshing}
                    onRefresh={onRefresh}
                    tintColor="#fff"
                  />
                }
                className="flex-1"
              />
            )}

            <View className="mt-3">
              <TextInput
                placeholder="Digite sua mensagem"
                placeholderTextColor="#9ca3af"
                value={state.message}
                onChangeText={(text) =>
                  dispatch({ type: "SET_MESSAGE", payload: text })
                }
                className="bg-zinc-700 rounded-lg text-white p-4 mb-2"
              />
              <TouchableOpacity
                className="bg-purple-600 rounded-lg p-4 items-center"
                onPress={handleSendMessage}
                disabled={state.sendingMessage}
              >
                {state.sendingMessage ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-poppins-medium">
                    Enviar Mensagem
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

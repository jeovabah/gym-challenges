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
import { useEffect, useCallback, useReducer, useState, useRef } from "react";
import {
  joinChallenge,
  registerWorkout,
  getChatMessages,
  sendMessageChallenge,
  Challenge as ChallengeType,
  showChallenge,
  finalizeChallenge,
  deleteChallenge,
} from "@/api/challenges";
import { useSession } from "@/providers/SessionProvider";
import { HeaderPage } from "@/components/HeaderPage";
import { format, isAfter, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Camera, CameraView } from "expo-camera";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { goBack } from "@/routes/utils";
import { ELOS_IMAGE } from "@/constants/elo";

type ExerciseSet = { reps: string; weight: string };

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
  location: string;
  showWorkoutInfo: boolean;
  hasWorkoutToday: boolean;
  todayWorkout: any;
  accessCode: string;
  savingWorkout: boolean;
  sendingMessage: boolean;
  loadingChat: boolean;
  muscleGroup: string;
  numberOfSets: string;
  exerciseSets: ExerciseSet[];
  totalWeight: string;
  enduranceTime: string;
  stravaData: string;
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
  | { type: "SET_LOCATION"; payload: string }
  | { type: "UPDATE_CHALLENGE_PARTICIPATION"; payload: boolean }
  | { type: "TOGGLE_WORKOUT_INFO" }
  | { type: "SET_HAS_WORKOUT_TODAY"; payload: boolean }
  | { type: "SET_TODAY_WORKOUT"; payload: any }
  | { type: "SET_ACCESS_CODE"; payload: string }
  | { type: "SET_SAVING_WORKOUT"; payload: boolean }
  | { type: "SET_SENDING_MESSAGE"; payload: boolean }
  | { type: "SET_LOADING_CHAT"; payload: boolean }
  | { type: "SET_MUSCLE_GROUP"; payload: string }
  | { type: "SET_NUMBER_OF_SETS"; payload: string }
  | {
      type: "SET_EXERCISE_SET";
      payload: { index: number; reps?: string; weight?: string };
    }
  | { type: "SET_TOTAL_WEIGHT"; payload: string }
  | { type: "SET_ENDURANCE_TIME"; payload: string }
  | { type: "SET_STRAVA_DATA"; payload: string };

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
  location: "",
  showWorkoutInfo: true,
  hasWorkoutToday: false,
  todayWorkout: null,
  accessCode: "",
  savingWorkout: false,
  sendingMessage: false,
  loadingChat: false,
  muscleGroup: "",
  numberOfSets: "",
  exerciseSets: [
    { reps: "", weight: "" },
    { reps: "", weight: "" },
    { reps: "", weight: "" },
    { reps: "", weight: "" },
  ],
  totalWeight: "",
  enduranceTime: "",
  stravaData: "",
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
    case "SET_LOCATION":
      return { ...state, location: action.payload };
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
    // Novas ações:
    case "SET_MUSCLE_GROUP":
      return { ...state, muscleGroup: action.payload };
    case "SET_NUMBER_OF_SETS":
      return { ...state, numberOfSets: action.payload };
    case "SET_EXERCISE_SET":
      const newExerciseSets = state.exerciseSets.map((set, idx) => {
        if (idx === action.payload.index) {
          return {
            reps:
              action.payload.reps !== undefined
                ? action.payload.reps
                : set.reps,
            weight:
              action.payload.weight !== undefined
                ? action.payload.weight
                : set.weight,
          };
        }
        return set;
      });
      return { ...state, exerciseSets: newExerciseSets };
    case "SET_TOTAL_WEIGHT":
      return { ...state, totalWeight: action.payload };
    case "SET_ENDURANCE_TIME":
      return { ...state, enduranceTime: action.payload };
    case "SET_STRAVA_DATA":
      return { ...state, stravaData: action.payload };
    default:
      return state;
  }
}

// ---------- COMPONENTES DOS FORMULÁRIOS POR TIPO DE DESAFIO ----------

// 1. Frequência: Apenas foto e registro
function FrequencyWorkoutForm({
  state,
  onTakePhoto,
  onRegisterWorkout,
}: {
  state: State;
  onTakePhoto: () => void;
  onRegisterWorkout: () => void;
}) {
  return (
    <View>
      {state.hasWorkoutToday ? (
        <View className="bg-zinc-700 p-4 rounded-lg">
          <Text className="text-white text-center font-poppins-medium">
            Treino já registrado hoje!
          </Text>
        </View>
      ) : (
        <>
          <TouchableOpacity
            className="bg-zinc-700 rounded-lg p-4 mb-4 flex-row justify-center items-center"
            onPress={onTakePhoto}
          >
            <Ionicons name="camera-outline" size={20} color="#fff" />
            <Text className="ml-2 text-white font-poppins-medium">
              {state.workoutImage ? "Tirar outra foto" : "Tirar foto do treino"}
            </Text>
          </TouchableOpacity>
          {state.workoutImage ? (
            <Image
              source={{ uri: state.workoutImage }}
              style={{ height: 200, borderRadius: 8 }}
              resizeMode="cover"
              className="mb-4"
            />
          ) : (
            <View
              style={{
                height: 200,
                borderRadius: 8,
                backgroundColor: "#333",
                justifyContent: "center",
                alignItems: "center",
              }}
              className="mb-4"
            >
              <Ionicons name="alert-circle-outline" size={40} color="#fff" />
              <Text className="text-white">Sem Imagem</Text>
            </View>
          )}
          <TouchableOpacity
            className="bg-purple-600 rounded-lg p-4 flex-row justify-center items-center"
            onPress={onRegisterWorkout}
            disabled={state.savingWorkout}
          >
            <Ionicons name="save-outline" size={20} color="#fff" />
            <Text className="ml-2 text-white font-poppins-medium text-lg">
              Salvar Treino
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// 2. Volume de Treino: Grupo muscular, número de séries e, para cada série, repetições e peso
function VolumeWorkoutForm({
  state,
  dispatch,
  onTakePhoto,
  onRegisterWorkout,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
  onTakePhoto: () => void;
  onRegisterWorkout: () => void;
}) {
  return (
    <View>
      {state.hasWorkoutToday ? (
        <View className="bg-zinc-700 p-4 rounded-lg">
          <Text className="text-white text-center font-poppins-medium">
            Treino já registrado hoje!
          </Text>
        </View>
      ) : (
        <>
          <TextInput
            placeholder="Grupo Muscular"
            placeholderTextColor="#9ca3af"
            value={state.muscleGroup}
            onChangeText={(text) =>
              dispatch({ type: "SET_MUSCLE_GROUP", payload: text })
            }
            className="bg-zinc-700 rounded-lg text-white p-4 mb-3"
          />
          <TextInput
            placeholder="Número de Séries"
            placeholderTextColor="#9ca3af"
            value={state.numberOfSets}
            onChangeText={(text) =>
              dispatch({ type: "SET_NUMBER_OF_SETS", payload: text })
            }
            keyboardType="numeric"
            className="bg-zinc-700 rounded-lg text-white p-4 mb-3"
          />
          {state.numberOfSets &&
            !isNaN(parseInt(state.numberOfSets)) &&
            Array.from({ length: parseInt(state.numberOfSets) }).map(
              (_, index) => (
                <View key={index} className="mb-3">
                  <Text className="text-white">Série {index + 1}</Text>
                  <TextInput
                    placeholder="Repetições"
                    placeholderTextColor="#9ca3af"
                    value={state.exerciseSets[index]?.reps}
                    onChangeText={(text) =>
                      dispatch({
                        type: "SET_EXERCISE_SET",
                        payload: { index, reps: text },
                      })
                    }
                    keyboardType="numeric"
                    className="bg-zinc-700 rounded-lg text-white p-4 mb-2"
                  />
                  <TextInput
                    placeholder="Peso (kg)"
                    placeholderTextColor="#9ca3af"
                    value={state.exerciseSets[index]?.weight}
                    onChangeText={(text) =>
                      dispatch({
                        type: "SET_EXERCISE_SET",
                        payload: { index, weight: text },
                      })
                    }
                    keyboardType="numeric"
                    className="bg-zinc-700 rounded-lg text-white p-4 mb-2"
                  />
                </View>
              )
            )}
          <TouchableOpacity
            className="bg-zinc-700 rounded-lg p-4 mb-4 flex-row justify-center items-center"
            onPress={onTakePhoto}
          >
            <Ionicons name="camera-outline" size={20} color="#fff" />
            <Text className="ml-2 text-white font-poppins-medium">
              {state.workoutImage ? "Tirar outra foto" : "Tirar foto do treino"}
            </Text>
          </TouchableOpacity>
          {state.workoutImage ? (
            <Image
              source={{ uri: state.workoutImage }}
              style={{ height: 200, borderRadius: 8 }}
              resizeMode="cover"
              className="mb-4"
            />
          ) : (
            <View
              style={{
                height: 200,
                borderRadius: 8,
                backgroundColor: "#333",
                justifyContent: "center",
                alignItems: "center",
              }}
              className="mb-4"
            >
              <Ionicons name="alert-circle-outline" size={40} color="#fff" />
              <Text className="text-white">Sem Imagem</Text>
            </View>
          )}
          <TouchableOpacity
            className="bg-purple-600 rounded-lg p-4 flex-row justify-center items-center"
            onPress={onRegisterWorkout}
            disabled={state.savingWorkout}
          >
            <Ionicons name="save-outline" size={20} color="#fff" />
            <Text className="ml-2 text-white font-poppins-medium text-lg">
              Salvar Treino
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// 3. Por Peso Total: Entrada de um valor numérico representando o peso total
function TotalWeightWorkoutForm({
  state,
  dispatch,
  onTakePhoto,
  onRegisterWorkout,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
  onTakePhoto: () => void;
  onRegisterWorkout: () => void;
}) {
  return (
    <View>
      {state.hasWorkoutToday ? (
        <View className="bg-zinc-700 p-4 rounded-lg">
          <Text className="text-white text-center font-poppins-medium">
            Treino já registrado hoje!
          </Text>
        </View>
      ) : (
        <>
          <TextInput
            placeholder="Peso Total (kg)"
            placeholderTextColor="#9ca3af"
            value={state.totalWeight}
            onChangeText={(text) =>
              dispatch({ type: "SET_TOTAL_WEIGHT", payload: text })
            }
            keyboardType="numeric"
            className="bg-zinc-700 rounded-lg text-white p-4 mb-3"
          />
          <TouchableOpacity
            className="bg-zinc-700 rounded-lg p-4 mb-4 flex-row justify-center items-center"
            onPress={onTakePhoto}
          >
            <Ionicons name="camera-outline" size={20} color="#fff" />
            <Text className="ml-2 text-white font-poppins-medium">
              {state.workoutImage ? "Tirar outra foto" : "Tirar foto do treino"}
            </Text>
          </TouchableOpacity>
          {state.workoutImage ? (
            <Image
              source={{ uri: state.workoutImage }}
              style={{ height: 200, borderRadius: 8 }}
              resizeMode="cover"
              className="mb-4"
            />
          ) : (
            <View
              style={{
                height: 200,
                borderRadius: 8,
                backgroundColor: "#333",
                justifyContent: "center",
                alignItems: "center",
              }}
              className="mb-4"
            >
              <Ionicons name="alert-circle-outline" size={40} color="#fff" />
              <Text className="text-white">Sem Imagem</Text>
            </View>
          )}
          <TouchableOpacity
            className="bg-purple-600 rounded-lg p-4 flex-row justify-center items-center"
            onPress={onRegisterWorkout}
            disabled={state.savingWorkout}
          >
            <Ionicons name="save-outline" size={20} color="#fff" />
            <Text className="ml-2 text-white font-poppins-medium text-lg">
              Salvar Treino
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// 4. Resistência: Cronômetro para informar o tempo total de treino
function EnduranceWorkoutForm({
  state,
  dispatch,
  onTakePhoto,
  onRegisterWorkout,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
  onTakePhoto: () => void;
  onRegisterWorkout: () => void;
}) {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<any>(null);

  const startTimer = () => {
    if (!running) {
      setRunning(true);
      const id = setInterval(() => {
        setTime((prev: number) => prev + 1);
      }, 1000);
      setIntervalId(id);
    }
  };

  const stopTimer = () => {
    if (running && intervalId) {
      clearInterval(intervalId);
      setRunning(false);
      dispatch({ type: "SET_ENDURANCE_TIME", payload: (time / 60).toFixed(2) });
    }
  };

  const resetTimer = () => {
    if (intervalId) clearInterval(intervalId);
    setTime(0);
    setRunning(false);
    setIntervalId(null);
    dispatch({ type: "SET_ENDURANCE_TIME", payload: "0" });
  };

  useEffect(() => {
    if (state.workoutImage) {
      resetTimer();
    }
  }, [state.workoutImage]);

  return (
    <View>
      <Text className="text-white text-center font-poppins-medium text-lg">
        <Ionicons name="timer-outline" size={20} color="#fff" /> Cronômetro:{" "}
        {Math.floor(time / 60)}:{("0" + (time % 60)).slice(-2)}
      </Text>
      <View className="flex-row justify-around my-4">
        <TouchableOpacity
          className="flex-row bg-blue-600 rounded-lg p-2 items-center"
          onPress={startTimer}
          disabled={running}
        >
          <Ionicons name="play-circle-outline" size={24} color="#fff" />
          <Text className="ml-1 text-white">Iniciar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row bg-blue-600 rounded-lg p-2 items-center"
          onPress={stopTimer}
          disabled={!running}
        >
          <Ionicons name="pause-circle-outline" size={24} color="#fff" />
          <Text className="ml-1 text-white">Parar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row bg-blue-600 rounded-lg p-2 items-center"
          onPress={resetTimer}
        >
          <Ionicons name="refresh-circle-outline" size={24} color="#fff" />
          <Text className="ml-1 text-white">Resetar</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        className="bg-green-600 rounded-lg p-4 flex-row justify-center items-center"
        onPress={onTakePhoto}
      >
        <Ionicons name="camera-outline" size={20} color="#fff" />
        <Text className="ml-2 text-white font-poppins-medium">
          {state.workoutImage ? "Tirar outra foto" : "Tirar foto do treino"}
        </Text>
      </TouchableOpacity>
      {state.workoutImage ? (
        <Image
          source={{ uri: state.workoutImage }}
          style={{ height: 200, borderRadius: 8 }}
          resizeMode="cover"
          className="mb-4"
        />
      ) : (
        <View
          style={{
            height: 200,
            borderRadius: 8,
            backgroundColor: "#333",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="mb-4"
        >
          <Ionicons name="alert-circle-outline" size={40} color="#fff" />
          <Text className="text-white">Sem Imagem</Text>
        </View>
      )}
      <TouchableOpacity
        className="bg-purple-600 rounded-lg p-4 flex-row justify-center items-center"
        onPress={onRegisterWorkout}
        disabled={state.savingWorkout}
      >
        <Ionicons name="save-outline" size={20} color="#fff" />
        <Text className="ml-2 text-white font-poppins-medium text-lg">
          Salvar Treino
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// 5. Metas de Distância: Busca (simulada) de dados do Strava e registro
function DistanceGoalWorkoutForm({
  state,
  dispatch,
  onTakePhoto,
  onRegisterWorkout,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
  onTakePhoto: () => void;
  onRegisterWorkout: () => void;
}) {
  const fetchStravaData = async () => {
    // Aqui você implementaria a chamada à API do Strava (note que em React Native
    // não há acesso ao DOM, então use a API adequada ou uma biblioteca)
    try {
      // Simulação de delay e retorno de dados:
      const data = "5.2"; // valor fictício
      dispatch({ type: "SET_STRAVA_DATA", payload: data });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter dados do Strava");
    }
  };

  return (
    <View>
      {state.hasWorkoutToday ? (
        <View className="bg-zinc-700 p-4 rounded-lg">
          <Text className="text-white text-center font-poppins-medium">
            Treino já registrado hoje!
          </Text>
        </View>
      ) : (
        <>
          <TouchableOpacity
            className="bg-yellow-600 rounded-lg p-4 flex-row justify-center items-center mb-4"
            onPress={fetchStravaData}
          >
            <Ionicons name="trending-up-outline" size={20} color="#fff" />
            <Text className="ml-2 text-white font-poppins-medium">
              Buscar dados do Strava
            </Text>
          </TouchableOpacity>
          {state.stravaData ? (
            <View className="bg-zinc-700 rounded-lg p-4 mb-4">
              <Text className="text-white text-center">
                Dados do Strava: {state.stravaData}km
              </Text>
            </View>
          ) : null}
          <TouchableOpacity
            className="bg-zinc-700 rounded-lg p-4 mb-4 flex-row justify-center items-center"
            onPress={onTakePhoto}
          >
            <Ionicons name="camera-outline" size={20} color="#fff" />
            <Text className="ml-2 text-white font-poppins-medium">
              {state.workoutImage ? "Tirar outra foto" : "Tirar foto do treino"}
            </Text>
          </TouchableOpacity>
          {state.workoutImage ? (
            <Image
              source={{ uri: state.workoutImage }}
              style={{ height: 200, borderRadius: 8 }}
              resizeMode="cover"
              className="mb-4"
            />
          ) : (
            <View
              style={{
                height: 200,
                borderRadius: 8,
                backgroundColor: "#333",
                justifyContent: "center",
                alignItems: "center",
              }}
              className="mb-4"
            >
              <Ionicons name="alert-circle-outline" size={40} color="#fff" />
              <Text className="text-white">Sem Imagem</Text>
            </View>
          )}
          <TouchableOpacity
            className="bg-purple-600 rounded-lg p-4 flex-row justify-center items-center"
            onPress={onRegisterWorkout}
            disabled={state.savingWorkout}
          >
            <Ionicons name="save-outline" size={20} color="#fff" />
            <Text className="ml-2 text-white font-poppins-medium text-lg">
              Salvar Treino
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// Renderiza o formulário de registro conforme o tipo de desafio
function RenderWorkoutForm({
  state,
  dispatch,
  onTakePhoto,
  onRegisterWorkout,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
  onTakePhoto: () => void;
  onRegisterWorkout: () => void;
}) {
  const challengeType = state.challenge?.metric?.name?.toLowerCase();
  switch (challengeType) {
    case "frequência":
      return (
        <FrequencyWorkoutForm
          state={state}
          onTakePhoto={onTakePhoto}
          onRegisterWorkout={onRegisterWorkout}
        />
      );
    case "volume de treino":
      return (
        <VolumeWorkoutForm
          state={state}
          dispatch={dispatch}
          onTakePhoto={onTakePhoto}
          onRegisterWorkout={onRegisterWorkout}
        />
      );
    case "por peso total":
      return (
        <TotalWeightWorkoutForm
          state={state}
          dispatch={dispatch}
          onTakePhoto={onTakePhoto}
          onRegisterWorkout={onRegisterWorkout}
        />
      );
    case "resistencia":
      return (
        <EnduranceWorkoutForm
          state={state}
          dispatch={dispatch}
          onTakePhoto={onTakePhoto}
          onRegisterWorkout={onRegisterWorkout}
        />
      );
    case "metas de distancia":
      return (
        <DistanceGoalWorkoutForm
          state={state}
          dispatch={dispatch}
          onTakePhoto={onTakePhoto}
          onRegisterWorkout={onRegisterWorkout}
        />
      );
    default:
      return (
        <View className="bg-zinc-700 p-4 rounded-lg">
          <Text className="text-white">
            Tipo de desafio não definido ou desconhecido.
          </Text>
        </View>
      );
  }
}

// --------------------- COMPONENTE PRINCIPAL ---------------------
export const ChallengeDetails = ({ route }: any) => {
  const { challengeId } = route.params;
  const { user } = useSession();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showChat, setShowChat] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<any>(null);
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erro", "Permissão para acessar a localização foi negada.");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      dispatch({
        type: "SET_LOCATION",
        payload: `${loc.coords.latitude},${loc.coords.longitude}`,
      });
    })();
  }, []);

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
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
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
      if (state.challenge?.type === "private") {
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

  const handleDeleteChallenge = () => {
    Alert.alert(
      "Deletar Desafio",
      "Tem certeza que deseja deletar este desafio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              await deleteChallenge(challengeId);
              Alert.alert("Sucesso", "Desafio deletado com sucesso!");
              fetchDetails();
              goBack();
            } catch (error: any) {
              Alert.alert("Erro", error.message);
            }
          },
        },
      ]
    );
  };

  const handleFinishChallenge = () => {
    Alert.alert(
      "Finalizar Desafio",
      "Tem certeza que deseja finalizar este desafio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              await finalizeChallenge(challengeId, user?.auth?.id || "");
              Alert.alert("Sucesso", "Desafio finalizado com sucesso!");
              fetchDetails();
            } catch (error: any) {
              Alert.alert("Erro", error.message);
            }
          },
        },
      ]
    );
  };

  // Atualizado para validar os dados conforme o tipo de desafio
  const handleRegisterWorkout = async () => {
    try {
      const challengeType = state.challenge?.metric?.name?.toLowerCase();
      if (challengeType === "frequência") {
        if (!state.workoutImage) {
          Alert.alert("Erro", "Tire uma foto do seu treino!");
          return;
        }
      } else if (challengeType === "volume de treino") {
        if (!state.muscleGroup || !state.numberOfSets) {
          Alert.alert(
            "Erro",
            "Preencha o grupo muscular e o número de séries!"
          );
          return;
        }
        const numSets = parseInt(state.numberOfSets);
        for (let i = 0; i < numSets; i++) {
          const set = state.exerciseSets[i];
          if (!set || !set.reps || !set.weight) {
            Alert.alert("Erro", `Preencha os dados da série ${i + 1}`);
            return;
          }
        }
      } else if (challengeType === "por peso total") {
        if (!state.totalWeight) {
          Alert.alert("Erro", "Preencha o peso total!");
          return;
        }
        if (!state.workoutImage) {
          Alert.alert("Erro", "Tire uma foto do seu treino!");
          return;
        }
      } else if (challengeType === "resistencia") {
        if (!state.enduranceTime || state.enduranceTime === "0") {
          Alert.alert("Erro", "Preencha o tempo do treino!");
          return;
        }
        if (!state.workoutImage) {
          Alert.alert("Erro", "Tire uma foto do seu treino!");
          return;
        }
      } else if (challengeType === "metas de distancia") {
        if (!state.stravaData) {
          Alert.alert("Erro", "Busque os dados do Strava!");
          return;
        }
        if (!state.workoutImage) {
          Alert.alert("Erro", "Tire uma foto do seu treino!");
          return;
        }
      }
      if (state.hasWorkoutToday) {
        Alert.alert("Aviso", "Você já registrou um treino hoje!");
        return;
      }
      dispatch({ type: "SET_SAVING_WORKOUT", payload: true });
      // Prepara o payload de acordo com o tipo
      const payload: any = {
        user_id: user?.auth?.id || "",
        challenge_id: challengeId,
        image_url: state.workoutImage,
        location: state.location,
      };
      if (challengeType === "frequência") {
        // sem dados adicionais
      } else if (challengeType === "volume de treino") {
        payload.muscle_group = state.muscleGroup;
        payload.number_of_sets = state.numberOfSets;
        payload.exercise_sets = state.exerciseSets.slice(
          0,
          parseInt(state.numberOfSets)
        );
      } else if (challengeType === "por peso total") {
        payload.total_weight = parseInt(state.totalWeight);
      } else if (challengeType === "resistencia") {
        payload.endurance_time = parseFloat(state.enduranceTime);
      } else if (challengeType === "metas de distancia") {
        payload.strava_data = state.stravaData;
      }
      await registerWorkout(payload);
      dispatch({ type: "SET_HAS_WORKOUT_TODAY", payload: true });
      Alert.alert("Sucesso", "Treino registrado com sucesso!");
      // Reseta os campos:
      dispatch({ type: "SET_WORKOUT_IMAGE", payload: "" });
      dispatch({ type: "SET_REPS", payload: "" });
      dispatch({ type: "SET_SETS", payload: "" });
      dispatch({ type: "SET_WEIGHT", payload: "" });
      dispatch({ type: "SET_WORKOUT_VOLUME", payload: "" });
      dispatch({ type: "SET_MUSCLE_GROUP", payload: "" });
      dispatch({ type: "SET_NUMBER_OF_SETS", payload: "" });
      for (let i = 0; i < 4; i++) {
        dispatch({
          type: "SET_EXERCISE_SET",
          payload: { index: i, reps: "", weight: "" },
        });
      }
      dispatch({ type: "SET_TOTAL_WEIGHT", payload: "" });
      dispatch({ type: "SET_ENDURANCE_TIME", payload: "" });
      dispatch({ type: "SET_STRAVA_DATA", payload: "" });
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
        user: { name: user?.auth?.user_metadata?.name },
        // Ajusta o fuso horário: subtrai 3 horas do horário UTC
        created_at: new Date(
          new Date().getTime() - 3 * 60 * 60 * 1000
        ).toISOString(),
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

  // Modal da câmera (preserva o estado do cronômetro, se aplicável)
  const renderCameraModal = () => (
    <Modal
      visible={showCamera}
      animationType="slide"
      onRequestClose={() => setShowCamera(false)}
    >
      <CameraView ref={cameraRef} style={{ flex: 1 }}>
        <View className="flex-1 bg-transparent flex-row justify-center items-end pb-10">
          <TouchableOpacity
            onPress={takePicture}
            className="w-16 h-16 bg-white rounded-full"
          />
        </View>
      </CameraView>
    </Modal>
  );

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

  return (
    <SafeAreaView className="flex-1 bg-background py-2">
      {renderCameraModal()}
      <ScrollView>
        <View className="px-4 my-4">
          <HeaderPage
            hasBack
            title={state.challenge?.title || "Detalhes do Desafio"}
          />
          <View
            style={{
              height: 200,
              borderRadius: 12,
              backgroundColor: "#333",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="mt-4"
          >
            {state.challenge?.image_url ? (
              <Image
                source={{ uri: state.challenge.image_url }}
                style={{ height: 200, borderRadius: 12 }}
                resizeMode="cover"
              />
            ) : (
              <Text className="text-white">Sem Imagem</Text>
            )}
          </View>
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
                Métrica: {state.challenge?.metric?.name || "—"}
              </Text>
              <Text className="text-gray-300 mb-1">
                Método de Registro:{" "}
                {state.challenge?.registration_method?.name || "—"}
              </Text>
              <Text className="text-gray-300 mb-1">
                Unidade: {state.challenge?.unit?.name || "—"}
              </Text>
              <Text className="text-gray-300 mb-1">
                Meta: {state.challenge?.goal || "—"}
              </Text>
            </View>
          )}
        </View>
        <View className="px-4">
          {state.challenge?.creator_id === user?.auth?.id &&
            state.challenge?.status !== "completed" &&
            !isChallengeEnded() && (
              <>
                <TouchableOpacity
                  className="bg-green-600 rounded-lg p-4 items-center mb-4"
                  onPress={handleFinishChallenge}
                >
                  <Text className="text-white font-poppins-medium text-lg">
                    Finalizar Desafio
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-red-600 rounded-lg p-4 items-center mb-4"
                  onPress={handleDeleteChallenge}
                >
                  <Text className="text-white font-poppins-medium text-lg">
                    Deletar Desafio
                  </Text>
                </TouchableOpacity>
              </>
            )}
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
              <Text className="text-white text-center font-poppins-medium text-lg mb-2">
                Este desafio já foi finalizado
              </Text>
              <View className="flex-row items-center justify-center">
                <Text className="text-white text-center mr-2">Vencedor:</Text>
                {state.challenge?.winner?.name ? (
                  <View className="flex-row items-center">
                    <Text className="text-white text-center">{state.challenge.winner.name}</Text>
                    {state.challenge.winner?.elo?.id && (
                      <Image 
                        source={ELOS_IMAGE[state?.challenge?.winner?.elo?.id]}
                        style={{width: 32, height: 32}}
                        className="ml-2"
                      />
                    )}
                  </View>
                ) : (
                  <Text className="text-white text-center">Nenhum vencedor definido</Text>
                )}
              </View>
            </View>
          ) : (
            <>
              <View className="bg-zinc-800 p-4 rounded-lg mb-4">
                <Text className="text-white font-poppins-medium text-lg mb-3">
                  Registrar Treino
                </Text>
                <RenderWorkoutForm
                  state={state}
                  dispatch={dispatch}
                  onTakePhoto={takePhoto}
                  onRegisterWorkout={handleRegisterWorkout}
                />
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
              className="bg-purple-600 rounded-lg p-4 items-center flex-row justify-center mb-2"
              onPress={handleJoinPrivateChallenge}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#fff"
              />
              <Text className="ml-2 text-white font-poppins-medium">
                Confirmar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-zinc-700 rounded-lg p-4 items-center flex-row justify-center"
              onPress={() => setShowAccessCodeModal(false)}
            >
              <Ionicons name="close-circle-outline" size={20} color="#fff" />
              <Text className="ml-2 text-white font-poppins-medium">
                Cancelar
              </Text>
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
                renderItem={({ item }) => {
                  const createdAt = new Date(item?.created_at);
                  const adjustedDate = new Date(
                    createdAt.getTime() - 3 * 60 * 60 * 1000
                  );
                  return (
                    <View className="bg-zinc-800 p-3 rounded-lg mb-2">
                      <View className="flex-row justify-between mb-1">
                        <Text className="text-purple-400 font-poppins-medium">
                          {item.user?.name}
                        </Text>
                        <Text className="text-gray-400">
                          {format(adjustedDate, "HH:mm", { locale: ptBR })}
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
                  );
                }}
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
                className="bg-purple-600 rounded-lg p-4 items-center flex-row justify-center"
                onPress={handleSendMessage}
                disabled={state.sendingMessage}
              >
                {state.sendingMessage ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="send-outline" size={20} color="#fff" />
                    <Text className="ml-2 text-white font-poppins-medium">
                      Enviar Mensagem
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

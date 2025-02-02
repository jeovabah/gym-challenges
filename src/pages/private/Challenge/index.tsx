import { HeaderPage } from "@/components/HeaderPage";
import {
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import {
  createChallenge,
  CreateChallengeInput,
  getChallenges,
  Challenge as ChallengeType,
  MetricID,
} from "@/api/challenges";
import { ChallengeCard } from "@/components/Challenge/Card";
import { useSession } from "@/providers/SessionProvider";
import { Mask } from "@/utils/mask";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

const TAB_BAR_HEIGHT = 64;

export const Challenge = () => {
  const [challenges, setChallenges] = useState<ChallengeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useSession();

  const today = new Date();
  const formattedToday = today.toLocaleDateString("pt-BR");

  const [title, setTitle] = useState("");
  const [rules, setRules] = useState("");
  const [startDate, setStartDate] = useState(formattedToday);
  const [endDate, setEndDate] = useState(formattedToday);
  const [type, setType] = useState<"public" | "private">("public");
  const [maxParticipants, setMaxParticipants] = useState("");
  // challengeCategory armazena a chave original (ex: "frequency", "volume", etc.)
  const [challengeCategory, setChallengeCategory] = useState("volume");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [goal, setGoal] = useState("");

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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const validateFields = () => {
    if (!title) {
      Alert.alert("Erro", "Por favor, insira um título para o desafio");
      return false;
    }
    if (!startDate) {
      Alert.alert("Erro", "Por favor, insira uma data de início");
      return false;
    }
    if (!endDate) {
      Alert.alert("Erro", "Por favor, insira uma data de término");
      return false;
    }
    if (!maxParticipants) {
      Alert.alert("Erro", "Por favor, insira o número máximo de participantes");
      return false;
    }
    if (!muscleGroup) {
      Alert.alert("Erro", "Por favor, insira o grupo muscular");
      return false;
    }
    if (type === "private" && !inviteCode) {
      Alert.alert("Erro", "Por favor, insira um código de convite para o desafio privado");
      return false;
    }
    if (challengeCategory === "specific_goal" && !goal) {
      Alert.alert("Erro", "Por favor, insira a meta para o desafio de meta específica");
      return false;
    }
    return true;
  };

  const handleCreateChallenge = async () => {
    if (!validateFields()) return;

    // Mapeamento para definir os valores conforme a categoria selecionada.
    // Os valores permanecem como strings para o BD; os rótulos são traduzidos abaixo.
    const mapping: Record<string, {
      metric_id: string;
      winning_criteria_id: string;
      registration_method_id: string;
      unit_id: string;
      goal?: number;
    }> = {
      frequency: {
        metric_id: "frequency",
        winning_criteria_id: "maior_numero_treinos",
        registration_method_id: "checkin_diario",
        unit_id: "unidades",
        goal: undefined,
      },
      volume: {
        metric_id: "volume",
        winning_criteria_id: "maior_soma",
        registration_method_id: "registrar_volume",
        unit_id: "kg",
        goal: undefined,
      },
      time: {
        metric_id: "time",
        winning_criteria_id: "maior_soma",
        registration_method_id: "registrar_tempo",
        unit_id: "minutos",
        goal: undefined,
      },
      execution: {
        metric_id: "execution",
        winning_criteria_id: "maior_numero_execucoes",
        registration_method_id: "registrar_execucoes",
        unit_id: "repeticoes",
        goal: undefined,
      },
      resistance: {
        metric_id: "resistance",
        winning_criteria_id: "maior_tempo_acumulado",
        registration_method_id: "registrar_tempo",
        unit_id: "segundos",
        goal: undefined,
      },
      specific_goal: {
        metric_id: "specific_goal",
        winning_criteria_id: "primeiro_a_atingir_meta",
        registration_method_id: "registrar_execucoes",
        unit_id: "repeticoes",
        goal: parseInt(goal) || undefined,
      },
    };

    const challenge: CreateChallengeInput = {
      creator_id: user?.auth?.id || "",
      title,
      rules:
        rules ||
        "1. Registre seus treinos diariamente\n2. Mantenha a consistência\n3. Compartilhe seu progresso no chat",
      start_date: Mask.transformMaskBirthdayInUs(startDate),
      end_date: Mask.transformMaskBirthdayInUs(endDate),
      reward_points: 15,
      type,
      max_participants: parseInt(maxParticipants),
      muscle_group: muscleGroup,
      image_url: imageUrl,
      invite_code: type === "private" ? inviteCode : undefined,
      metric_id: mapping[challengeCategory].metric_id as any,
      winning_criteria_id: mapping[challengeCategory].winning_criteria_id as any,
      registration_method_id: mapping[challengeCategory].registration_method_id as any,
      unit_id: mapping[challengeCategory].unit_id as any,
      goal: mapping[challengeCategory].goal,
    };

    try {
      const response = await createChallenge(challenge);
      setChallenges((prev) => [
        ...prev,
        { ...response, isParticipating: true },
      ]);
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setRules("");
    setStartDate(formattedToday);
    setEndDate(formattedToday);
    setType("public");
    setMaxParticipants("");
    setChallengeCategory("volume");
    setMuscleGroup("");
    setImageUrl("");
    setInviteCode("");
    setGoal("");
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
          onPress={() => setShowCreateModal(true)}
        >
          <Text className="text-white font-poppins-regular">Criar desafio</Text>
        </TouchableOpacity>
      </View>
      <View className="px-4 flex-1">
        <FlatList
          data={challenges}
          renderItem={({ item }) => (
            <ChallengeCard key={item.id} updateFront={setChallenges} {...item} />
          )}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + 16 }}
          ListEmptyComponent={() => (
            <Text className="text-white text-center font-poppins-regular">
              Nenhum desafio encontrado
            </Text>
          )}
        />
      </View>
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View className="flex-1 bg-black/50">
          <View className="bg-background h-full mt-20 rounded-t-3xl p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white font-poppins-medium text-lg">
                Criar Desafio
              </Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Text className="text-white text-lg">✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}>
              <Text className="text-white mb-2 font-poppins-medium">
                Título do desafio
              </Text>
              <TextInput
                placeholder="Ex: Desafio de Peito - 30 dias"
                placeholderTextColor="#9ca3af"
                value={title}
                onChangeText={setTitle}
                className="bg-zinc-700 rounded-lg text-white p-4 mb-3"
              />
              <Text className="text-white mb-2 font-poppins-medium">
                Data de início
              </Text>
              <TextInput
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#9ca3af"
                value={startDate}
                onChangeText={(text) => setStartDate(Mask.maskBirthday(text))}
                className="bg-zinc-700 rounded-lg text-white p-4 mb-3"
              />
              <Text className="text-white mb-2 font-poppins-medium">
                Data de término
              </Text>
              <TextInput
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#9ca3af"
                value={endDate}
                onChangeText={(text) => setEndDate(Mask.maskBirthday(text))}
                className="bg-zinc-700 rounded-lg text-white p-4 mb-3"
              />
              <View className="flex-row mb-3">
                <TouchableOpacity
                  className={`flex-1 p-4 rounded-lg mr-2 ${type === "public" ? "bg-purple-600" : "bg-zinc-700"}`}
                  onPress={() => setType("public")}
                >
                  <Text className="text-white text-center">Público</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 p-4 rounded-lg ${type === "private" ? "bg-purple-600" : "bg-zinc-700"}`}
                  onPress={() => setType("private")}
                >
                  <Text className="text-white text-center">Privado</Text>
                </TouchableOpacity>
              </View>
              <View className="mb-3">
                <Text className="text-white mb-2 font-poppins-medium">
                  Tipo de Desafio
                </Text>
                <View className="flex-row flex-wrap">
                  {[
                    { key: "frequency", label: "Frequência" },
                    { key: "volume", label: "Volume" },
                    { key: "time", label: "Tempo" },
                    { key: "execution", label: "Execução" },
                    { key: "resistance", label: "Resistência" },
                    { key: "specific_goal", label: "Meta Específica" },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.key}
                      className={`p-2 rounded-lg m-1 ${challengeCategory === option.key ? "bg-purple-600" : "bg-zinc-700"}`}
                      onPress={() => setChallengeCategory(option.key)}
                    >
                      <Text className="text-white capitalize">
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {challengeCategory === "specific_goal" && (
                <>
                  <Text className="text-white mb-2 font-poppins-medium">
                    Meta (número fixo)
                  </Text>
                  <TextInput
                    placeholder="Ex: 100"
                    placeholderTextColor="#9ca3af"
                    value={goal}
                    onChangeText={setGoal}
                    keyboardType="numeric"
                    className="bg-zinc-700 rounded-lg text-white p-4 mb-3"
                  />
                </>
              )}
              <Text className="text-white mb-2 font-poppins-medium">
                Máximo de participantes
              </Text>
              <TextInput
                placeholder="Ex: 20"
                placeholderTextColor="#9ca3af"
                value={maxParticipants}
                onChangeText={setMaxParticipants}
                keyboardType="numeric"
                className="bg-zinc-700 rounded-lg text-white p-4 mb-3"
              />
              <Text className="text-white mb-2 font-poppins-medium">
                Grupo muscular
              </Text>
              <TextInput
                placeholder="Ex: Peito, Costas, Pernas, Braços..."
                placeholderTextColor="#9ca3af"
                value={muscleGroup}
                onChangeText={setMuscleGroup}
                className="bg-zinc-700 rounded-lg text-white p-4 mb-3"
              />
              <TouchableOpacity
                className="bg-zinc-700 rounded-lg p-4 items-center mb-6"
                onPress={pickImage}
              >
                <Text className="text-white font-poppins-medium">
                  {imageUrl ? "Alterar imagem" : "Escolher imagem da galeria"}
                </Text>
              </TouchableOpacity>
              {imageUrl && (
                <Image
                  source={{ uri: imageUrl }}
                  className="w-full h-40 rounded-lg mb-6"
                  resizeMode="cover"
                />
              )}
              <TouchableOpacity
                className="bg-purple-600 rounded-lg p-4 items-center mb-4"
                onPress={handleCreateChallenge}
              >
                <Text className="text-white font-poppins-medium">Criar Desafio</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

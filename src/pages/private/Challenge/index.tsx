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
  WinningCriteriaID,
  RegistrationMethodID,
  UnitID,
} from "@/api/challenges";
import { ChallengeCard } from "@/components/Challenge/Card";
import { useSession } from "@/providers/SessionProvider";
import { Mask } from "@/utils/mask";
import * as ImagePicker from "expo-image-picker";

export const TAB_BAR_HEIGHT = 64;

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
  // challengeCategory agora usará os novos tipos: "frequência", "volume de treino", "por peso total", "resistencia", "metas de distancia"
  const [challengeCategory, setChallengeCategory] =
    useState("volume de treino");
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
    // Exige grupo muscular somente para desafios de "volume de treino"
    if (challengeCategory === "volume de treino" && !muscleGroup) {
      Alert.alert("Erro", "Por favor, insira o grupo muscular");
      return false;
    }
    if (type === "private" && !inviteCode) {
      Alert.alert(
        "Erro",
        "Por favor, insira um código de convite para o desafio privado"
      );
      return false;
    }
    if (challengeCategory === "metas de distancia" && !goal) {
      Alert.alert(
        "Erro",
        "Por favor, insira a meta para o desafio de metas de distância"
      );
      return false;
    }
    return true;
  };

  const handleCreateChallenge = async () => {
    if (!validateFields()) return;

    // Mapeamento para definir os valores conforme a categoria selecionada.
    // Observe que os valores agora estão de acordo com os registros da tabela metrics:
    const mapping: Record<
      string,
      {
        metric_id: number;
        winning_criteria_id: number;
        registration_method_id: number;
        unit_id: number | null;
        goal?: number;
      }
    > = {
      frequência: {
        metric_id: 1,
        winning_criteria_id: 1, // por exemplo, maior número de check-ins (ajuste conforme sua lógica)
        registration_method_id: 1,
        unit_id: null,
        goal: undefined,
      },
      "volume de treino": {
        metric_id: 2,
        winning_criteria_id: 1, // maior soma
        registration_method_id: 1,
        unit_id: 1, // kg (como exemplo)
        goal: undefined,
      },
      "por peso total": {
        metric_id: 3,
        winning_criteria_id: 1,
        registration_method_id: 1,
        unit_id: 1, // kg
        goal: undefined,
      },
      resistencia: {
        metric_id: 4,
        winning_criteria_id: 3, // menor tempo vence
        registration_method_id: 1,
        unit_id: 2, // minutos
        goal: undefined,
      },
      "metas de distancia": {
        metric_id: 5,
        winning_criteria_id: 1,
        registration_method_id: 1,
        unit_id: null,
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
      muscle_group:
        challengeCategory === "volume de treino" ? muscleGroup : undefined,
      image_url: imageUrl,
      invite_code: type === "private" ? inviteCode : undefined,
      metric_id: mapping[challengeCategory].metric_id as MetricID,
      winning_criteria_id: mapping[challengeCategory]
        .winning_criteria_id as WinningCriteriaID,
      registration_method_id: mapping[challengeCategory]
        .registration_method_id as RegistrationMethodID,
      unit_id: mapping[challengeCategory].unit_id as UnitID,
      goal: mapping[challengeCategory].goal,
    };

    try {
      await createChallenge(challenge);
      onRefresh();
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
    setChallengeCategory("volume de treino");
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
            <ChallengeCard
              key={item.id}
              updateFront={setChallenges}
              {...item}
            />
          )}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
            />
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
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT }}
            >
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
                  className={`flex-1 p-4 rounded-lg mr-2 ${
                    type === "public" ? "bg-purple-600" : "bg-zinc-700"
                  }`}
                  onPress={() => setType("public")}
                >
                  <Text className="text-white text-center">Público</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 p-4 rounded-lg ${
                    type === "private" ? "bg-purple-600" : "bg-zinc-700"
                  }`}
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
                    { key: "frequência", label: "Frequência" },
                    { key: "volume de treino", label: "Volume de Treino" },
                    { key: "por peso total", label: "Por Peso Total" },
                    { key: "resistencia", label: "Resistência" },
                    { key: "metas de distancia", label: "Metas de Distância" },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.key}
                      className={`p-2 rounded-lg m-1 ${
                        challengeCategory === option.key
                          ? "bg-purple-600"
                          : "bg-zinc-700"
                      }`}
                      onPress={() => setChallengeCategory(option.key)}
                    >
                      <Text className="text-white capitalize">
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {type === "private" && (
                <>
                  <Text className="text-white mb-2 font-poppins-medium">
                    Código de convite
                  </Text>
                  <TextInput
                    placeholder="Digite um código para seu desafio privado"
                    placeholderTextColor="#9ca3af"
                    value={inviteCode}
                    onChangeText={setInviteCode}
                    className="bg-zinc-700 rounded-lg text-white p-4 mb-3"
                  />
                </>
              )}
              {challengeCategory === "metas de distancia" && (
                <>
                  <Text className="text-white mb-2 font-poppins-medium">
                    Meta (número fixo)
                  </Text>
                  <TextInput
                    placeholder="Ex: 5 (km)"
                    placeholderTextColor="#9ca3af"
                    value={goal}
                    onChangeText={setGoal}
                    keyboardType="numeric"
                    className="bg-zinc-700 rounded-lg text-white p-4 mb-3"
                  />
                </>
              )}
              {challengeCategory === "volume de treino" && (
                <>
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
                <Text className="text-white font-poppins-medium">
                  Criar Desafio
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

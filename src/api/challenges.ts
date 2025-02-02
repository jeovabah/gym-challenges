import { supabase } from "@/utils/supabase";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

// Tipos conforme o novo modelo
export type MetricID = 1 | 2 | 3 | 4 | 5; // 1: treinos, 2: peso_total, 3: tempo_total, 4: repeticoes, 5: calorias
export type WinningCriteriaID = 1 | 2 | 3; // 1: maior_soma, 2: maior_media, 3: menor_tempo
export type RegistrationMethodID = 1 | 2; // 1: manual, 2: automatico
export type UnitID = 1 | 2 | 3 | 4; // 1: kg, 2: minutos, 3: repeticoes, 4: calorias

export type Challenge = {
  id: string;
  title: string;
  type: "public" | "private";
  start_date: string;
  end_date: string;
  reward_points: number;
  max_participants: number | null;
  participant_count: number;
  invite_code?: string;
  rules: string;
  status?: string;
  creator_id?: string;
  creator?: { name: string };
  isParticipating?: boolean;
  challenge_participants?: any;
  metric_id?: MetricID;
  metric?: { name: string };
  winning_criteria_id?: WinningCriteriaID;
  winning_criteria?: { name: string };
  registration_method_id?: RegistrationMethodID;
  registration_method?: { name: string };
  unit_id?: UnitID | null;
  unit?: { name: string };
  goal?: number;
  muscle_group?: string;
  image_url?: string;
  winner_id?: string;
  winner?: { name: string };
};

type ChallengeResponse = PostgrestSingleResponse<Challenge[]>;

export const getChallenges = async (userId?: string): Promise<Challenge[]> => {
  const { data, error }: ChallengeResponse = await supabase
    .from("challenges")
    .select(
      `
      id,
      title,
      type,
      start_date,
      end_date,
      reward_points,
      max_participants,
      rules,
      invite_code,
      status,
      creator_id,
      creator:creator_id(name),
      metric_id,
      metric:metrics(name),
      winning_criteria_id,
      winning_criteria:winning_criteria(name),
      registration_method_id,
      registration_method:registration_methods(name),
      unit_id,
      unit:units(name),
      goal,
      image_url,
      winner_id,
      winner:winner_id(name),
      participant_count:challenge_participants(count),
      challenge_participants!left(user_id)
    `
    )
    .returns<Challenge[]>();

  if (error) {
    throw new Error(`Erro ao listar desafios: ${error.message}`);
  }

  return (data || []).map((challenge) => ({
    ...challenge,
    participant_count: challenge.participant_count || 0,
    isParticipating: challenge.challenge_participants?.some((p: any) => p.user_id === userId),
  }));
};

export const showChallenge = async (
  challenge_id: string,
  user_id?: string
): Promise<Challenge> => {
  type SingleChallengeResponse = {
    id: string;
    title: string;
    type: "public" | "private";
    start_date: string;
    end_date: string;
    reward_points: number;
    max_participants: number | null;
    rules: string;
    invite_code?: string;
    status?: string;
    creator_id?: string;
    creator?: { name: string };
    metric_id?: MetricID;
    metric?: { name: string };
    winning_criteria_id?: WinningCriteriaID;
    winning_criteria?: { name: string };
    registration_method_id?: RegistrationMethodID;
    registration_method?: { name: string };
    unit_id?: UnitID | null;
    unit?: { name: string };
    goal?: number;
    image_url?: string;
    winner_id?: string;
    winner?: { name: string };
    participant_count: { count: number }[];
    challenge_participants: { user_id: string }[];
  };

  const { data, error } = await supabase
    .from("challenges")
    .select(
      `
      id,
      title,
      type,
      start_date,
      end_date,
      reward_points,
      max_participants,
      rules,
      invite_code,
      status,
      creator_id,
      creator:creator_id(name),
      metric_id,
      metric:metrics(name),
      winning_criteria_id,
      winning_criteria:winning_criteria(name),
      registration_method_id,
      registration_method:registration_methods(name),
      unit_id,
      unit:units(name),
      goal,
      image_url,
      winner_id,
      winner:winner_id(name),
      participant_count:challenge_participants(count),
      challenge_participants!left(user_id)
    `
    )
    .eq("id", challenge_id)
    .single<SingleChallengeResponse>();

  if (error) {
    throw new Error(`Erro ao buscar desafio: ${error.message}`);
  }
  if (!data) {
    throw new Error("Desafio não encontrado");
  }

  return {
    ...data,
    participant_count: data.participant_count?.[0]?.count || 0,
    isParticipating: data.challenge_participants?.some((p) => p.user_id === user_id),
  };
};

export const joinChallenge = async (
  user_id: string,
  challenge_id: string,
  invite_code?: string
): Promise<{ message: string }> => {
  type ChallengeDetails = Pick<
    Challenge,
    "type" | "invite_code" | "max_participants" | "participant_count"
  >;

  const { data, error: challengeError } = await supabase
    .from("challenges")
    .select(
      `
      type,
      invite_code,
      max_participants,
      participant_count:challenge_participants(count)
    `
    )
    .eq("id", challenge_id)
    .single<ChallengeDetails>();

  if (challengeError) {
    throw new Error(`Erro ao buscar detalhes do desafio: ${challengeError.message}`);
  }
  if (!data) {
    throw new Error("Desafio não encontrado");
  }
  if (data.type === "private" && data.invite_code !== invite_code) {
    throw new Error("Código de convite inválido para este desafio privado.");
  }
  if (data.type === "public" && data.max_participants) {
    const currentParticipants = data.participant_count || 0;
    if (currentParticipants >= data.max_participants) {
      throw new Error("Este desafio público atingiu o limite máximo de participantes.");
    }
  }
  const { error: insertError } = await supabase
    .from("challenge_participants")
    .insert([{ challenge_id, user_id }]);
  if (insertError) {
    throw new Error(`Erro ao entrar no desafio: ${insertError.message}`);
  }
  return { message: "Você entrou no desafio com sucesso!" };
};

export type CreateChallengeInput = Omit<
  Challenge,
  "id" | "participant_count" | "isParticipating"
> & {
  creator_id: string;
  muscle_group?: string;
  image_url?: string;
};

export const createChallenge = async (
  challenge: CreateChallengeInput
): Promise<Challenge> => {
  const imageStorageUrl = await uploadChallengeImage(challenge.image_url || "");
  // Mapeamento para definir os valores conforme a categoria selecionada
  const mapping: Record<string, {
    metric_id: MetricID;
    winning_criteria_id: WinningCriteriaID;
    registration_method_id: RegistrationMethodID;
    unit_id: UnitID | null;
    goal?: number;
  }> = {
    treinos: {
      metric_id: 1,
      winning_criteria_id: 1,
      registration_method_id: 1,
      unit_id: null, // frequência, sem unidade
      goal: undefined,
    },
    peso_total: {
      metric_id: 2,
      winning_criteria_id: 1,
      registration_method_id: 1,
      unit_id: 1, // kg
      goal: undefined,
    },
    tempo_total: {
      metric_id: 3,
      winning_criteria_id: 1,
      registration_method_id: 1,
      unit_id: 2, // minutos
      goal: undefined,
    },
    repeticoes: {
      metric_id: 4,
      winning_criteria_id: 1,
      registration_method_id: 1,
      unit_id: 3, // repetições
      goal: undefined,
    },
    calorias: {
      metric_id: 5,
      winning_criteria_id: 1,
      registration_method_id: 1,
      unit_id: 4, // calorias
      goal: undefined,
    },
  };

  // Se não houver metric_id definido no desafio, usamos "treinos" como padrão
  const categoryKey =
    challenge.metric_id && mapping[String(challenge.metric_id)]
      ? String(challenge.metric_id)
      : "treinos";
  const category = mapping[categoryKey] || mapping["treinos"];

  const finalChallenge: CreateChallengeInput = {
    ...challenge,
    image_url: imageStorageUrl,
    metric_id: category.metric_id,
    winning_criteria_id: category.winning_criteria_id,
    registration_method_id: category.registration_method_id,
    unit_id: category.unit_id,
    goal: category.goal,
  };

  const { data: challengeData, error: challengeError } = await supabase
    .from("challenges")
    .insert([finalChallenge])
    .select(`
      id,
      title,
      type,
      start_date,
      end_date,
      reward_points,
      max_participants,
      rules,
      invite_code,
      status,
      creator_id,
      creator:creator_id(name),
      metric_id,
      metric:metrics(name),
      winning_criteria_id,
      winning_criteria:winning_criteria(name),
      registration_method_id,
      registration_method:registration_methods(name),
      unit_id,
      unit:units(name),
      goal,
      image_url,
      winner_id,
      winner:winner_id(name),
      participant_count:challenge_participants(count),
      challenge_participants!left(user_id)
    `)
    .single<Challenge>();

  if (challengeError) {
    throw new Error(`Erro ao criar desafio: ${challengeError.message}`);
  }
  if (!challengeData) {
    throw new Error("Erro ao criar desafio: Nenhum dado retornado");
  }
  const { error: participantError } = await supabase
    .from("challenge_participants")
    .insert([{ challenge_id: challengeData.id, user_id: challenge.creator_id }]);
  if (participantError) {
    throw new Error(`Erro ao adicionar criador como participante: ${participantError.message}`);
  }
  return challengeData;
};

export const registerWorkout = async ({
  user_id,
  challenge_id,
  muscle_group,
  volume,
  image_url,
  location,
}: {
  user_id: string;
  challenge_id: string;
  muscle_group?: string;
  volume?: number;
  image_url?: string;
  location?: string;
}): Promise<{ message: string }> => {
  // Obtem os dados do desafio (registration_method_id e metric_id)
  const { data: challengeInfo, error: challengeErr } = await supabase
    .from("challenges")
    .select("registration_method_id, metric_id")
    .eq("id", challenge_id)
    .single();
  if (challengeErr || !challengeInfo) {
    throw new Error(`Não foi possível obter dados do desafio: ${challengeErr?.message}`);
  }
  
  // Se o método de registro for manual (ID 1), permitir somente um registro diário.
  const today = new Date().toISOString().split("T")[0];
  if (challengeInfo.registration_method_id === 1) {
    const { data: existingLogs, error: checkError } = await supabase
      .from("workout_logs")
      .select("id")
      .eq("user_id", user_id)
      .eq("challenge_id", challenge_id)
      .eq("date", today);
    if (checkError) {
      throw new Error(`Erro ao verificar registros: ${checkError.message}`);
    }
    if (existingLogs && existingLogs.length > 0) {
      throw new Error("Você já registrou um treino para hoje (check-in diário).");
    }
  }
  
  // Ajusta o volume conforme a métrica do desafio.
  let finalVolume = volume;
  // Se for desafio de "treinos" (métrica 1), registrar volume como 1 (apenas conta um treino)
  if (challengeInfo.metric_id === 1) {
    finalVolume = 1;
  }
  // Para as demais métricas (peso_total, tempo_total, repetições, calorias), assumimos que o volume já foi calculado no cliente.
  
  const uploadedImageUrl = image_url ? await uploadChallengeImage(image_url) : undefined;
  
  const { data: workoutLog, error: insertError } = await supabase
    .from("workout_logs")
    .insert([{
      user_id,
      challenge_id,
      date: today,
      muscle_group,
      volume: finalVolume,
      image_url: uploadedImageUrl,
      location,
    }])
    .select()
    .single();
  if (insertError) {
    throw new Error(`Erro ao registrar treino: ${insertError.message}`);
  }
  
  const msgText = `Registrou um treino de ${muscle_group || "exercício"} com volume total de ${finalVolume || 0}`;
  
  const { error: chatError } = await supabase
    .from("challenge_chats")
    .insert([{ 
      user_id, 
      challenge_id, 
      message: msgText, 
      image_url: uploadedImageUrl, 
      is_workout_log: true 
    }]);
  if (chatError) {
    throw new Error(`Erro ao registrar mensagem do treino: ${chatError.message}`);
  }
  return { message: "Treino registrado com sucesso!" };
};

export const sendMessageChallenge = async ({
  user_id,
  challenge_id,
  message,
  image_url,
}: {
  user_id: string;
  challenge_id: string;
  message: string;
  image_url?: string;
}): Promise<{ message: string }> => {
  const uploadedImageUrl = image_url ? await uploadChallengeImage(image_url) : undefined;
  const { error } = await supabase
    .from("challenge_chats")
    .insert([{ user_id, challenge_id, message, image_url: uploadedImageUrl }]);
  if (error) {
    throw new Error(`Erro ao enviar mensagem: ${error.message}`);
  }
  return { message: "Mensagem enviada com sucesso!" };
};

export const getChatMessages = async (challenge_id: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from("challenge_chats")
    .select(`
      id,
      user_id,
      message,
      image_url,
      created_at,
      is_workout_log,
      user:user_id ( name )
    `)
    .eq("challenge_id", challenge_id)
    .order("created_at", { ascending: true });
  if (error) {
    throw new Error(`Erro ao buscar mensagens do chat: ${error.message}`);
  }
  return data || [];
};

export const finalizeChallenge = async (
  challenge_id: string,
  user_id: string
): Promise<{ winner_id: string; message: string }> => {
  const { data: challenge, error: challengeError } = await supabase
    .from("challenges")
    .select("creator_id, reward_points, metric_id, winning_criteria_id, goal")
    .eq("id", challenge_id)
    .single();
  if (challengeError || !challenge) {
    throw new Error(`Erro ao buscar desafio: ${challengeError?.message}`);
  }
  if (challenge.creator_id !== user_id) {
    throw new Error("Apenas o criador do desafio pode finalizá-lo");
  }
  let winner_id: string | null = null;
  if (challenge.winning_criteria_id === 3) {
    // Critério: Menor tempo – o primeiro a atingir ou superar a meta
    const { data: metaData, error } = await supabase
      .from("workout_logs")
      .select("user_id, date, volume")
      .eq("challenge_id", challenge_id)
      .gte("volume", challenge.goal || 0)
      .order("date", { ascending: true });
    if (error) {
      throw new Error(`Erro ao buscar logs para meta: ${error.message}`);
    }
    if (!metaData || metaData.length === 0) {
      throw new Error("Nenhum participante atingiu a meta.");
    }
    winner_id = metaData[0].user_id;
  } else {
    // Critério padrão: Maior soma
    const { data: totalLogs, error: volumeError } = await supabase
      .from("workout_logs")
      .select("user_id, volume")
      .eq("challenge_id", challenge_id);
    if (volumeError) {
      throw new Error(`Erro ao calcular logs: ${volumeError.message}`);
    }
    if (!totalLogs || totalLogs.length === 0) {
      throw new Error("Nenhum registro encontrado para este desafio.");
    }
    const totals = totalLogs.reduce((acc: { [key: string]: number }, curr) => {
      acc[curr.user_id] = (acc[curr.user_id] || 0) + (curr.volume || 0);
      return acc;
    }, {});
    winner_id = Object.entries(totals).sort(([, a], [, b]) => b - a)[0][0];
  }
  if (!winner_id) {
    throw new Error("Não foi possível determinar o vencedor.");
  }
  const { error: updateChallengeError } = await supabase
    .from("challenges")
    .update({ winner_id, status: "completed" })
    .eq("id", challenge_id);
  if (updateChallengeError) {
    throw new Error(`Erro ao atualizar desafio: ${updateChallengeError.message}`);
  }

  // Atualiza os pontos do vencedor somando os pontos de recompensa
  const { data: userData, error: userError } = await supabase
    .from("users_clients")
    .select("points")
    .eq("user_id", winner_id)
    .single();
  if (userError) {
    throw new Error(`Erro ao buscar pontos do usuário: ${userError.message}`);
  }
  const currentPoints = userData?.points || 0;
  const newPoints = currentPoints + (challenge.reward_points || 0);
  const { error: updatePointsError } = await supabase
    .from("users_clients")
    .update({ points: newPoints })
    .eq("user_id", winner_id);
  if (updatePointsError) {
    throw new Error(`Erro ao atribuir pontos: ${updatePointsError.message}`);
  }
  return { winner_id, message: "Desafio finalizado com sucesso!" };
};

const uploadChallengeImage = async (imageUri: string): Promise<string | undefined> => {
  if (!imageUri) return undefined;
  try {
    const timestamp = new Date().getTime();
    const filename = `challenge-${timestamp}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("challenges")
      .upload(filename, imageUri, { contentType: "image/jpeg" });
    if (uploadError) {
      console.error(uploadError);
      throw new Error(`Erro ao fazer upload da imagem: ${uploadError.message}`);
    }
    const { data: { publicUrl } } = supabase.storage.from("challenges").getPublicUrl(filename);
    return publicUrl;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

import { supabase } from "@/utils/supabase";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

export type MetricID = 1 | 2 | 3 | 4 | 5;

export type WinningCriteriaID = 1 | 2 | 3;

export type RegistrationMethodID = 1 | 2;

export type UnitID = 1 | 2 | 3 | 4;

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
  winner?: { name: string; elo?: { name?: string; id?: string } };
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
    isParticipating: challenge.challenge_participants?.some(
      (p: any) => p.user_id === userId
    ),
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
    winner?: { name: string; elo?: { name?: string; id?: string } };
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
      winner:users_clients!winner_id(name, elo:elos(name,id)),
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
  console.log(data)

  return {
    ...data,
    participant_count: data.participant_count?.[0]?.count || 0,
    isParticipating: data.challenge_participants?.some(
      (p) => p.user_id === user_id
    ),
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
    throw new Error(
      `Erro ao buscar detalhes do desafio: ${challengeError.message}`
    );
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
      throw new Error(
        "Este desafio público atingiu o limite máximo de participantes."
      );
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
  const finalChallenge: CreateChallengeInput = {
    ...challenge,
    image_url: imageStorageUrl,
  };

  const { data: challengeData, error: challengeError } = await supabase
    .from("challenges")
    .insert([finalChallenge])
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
    .single<Challenge>();

  if (challengeError) {
    throw new Error(`Erro ao criar desafio: ${challengeError.message}`);
  }
  if (!challengeData) {
    throw new Error("Erro ao criar desafio: Nenhum dado retornado");
  }
  const { error: participantError } = await supabase
    .from("challenge_participants")
    .insert([
      { challenge_id: challengeData.id, user_id: challenge.creator_id },
    ]);
  if (participantError) {
    throw new Error(
      `Erro ao adicionar criador como participante: ${participantError.message}`
    );
  }
  return challengeData;
};

export const registerWorkout = async (payload: {
  user_id: string;
  challenge_id: string;
  image_url?: string;
  location?: string;
  muscle_group?: string;
  exercise_sets?: { reps: string; weight: string }[];
  total_weight?: number;
  endurance_time?: number;
  strava_data?: number;
}): Promise<{ message: string }> => {
  const { data: challengeInfo, error: challengeErr } = await supabase
    .from("challenges")
    .select("metric:metrics(name)")
    .eq("id", payload.challenge_id)
    .single();
  if (challengeErr || !challengeInfo) {
    throw new Error(
      `Não foi possível obter dados do desafio: ${challengeErr?.message}`
    );
  }
  const today = new Date().toISOString().split("T")[0];
  const metricName = challengeInfo.metric?.name?.toLowerCase() || "";
  let finalVolume: number = 0;
  if (metricName === "frequência") {
    const { data: existingLogs, error: checkError } = await supabase
      .from("workout_logs")
      .select("id")
      .eq("user_id", payload.user_id)
      .eq("challenge_id", payload.challenge_id)
      .eq("date", today);
    if (checkError) {
      throw new Error(`Erro ao verificar registros: ${checkError.message}`);
    }
    if (existingLogs && existingLogs.length > 0) {
      throw new Error("Você já registrou um check-in para hoje.");
    }
    finalVolume = 1;
  } else if (metricName === "volume de treino") {
    if (!payload.exercise_sets || !Array.isArray(payload.exercise_sets)) {
      throw new Error("Dados das séries não fornecidos para volume de treino.");
    }
    finalVolume = payload.exercise_sets.reduce((sum, set) => {
      return sum + Number(set.reps) * Number(set.weight);
    }, 0);
  } else if (metricName === "por peso total") {
    if (payload.total_weight == null) {
      throw new Error("Peso total não fornecido.");
    }
    finalVolume = Number(payload.total_weight);
  } else if (metricName === "resistencia") {
    if (payload.endurance_time == null) {
      throw new Error("Tempo de resistência não fornecido.");
    }
    finalVolume = Number(payload.endurance_time);
  } else if (metricName === "metas de distancia") {
    if (payload.strava_data == null) {
      throw new Error("Dados de distância do Strava não fornecidos.");
    }
    finalVolume = Number(payload.strava_data);
  } else {
    throw new Error("Métrica do desafio não reconhecida.");
  }

  const uploadedImageUrl = payload.image_url
    ? await uploadChallengeImage(payload.image_url)
    : undefined;

  const { data: workoutLog, error: insertError } = await supabase
    .from("workout_logs")
    .insert([
      {
        user_id: payload.user_id,
        challenge_id: payload.challenge_id,
        date: today,
        muscle_group: payload.muscle_group,
        volume: finalVolume,
        image_url: uploadedImageUrl,
        location: payload.location,
        exercise_sets: payload.exercise_sets ? payload.exercise_sets : null,
        total_weight:
          payload.total_weight != null ? payload.total_weight : null,
        endurance_time:
          payload.endurance_time != null ? payload.endurance_time : null,
        strava_data:
          payload.strava_data != null ? Number(payload.strava_data) : null,
      },
    ])
    .select()
    .single();
  if (insertError) {
    throw new Error(`Erro ao registrar treino: ${insertError.message}`);
  }

  let msgText = "";
  if (metricName === "frequência") {
    msgText = `Registrou um check-in de frequência.`;
  } else if (metricName === "volume de treino") {
    msgText = `Registrou treino de volume para ${
      payload.muscle_group || "exercício"
    } com volume total de ${finalVolume}.`;
  } else if (metricName === "por peso total") {
    msgText = `Registrou treino com peso total de ${finalVolume} kg.`;
  } else if (metricName === "resistencia") {
    msgText = `Registrou treino de resistência com tempo total de ${finalVolume} minutos.`;
  } else if (metricName === "metas de distancia") {
    msgText = `Registrou treino de distância com ${finalVolume} km percorridos.`;
  } else {
    msgText = `Registrou um treino.`;
  }

  const { error: chatError } = await supabase.from("challenge_chats").insert([
    {
      user_id: payload.user_id,
      challenge_id: payload.challenge_id,
      message: msgText,
      image_url: uploadedImageUrl,
      is_workout_log: true,
    },
  ]);
  if (chatError) {
    throw new Error(
      `Erro ao registrar mensagem do treino: ${chatError.message}`
    );
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
  const uploadedImageUrl = image_url
    ? await uploadChallengeImage(image_url)
    : undefined;
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
    .select(
      `
      id,
      user_id,
      message,
      image_url,
      created_at,
      is_workout_log,
      user:user_id ( name )
    `
    )
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
    .select(
      "creator_id, reward_points, metric:metrics(name), winning_criteria_id, goal"
    )
    .eq("id", challenge_id)
    .single();
  if (challengeError || !challenge) {
    throw new Error(`Erro ao buscar desafio: ${challengeError?.message}`);
  }
  if (challenge.creator_id !== user_id) {
    throw new Error("Apenas o criador do desafio pode finalizá-lo.");
  }

  const metricName = challenge.metric?.name?.toLowerCase() || "";

  const { data: logs, error: logsError } = await supabase
    .from("workout_logs")
    .select("user_id, volume")
    .eq("challenge_id", challenge_id);
  if (logsError) {
    throw new Error(`Erro ao buscar logs: ${logsError.message}`);
  }
  if (!logs || logs.length === 0) {
    throw new Error("Nenhum registro encontrado para este desafio.");
  }

  const userTotals: { [user_id: string]: number } = {};
  logs.forEach((log) => {
    userTotals[log.user_id] =
      (userTotals[log.user_id] || 0) + (log.volume || 0);
  });

  let validEntries = Object.entries(userTotals);
  if (challenge.goal) {
    validEntries = validEntries.filter(
      ([uid, total]) => total >= challenge.goal
    );
    if (validEntries.length === 0) {
      throw new Error("Nenhum participante atingiu a meta.");
    }
  }

  let winner_id: string | null = null;
  if (metricName === "resistencia" && challenge.winning_criteria_id === 3) {
    winner_id = validEntries.sort(([, a], [, b]) => a - b)[0][0];
  } else {
    winner_id = validEntries.sort(([, a], [, b]) => b - a)[0][0];
  }
  if (!winner_id) {
    throw new Error("Não foi possível determinar o vencedor.");
  }
  const { error: updateChallengeError } = await supabase
    .from("challenges")
    .update({ winner_id, status: "completed" })
    .eq("id", challenge_id);
  if (updateChallengeError) {
    throw new Error(
      `Erro ao atualizar desafio: ${updateChallengeError.message}`
    );
  }

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

export const deleteChallenge = async (challenge_id: string): Promise<void> => {
  const { error } = await supabase.from("challenges").delete().eq("id", challenge_id);
  if (error) {
    throw new Error(`Erro ao deletar desafio: ${error.message}`);
  }
};

const uploadChallengeImage = async (
  imageUri: string
): Promise<string | undefined> => {
  if (!imageUri) return undefined;
  try {
    const timestamp = new Date().getTime();
    const filename = `challenge-${timestamp}.jpg`;

    const file = {
      name: filename,
      type: "image/jpeg",
      uri: imageUri,
    };

    const { error: uploadError } = await supabase.storage
      .from("challenges")
      .upload(filename, file as any);
    if (uploadError) {
      console.error(uploadError);
      throw new Error(`Erro ao fazer upload da imagem: ${uploadError.message}`);
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("challenges").getPublicUrl(filename);
    return publicUrl;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

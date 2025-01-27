import { supabase } from "@/utils/supabase";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

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
  isParticipating?: boolean;
  challenge_participants?: any;
  workout_type?: "regular" | "volume";
  muscle_group?: string;
  image_url?: string;
};

type ChallengeResponse = PostgrestSingleResponse<Challenge[]>;

export const getChallenges = async (id?: string): Promise<Challenge[]> => {
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
      workout_type,
      muscle_group,
      image_url,
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
    isParticipating: challenge.challenge_participants?.some(
      (p: any) => p.user_id === id
    ),
  }));
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
    console.log(JSON.stringify(challengeError, null, 2));
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
  "id" | "participant_count"
> & {
  creator_id: string;
  workout_type: "regular" | "volume";
  muscle_group: string;
  image_url?: string;
};

export const createChallenge = async (
  challenge: CreateChallengeInput
): Promise<Challenge> => {
  const { data: challengeData, error: challengeError } = await supabase
    .from("challenges")
    .insert([challenge])
    .select()
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

export const registerWorkout = async ({
  user_id,
  challenge_id,
  muscle_group,
  volume,
  image_url,
}: {
  user_id: string;
  challenge_id: string;
  muscle_group: string;
  volume?: number;
  image_url: string;
}): Promise<{ message: string }> => {
  const today = new Date().toISOString().split("T")[0];
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
    throw new Error("Você já registrou um treino para hoje.");
  }

  const { error: insertError } = await supabase.from("workout_logs").insert([
    {
      user_id,
      challenge_id,
      date: today,
      muscle_group,
      volume,
      image_url,
    },
  ]);

  if (insertError) {
    throw new Error(`Erro ao registrar treino: ${insertError.message}`);
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
  const { error } = await supabase
    .from("challenge_chats")
    .insert([{ user_id, challenge_id, message, image_url }]);

  if (error) {
    throw new Error(`Erro ao enviar mensagem: ${error.message}`);
  }

  return { message: "Mensagem enviada com sucesso!" };
};

export const getChatMessages = async (challenge_id: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from("challenge_chats")
    .select("id, user_id, message, image_url, created_at")
    .eq("challenge_id", challenge_id)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Erro ao buscar mensagens do chat: ${error.message}`);
  }

  return data || [];
};

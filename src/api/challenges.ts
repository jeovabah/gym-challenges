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
};

type ChallengeResponse = PostgrestSingleResponse<Challenge[]>;

export const getChallenges = async (): Promise<Challenge[]> => {
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
      participant_count:challenge_participants(count)
    `
    )
    .returns<Challenge[]>();

  if (error) {
    throw new Error(`Erro ao listar desafios: ${error.message}`);
  }

  return data || [];
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
      "type, invite_code, max_participants, (SELECT COUNT(*) FROM challenge_participants WHERE challenge_id = id) AS participant_count"
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
  "id" | "participant_count"
> & {
  creator_id: string;
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

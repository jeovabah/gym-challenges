import { supabase } from "@/utils/supabase";

export const getGlobalRanking = async () => {
  const { data, error } = await supabase
    .from("rankings")
    .select("*")
    .order("rank", { ascending: true });
  if (error) throw new Error(`Erro ao buscar ranking global: ${error.message}`);
  return data;
};

export const getFriendsRanking = async (friend_ids: string[]) => {
  const { data, error } = await supabase
    .from("rankings")
    .select("*")
    .in("user_id", friend_ids)
    .order("rank", { ascending: true });
  if (error)
    throw new Error(`Erro ao buscar ranking de amigos: ${error.message}`);
  return data;
};

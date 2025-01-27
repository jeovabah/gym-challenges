import { supabase } from "@/utils/supabase";

export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(`Erro ao buscar o usuário: ${error.message}`);
  }
  return data;
};

export const getUserGamer = async (userId: string) => {
  const { data, error } = await supabase
    .from("users_clients")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) {
    throw new Error(`Erro ao buscar o usuário: ${error.message}`);
  }
  return data;
};

export const updateUser = async (updates: {
  name?: string;
  avatar_url?: string;
}) => {
  const { data, error } = await supabase.auth.updateUser({
    data: updates,
  });
  if (error) {
    throw new Error(`Erro ao atualizar o usuário: ${error.message}`);
  }
  return data;
};

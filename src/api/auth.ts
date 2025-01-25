import { ELOS } from "@/constants/elo";
import { supabase } from "@/utils/supabase";

export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, confirmation_sent_at: new Date().toISOString() } },
  });

  if (error) {
    throw new Error(`Erro no cadastro: ${error.message}`);
  }

  const { error: dbError } = await supabase.from("users_clients").insert({
    user_id: data?.user?.id,
    name,
    points: 0,
    elo_id: ELOS.BRONZE,
    avatar_url: null,
  });

  if (dbError) {
    throw new Error(
      `Erro ao sincronizar com o banco personalizado: ${dbError.message}`
    );
  }

  return data;
};

export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(
      error.code == "invalid_credentials"
        ? "Email ou senha inválidos"
        : error.message
    );
  }

  const { data: userData, error: userError } = await supabase
    .from("users_clients")
    .select("*")
    .eq("user_id", data?.user?.id);

  if (userError) {
    console.log(JSON.stringify(userError));
    throw new Error(`Erro ao buscar o usuário: ${userError.message}`);
  }

  return { user: userData, session: data };
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(`Erro no logout: ${error.message}`);
  }
};

export const reloadSession = async () => {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) {
    throw new Error(`Erro ao recarregar a sessão: ${error.message}`);
  }
  return data;
};

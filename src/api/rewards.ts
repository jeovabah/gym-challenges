import { supabase } from "@/utils/supabase";
export const getRewards = async () => {
  const { data, error } = await supabase.from("rewards").select("*");
  if (error) throw new Error(`Erro ao buscar recompensas: ${error.message}`);
  return data;
};

export const redeemReward = async (user_id: string, reward_id: string) => {
  const { data, error } = await supabase.from("user_rewards").insert([
    {
      user_id,
      reward_id,
      redeemed_at: new Date().toISOString(),
    },
  ]);
  if (error) throw new Error(`Erro ao resgatar recompensa: ${error.message}`);
  return data;
};

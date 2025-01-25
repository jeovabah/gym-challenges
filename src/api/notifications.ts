import { supabase } from "@/utils/supabase";

// Obter notificações do usuário
export const getNotifications = async (user_id: string) => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user_id);
  if (error) throw new Error(`Erro ao buscar notificações: ${error.message}`);
  return data;
};

// Criar notificação
export const createNotification = async (notification: {
  user_id: string;
  message: string;
}) => {
  const { data, error } = await supabase
    .from("notifications")
    .insert([notification]);
  if (error) throw new Error(`Erro ao criar notificação: ${error.message}`);
  return data;
};

// Marcar notificação como lida
export const markNotificationAsRead = async (notificationId: string) => {
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);
  if (error)
    throw new Error(`Erro ao marcar notificação como lida: ${error.message}`);
  return data;
};

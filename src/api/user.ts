import { supabase } from "@/utils/supabase";
import * as SecureStore from "expo-secure-store";
export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(`Erro ao buscar o usuário: ${error.message}`);
  }
  return data;
};

const uploadPostImage = async (
  imageUri: string
): Promise<string | undefined> => {
  if (!imageUri) return undefined;
  try {
    const timestamp = new Date().getTime();
    const filename = `user-${timestamp}.jpg`;

    const file = {
      name: filename,
      type: "image/jpeg",
      uri: imageUri,
    };

    const { error: uploadError } = await supabase.storage
      .from("users")
      .upload(filename, file as any);

    if (uploadError) {
      console.error(uploadError);
      throw new Error(`Erro ao fazer upload da imagem: ${uploadError.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("users").getPublicUrl(filename);
    return publicUrl;
  } catch (error) {
    console.error(error);
    return undefined;
  }
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
  const user = await SecureStore.getItemAsync("user");
  const userId = JSON?.parse(user || "{}")?.auth?.id;

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  const { data, error } = await supabase
    .from("users_clients")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Erro ao atualizar o usuário: ${error.message}`);
  }

  return data;
};

export const updateUserPhoto = async (photoUrl: string) => {
  const user = await SecureStore.getItemAsync("user");
  const userId = JSON?.parse(user || "{}")?.auth?.id;
  const imageUrl = await uploadPostImage(photoUrl);
  const { data, error } = await supabase
    .from("users_clients")
    .update({ avatar_url: imageUrl })
    .eq("user_id", userId);
  if (error) {
    throw new Error(`Erro ao atualizar a foto do usuário: ${error.message}`);
  }
  return data;
};

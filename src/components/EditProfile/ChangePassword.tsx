import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";

interface ChangePasswordProps {
  visible: boolean;
  onClose: () => void;
}

export const ChangePassword = ({ visible, onClose }: ChangePasswordProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      Alert.alert("Sucesso", "Senha atualizada com sucesso!");
      onClose();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar a senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-background w-[90%] rounded-2xl">
          <View className="p-4">
            <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <Text className="text-white font-poppins-semibold text-xl">
                Alterar Senha
              </Text>
              <TouchableOpacity
                onPress={handleChangePassword}
                disabled={loading}
              >
                <Text className="text-primary font-poppins-semibold">
                  {loading ? "Salvando..." : "Salvar"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-gray-400 font-poppins-regular mb-2">
                  Nova senha
                </Text>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  className="bg-[#1E1E1E] text-white p-4 rounded-xl font-poppins-regular"
                  placeholderTextColor="#666"
                />
              </View>

              <View>
                <Text className="text-gray-400 font-poppins-regular mb-2">
                  Confirmar nova senha
                </Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  className="bg-[#1E1E1E] text-white p-4 rounded-xl font-poppins-regular"
                  placeholderTextColor="#666"
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

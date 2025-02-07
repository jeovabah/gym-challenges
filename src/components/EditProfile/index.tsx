import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { updateUser } from "@/api/user";
import { Ionicons } from "@expo/vector-icons";
import { ChangePassword } from "./ChangePassword";

interface EditProfileProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData: {
    name: string;
    email: string;
  };
}

export const EditProfile = ({
  visible,
  onClose,
  onSave,
  initialData,
}: EditProfileProps) => {
  const [name, setName] = useState(initialData.name);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateUser({ name });
      onSave();
      onClose();
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o perfil");
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
                Editar Perfil
              </Text>
              <TouchableOpacity onPress={handleSave} disabled={loading}>
                <Text className="text-primary font-poppins-semibold">
                  {loading ? "Salvando..." : "Salvar"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-gray-400 font-poppins-regular mb-2">
                  Nome
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  className="bg-[#1E1E1E] text-white p-4 rounded-xl font-poppins-regular"
                  placeholderTextColor="#666"
                />
              </View>

              <View>
                <Text className="text-gray-400 font-poppins-regular mb-2">
                  Email
                </Text>
                <TextInput
                  value={initialData.email}
                  editable={false}
                  className="bg-[#1E1E1E] text-gray-400 p-4 rounded-xl font-poppins-regular"
                />
              </View>

              {/* <TouchableOpacity
                onPress={() => setShowPasswordModal(true)}
                className="bg-[#1E1E1E] p-4 rounded-xl flex-row items-center justify-between mt-4"
              >
                <Text className="text-white font-poppins-regular">
                  Alterar senha
                </Text>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </View>

      <ChangePassword
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </Modal>
  );
};

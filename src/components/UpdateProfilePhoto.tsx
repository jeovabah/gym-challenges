import React, { useState } from "react";
import { View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { updateUserPhoto } from "@/api/user";
import { Ionicons } from "@expo/vector-icons";

interface UpdateProfilePhotoProps {
  onPhotoUpdated?: () => void;
}

export const UpdateProfilePhoto = ({
  onPhotoUpdated,
}: UpdateProfilePhotoProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePhoto = async () => {
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        await updateUserPhoto(result.assets[0].uri);
        onPhotoUpdated?.();
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar a foto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleUpdatePhoto}
      disabled={isLoading}
      className="absolute bottom-0 right-0 bg-primary p-2 rounded-full"
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Ionicons name="camera" size={20} color="#fff" />
      )}
    </TouchableOpacity>
  );
};

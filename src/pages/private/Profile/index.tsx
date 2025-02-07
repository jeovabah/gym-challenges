import { useSession } from "@/providers/SessionProvider";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UpdateProfilePhoto } from "@/components/UpdateProfilePhoto";
import { EditProfile } from "@/components/EditProfile";

export const Profile = () => {
  const { signOut, user, getUser } = useSession();
  const [showEditProfile, setShowEditProfile] = useState(false);
  return (
    <SafeAreaView className="flex-1 bg-background px-4 py-8">
      <View className="flex-1">
        <View className="items-center">
          <Text className="text-white font-poppins-semibold text-2xl mb-8">
            Meu Perfil
          </Text>

          {user && (
            <View className="items-center">
              <View className="relative">
                <Image
                  source={{
                    uri:
                      user.game?.avatar_url ||
                      "https://ui-avatars.com/api/?name=" +
                        user?.auth?.user_metadata?.name,
                  }}
                  className="w-32 h-32 rounded-full mb-4"
                />
                <UpdateProfilePhoto
                  onPhotoUpdated={() => {
                    getUser();
                  }}
                />
              </View>
              <Text className="text-white font-poppins-semibold text-xl mb-1">
                {user?.game?.name}
              </Text>
              <Text className="text-gray-400 font-poppins-regular mb-8">
                {user?.auth?.user_metadata?.email}
              </Text>

              <View className="w-full bg-[#1E1E1E] rounded-xl p-4 mb-4">
                <TouchableOpacity
                  className="flex-row items-center justify-between"
                  activeOpacity={0.7}
                  onPress={() => setShowEditProfile(true)}
                >
                  <View className="flex-row items-center">
                    <Ionicons name="person-outline" size={24} color="#fff" />
                    <Text className="text-white font-poppins-medium ml-3">
                      Editar Perfil
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <View className="w-full bg-[#1E1E1E] rounded-xl p-4 mb-4">
                <TouchableOpacity
                  className="flex-row items-center justify-between"
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center">
                    <Ionicons name="settings-outline" size={24} color="#fff" />
                    <Text className="text-white font-poppins-medium ml-3">
                      Configurações
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => {
                  signOut();
                }}
                activeOpacity={0.7}
                className="bg-red-500 p-4 rounded-xl flex-row items-center justify-center w-full mt-4 shadow-lg max-w-xs"
              >
                <View className="flex-row items-center justify-center w-full ">
                  <Ionicons name="log-out-outline" size={24} color="#fff" />
                  <Text className="text-white font-poppins-semibold ml-2">
                    Sair da conta
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <EditProfile
        visible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSave={() => {
          getUser();
        }}
        initialData={{
          name: user?.auth?.user_metadata?.name || "",
          email: user?.auth?.user_metadata?.email || "",
        }}
      />
    </SafeAreaView>
  );
};

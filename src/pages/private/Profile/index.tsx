import { useSession } from "@/providers/SessionProvider";
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const Profile = () => {
  const { signOut, user } = useSession();

  return (
    <View className="flex-1 bg-background px-4 py-8">
      <View className="flex-1">
        <View className="items-center">
          <Text className="text-white font-poppins-semibold text-2xl mb-8">
            Meu Perfil
          </Text>

          {user && (
            <View className="items-center">
              <Image
                source={{
                  uri:
                    "https://ui-avatars.com/api/?name=" +
                    user.auth.user_metadata.name,
                }}
                className="w-32 h-32 rounded-full mb-4"
              />
              <Text className="text-white font-poppins-semibold text-xl mb-1">
                {user.auth.user_metadata.name}
              </Text>
              <Text className="text-gray-400 font-poppins-regular mb-8">
                {user.auth.user_metadata.email}
              </Text>

              <View className="w-full bg-[#1E1E1E] rounded-xl p-4 mb-4">
                <TouchableOpacity
                  className="flex-row items-center justify-between"
                  activeOpacity={0.7}
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
    </View>
  );
};

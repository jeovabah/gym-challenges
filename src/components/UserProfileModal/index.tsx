import { View, Text, Modal, TouchableOpacity, Image, Animated } from "react-native";
import { useRef, useEffect } from "react";
import { getAvatarUrl } from "@/utils/avatar";
import { ELOS_IMAGE, ELOS_NAME } from "@/constants/elo";

type UserProfileModalProps = {
  isVisible: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    avatar_url: string | null;
    elo_id: string;
    points: number;
    following_count?: number;
  };
  isCurrentUser: boolean;
  onToggleFollow: () => Promise<void>;
  isFollowing: boolean;
  followersCount: number;
};

export function UserProfileModal({
  isVisible,
  onClose,
  user,
  isCurrentUser,
  onToggleFollow,
  isFollowing,
  followersCount
}: UserProfileModalProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <TouchableOpacity 
          className="flex-1"
          onPress={onClose}
        />
        
        <Animated.View 
          className="bg-white rounded-t-3xl"
          style={{
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [600, 0],
              })
            }]
          }}
        >
          <View className="p-6">
            <View className="items-center">
              <Image
                source={{ uri: getAvatarUrl(user.name, user.avatar_url) }}
                className="w-20 h-20 rounded-full"
              />
              <Text className="text-xl font-bold mt-4">{user.name}</Text>
              
              <View className="flex-row items-center mt-2">
                <Image
                  source={ELOS_IMAGE[user.elo_id]}
                  className="w-6 h-6"
                  resizeMode="contain"
                />
                <Text className="ml-2">{ELOS_NAME[user.elo_id]}</Text>
              </View>

              <View className="flex-row justify-around w-full mt-6">
                <View className="items-center">
                  <Text className="font-bold text-lg">{followersCount}</Text>
                  <Text className="text-gray-600">Seguidores</Text>
                </View>
                <View className="items-center">
                  <Text className="font-bold text-lg">{user.following_count || 0}</Text>
                  <Text className="text-gray-600">Seguindo</Text>
                </View>
                <View className="items-center">
                  <Text className="font-bold text-lg">{user.points || 0}</Text>
                  <Text className="text-gray-600">Pontos</Text>
                </View>
              </View>

              {!isCurrentUser && (
                <TouchableOpacity
                  onPress={onToggleFollow}
                  className={`mt-6 px-8 py-2 rounded-full ${
                    isFollowing ? 'bg-gray-200' : 'bg-blue-500'
                  }`}
                >
                  <Text className={isFollowing ? 'text-gray-800' : 'text-white'}>
                    {isFollowing ? 'Seguindo' : 'Seguir'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
} 
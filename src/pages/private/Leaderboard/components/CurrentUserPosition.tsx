import { View, Text, Image } from 'react-native';
import { LeaderboardUser } from '@/api/leaderboard';
import { getAvatarUrl } from '@/utils/avatar';
import { ELOS_NAME, ELOS_IMAGE } from '@/constants/elo';

type CurrentUserPositionProps = {
  user: LeaderboardUser;
};

export const CurrentUserPosition = ({ user }: CurrentUserPositionProps) => {
  return (
    <View className="mt-4 bg-primary/20 p-4 rounded-lg">
      <Text className="text-white text-sm font-medium mb-2">Sua posição</Text>
      <View className="flex-row items-center">
        <View className="bg-primary/30 px-3 py-1 rounded-full mr-3">
          <Text className="text-white font-bold text-lg">#{user.position}</Text>
        </View>
        <Image
          source={{ uri: getAvatarUrl(user.name, user.avatar_url) }}
          className="w-10 h-10 rounded-full mr-3 border-2 border-white/20"
        />
        <View className="flex-1">
          <Text className="text-white font-medium">{user.name}</Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-white/80 text-sm">{ELOS_NAME[user.elo_id]}</Text>
            <Image
              source={ELOS_IMAGE[user.elo_id]}
              className="w-4 h-4 ml-1"
              resizeMode="contain"
            />
          </View>
        </View>
        <View className="bg-primary/30 px-3 py-1.5 rounded-full">
          <Text className="text-white font-bold">{user.points} pts</Text>
        </View>
      </View>
    </View>
  );
}; 
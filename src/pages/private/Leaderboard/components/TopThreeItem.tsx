import { View, Text, Image } from 'react-native';
import { LeaderboardUser } from '@/api/leaderboard';
import { getAvatarUrl } from '@/utils/avatar';
import { ELOS_IMAGE } from '@/constants/elo';

type TopThreeItemProps = {
  user: LeaderboardUser;
  isFirst: boolean;
};

export const TopThreeItem = ({ user, isFirst }: TopThreeItemProps) => {
  const containerSize = isFirst ? "h-36" : "h-28";
  const avatarSize = isFirst ? "w-20 h-20" : "w-16 h-16";
  const medalColor = user.position === 1 ? "bg-yellow-500" : 
                    user.position === 2 ? "bg-gray-300" : "bg-amber-700";

  return (
    <View className={`items-center ${containerSize}`}>
      <View className="relative">
        <View className={`${medalColor} rounded-full p-1 mb-2 border-2 border-white/20 shadow-lg`}>
          <Image
            source={{ uri: getAvatarUrl(user.name, user.avatar_url) }}
            className={`${avatarSize} rounded-full`}
          />
        </View>
        <Image
          source={ELOS_IMAGE[user.elo_id]}
          className="w-6 h-6 absolute -bottom-1 -right-1"
          resizeMode="contain"
        />
      </View>
      <View className="items-center mt-2">
        <Text className="text-white font-bold text-base" numberOfLines={1}>
          {user.name.split(' ')[0]}
        </Text>
        <View className="bg-white/10 px-3 py-1.5 rounded-full mt-1.5">
          <Text className="text-white font-bold">{user.points} pts</Text>
        </View>
      </View>
    </View>
  );
}; 
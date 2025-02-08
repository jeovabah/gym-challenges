import { View, Text, Image } from 'react-native';
import { LeaderboardUser } from '@/api/leaderboard';
import { getAvatarUrl } from '@/utils/avatar';
import { ELOS_NAME, ELOS_IMAGE } from '@/constants/elo';

type LeaderboardItemProps = {
  item: LeaderboardUser;
  index: number;
  isCurrentUser: boolean;
};

export const LeaderboardItem = ({ item, index, isCurrentUser }: LeaderboardItemProps) => {
  return (
    <View className={`flex-row items-center p-4 rounded-lg mb-2.5 border ${
      isCurrentUser ? "bg-primary/20 border-primary/30" : "bg-black/90 border-white/10"
    }`}>
      <View className={`w-9 h-9 rounded-full items-center justify-center mr-3 ${
        index < 10 ? "bg-primary/20" : "bg-black/50"
      }`}>
        <Text className={`font-bold text-base ${
          index < 10 ? "text-white" : "text-white/60"
        }`}>{item.position}</Text>
      </View>
      
      <View className="relative mr-3">
        <Image
          source={{ uri: getAvatarUrl(item.name, item.avatar_url) }}
          className="w-12 h-12 rounded-full border-2 border-white/20"
        />
        <Image
          source={ELOS_IMAGE[item.elo_id]}
          className="w-5 h-5 absolute -bottom-1 -right-1"
          resizeMode="contain"
        />
      </View>
      
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-medium text-white flex-1 mr-2" numberOfLines={1}>
            {item.name}
          </Text>
          <View className="bg-white/10 px-3 py-1.5 rounded-full">
            <Text className="text-white font-bold">{item.points} pts</Text>
          </View>
        </View>
        <Text className="text-sm text-white/60 mt-1">
          {ELOS_NAME[item.elo_id]}
        </Text>
      </View>
    </View>
  );
}; 
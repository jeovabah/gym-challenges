import { View, Text, Image } from 'react-native';
import { LeaderboardUser } from '@/api/leaderboard';
import { getAvatarUrl } from '@/utils/avatar';
import { ELOS_NAME, ELOS_IMAGE } from '@/constants/elo';
import { theme } from '@/theme';

type WeeklyWinnerProps = {
  winner: LeaderboardUser;
};

export const WeeklyWinner = ({ winner }: WeeklyWinnerProps) => {
  return (
    <View className="mb-4 bg-gradient-to-b from-primary/20 to-primary/5 p-6 rounded-xl">
      <View className="items-center">
        <Text className="font-poppins-bold text-primary text-lg mb-4">
          🏆 Vencedor da Semana
        </Text>
        
        <View className="relative mb-4">
          <View className={`rounded-full p-1.5 border-2`} style={{ borderColor: theme.colors.primary, backgroundColor: theme.colors.primaryDark }}>
            <Image
              source={{ uri: getAvatarUrl(winner.name, winner.avatar_url) }}
              className="w-24 h-24 rounded-full"
            />
          </View>
          <Image
            source={ELOS_IMAGE[winner.elo_id]}
            className="w-8 h-8 absolute -bottom-2 -right-2"
            resizeMode="contain"
          />
        </View>

        <Text className="font-poppins-bold text-white text-xl mb-1">
          {winner.name}
        </Text>
        
        <View className="flex-row items-center mb-3">
          <Text className="font-poppins-medium text-white/80 text-base">
            {ELOS_NAME[winner.elo_id]}
          </Text>
          <Image
            source={ELOS_IMAGE[winner.elo_id]}
            className="w-5 h-5 ml-2"
            resizeMode="contain"
          />
        </View>

        <View className="bg-primary/20 px-4 py-2 rounded-full">
          <Text className="font-poppins-semibold text-primary text-lg">
            {winner.points} pontos
          </Text>
        </View>
      </View>
    </View>
  );
}; 
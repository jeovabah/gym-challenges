import { HeaderPage } from "@/components/HeaderPage";
import { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import { getLeaderboard, LeaderboardUser, LeaderboardResponse } from "@/api/leaderboard";
import { showToast } from "@/utils/toast";
import { theme } from "@/theme";
import { getAvatarUrl } from "@/utils/avatar";
import { TAB_BAR_HEIGHT } from "../Challenge";
import { ELOS_NAME, ELOS_IMAGE } from "@/constants/elo";
import { useSession } from "@/providers/SessionProvider";
import { WeeklyPrize } from "./components/WeeklyPrize";
import { TopThreeItem } from "./components/TopThreeItem";
import { CurrentUserPosition } from "./components/CurrentUserPosition";
import { LeaderboardItem } from "./components/LeaderboardItem";
import { WeeklyWinner } from "./components/WeeklyWinner";

export const Leaderboard = () => {
  const { user } = useSession();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [currentUserPosition, setCurrentUserPosition] = useState<LeaderboardUser>();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const page = 1;

  const weeklyPrize = {
    title: "Prêmio da Semana",
    description: "Complete desafios para ganhar pontos extras!",
    image: { uri: "https://i.imgur.com/Tn5YVzz.png" },
  };

  const loadLeaderboard = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const data = await getLeaderboard(page, user?.auth?.id);
      setUsers(data.users);
      setCurrentUserPosition(data.currentUserPosition);
    } catch (error) {
      showToast(
        "error",
        "Erro ao carregar ranking. Tente novamente mais tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, [page]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadLeaderboard(false);
    setIsRefreshing(false);
  }, []);

  const isWeeklyWinnerDay = () => {
    const today = new Date();
    return today.getDay() === 6; // 6 = Sábado
  };

  const getWeeklyWinner = () => {
    return users[0];
  };

  const renderTopThree = () => {
    const topUsers = users.slice(0, 3);
    const positions = [2, 0, 1];
    const showWeeklyWinner = isWeeklyWinnerDay();

    return (
      <View className="mb-8 mt-2">
        {showWeeklyWinner && users.length > 0 && (
          <WeeklyWinner winner={getWeeklyWinner()} />
        )}

        {!showWeeklyWinner && weeklyPrize && (
          <WeeklyPrize {...weeklyPrize} />
        )}
        
        <View className="bg-black/90 p-4 rounded-xl h-[220px] justify-center">
          <View className="flex-row justify-center items-end gap-10">
            {positions.map((pos) => {
              const user = topUsers[pos];
              if (!user) return null;
              
              // Gold in middle (pos 0)
              if (pos === 0) {
                return (
                  <View key={user.id} className="mx-4 -mt-8">
                    <TopThreeItem 
                      user={user}
                      isFirst={true}
                    />
                  </View>
                );
              }
              
              // Silver (pos 1) and Bronze (pos 2)
              return (
                <TopThreeItem 
                  key={user.id}
                  user={user}
                  isFirst={false}
                />
              );
            })}
          </View>
        </View>

        {currentUserPosition && (
          <CurrentUserPosition user={currentUserPosition} />
        )}
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: LeaderboardUser; index: number }) => {
    if (index < 3) return null;
    return (
      <LeaderboardItem
        item={item}
        index={index}
        isCurrentUser={item.user_id === user?.auth?.id}
      />
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 my-4">
        <HeaderPage title="Ranking"  />
      </View>

      <FlatList
        className="flex-1 px-4"
        data={users}
        ListHeaderComponent={renderTopThree}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListFooterComponent={<View style={{ height: TAB_BAR_HEIGHT }} />}
      />
    </SafeAreaView>
  );
};

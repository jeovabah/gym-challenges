import React from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Container, Header } from "./styles";
import { Header as HeaderComponent } from "@/components/Home/Header";
import { TabComponent } from "@/components/Home/TabComponent";
import { Recomendations } from "@/components/Home/Recomendations";
import { MainChallenge } from "@/components/Home/MainChallenge";
import { useSession } from "@/providers/SessionProvider";

export const Home = () => {
  const { getUser } = useSession();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getUser().finally(() => setRefreshing(false));
  }, [getUser]);

  return (
    <Container>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
          />
        }
      >
        <Header>
          <HeaderComponent />
        </Header>
        <View className="px-2">
          <TabComponent />
        </View>
        <View className="px-4 mt-4">
          <Recomendations />
        </View>
        <View className="mt-4">
          <MainChallenge />
        </View>
      </ScrollView>
    </Container>
  );
};

import React from "react";
import { ScrollView, View } from "react-native";
import { Container, Header } from "./styles";
import { Header as HeaderComponent } from "@/components/Home/Header";
import { TabComponent } from "@/components/Home/TabComponent";
import { Recomendations } from "@/components/Home/Recomendations";
import { MainChallenge } from "@/components/Home/MainChallenge";

export const Home = () => {
  return (
    <Container>
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
    </Container>
  );
};

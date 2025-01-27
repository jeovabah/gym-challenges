import { useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Tab } from "./tab";
import { useActiveTab, setActiveTab } from "./event";

export const TabComponent = () => {
  const activeTab = useActiveTab();

  const tabs = [
    {
      key: "challenges",
      title: "Desafios",
      iconName: "barbell",
    },
    {
      key: "progress",
      title: "Progresso",
      iconName: "stats-chart",
    },
    {
      key: "nutrition",
      title: "Nutrição",
      iconName: "nutrition",
    },
    {
      key: "friends",
      title: "Amigos & Comunidade",
      iconName: "people",
    },
  ];

  return (
    <View className="flex-row gap-2 justify-between">
      {tabs.map((tab) => (
        <Tab
          key={tab.key}
          title={tab.title}
          icon={
            <Ionicons
              name={tab.iconName as any}
              size={24}
              color={activeTab === tab.key ? "#4DDC55" : "#fff"}
            />
          }
          isActive={activeTab === tab.key}
          onPress={() => setActiveTab(tab.key)}
        />
      ))}
    </View>
  );
};

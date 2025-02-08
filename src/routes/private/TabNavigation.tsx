import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "@/pages/private/Home";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import TabBar from "@/components/tab-bar/tab-bar";
import { useTheme } from "styled-components/native";
import { Profile } from "@/pages/private/Profile";
import { Challenge } from "@/pages/private/Challenge";
import { Community } from "@/pages/private/Community";
import { Leaderboard } from "@/pages/private/Leaderboard";

const Tab = createBottomTabNavigator();

const TabBarItem = ({
  Icon,
  size,
  iconName,
}: {
  focused: boolean;
  Icon: typeof FontAwesome5 | typeof MaterialIcons;
  size: number;
  iconName: string;
}) => <Icon name={iconName} size={size} color={"#fff"} />;

const TabNavigation = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => (
        <TabBar
          {...props}
          numOfTabs={5}
          iconActiveColor="#fff"
          iconUnActiveColor="#E0E0E0"
          circleStyle={{
            backgroundColor: theme.colors.primaryDark,
          }}
        />
      )}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: "Início",
          tabBarIcon: ({ focused }) => (
            <TabBarItem
              focused={focused}
              Icon={FontAwesome5}
              size={24}
              iconName="home"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Challenge"
        component={Challenge}
        options={{
          title: "Desafios",
          tabBarIcon: ({ focused }) => (
            <TabBarItem
              focused={focused}
              Icon={MaterialIcons}
              size={24}
              iconName="emoji-events"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={Community}
        options={{
          title: "Comunidade",
          tabBarIcon: ({ focused }) => (
            <TabBarItem
              focused={focused}
              Icon={MaterialIcons}
              size={24}
              iconName="groups"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={Leaderboard}
        options={{
          title: "Ranking",
          tabBarIcon: ({ focused }) => (
            <TabBarItem
              focused={focused}
              Icon={MaterialIcons}
              size={24}
              iconName="leaderboard"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => (
            <TabBarItem
              focused={focused}
              Icon={MaterialIcons}
              size={24}
              iconName="person"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default TabNavigation;

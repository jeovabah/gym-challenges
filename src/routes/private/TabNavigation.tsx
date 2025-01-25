import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "@/pages/private/Home";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import TabBar from "@/components/tab-bar/tab-bar";
import { useTheme } from "styled-components/native";
import { Profile } from "@/pages/private/Profile";

const Tab = createBottomTabNavigator();

const TabBarItem = ({
  Icon,
  size,
}: {
  focused: boolean;
  Icon: typeof FontAwesome5 | typeof MaterialIcons;
  size: number;
}) => (
  <Icon
    name={Icon === FontAwesome5 ? "home" : "person"}
    size={size}
    color={"#fff"}
  />
);

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
          numOfTabs={2}
          iconActiveColor="#fff"
          iconUnActiveColor="#E0E0E0"
          circleStyle={{
            backgroundColor: theme.colors.secondary,
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
            <TabBarItem focused={focused} Icon={FontAwesome5} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => (
            <TabBarItem focused={focused} Icon={MaterialIcons} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default TabNavigation;

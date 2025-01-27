import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabNavigation from "./TabNavigation";
import { Notifications } from "@/pages/private/Notifications";
import { Chat } from "@/pages/private/Chat";
import { Forum } from "@/pages/private/Forum";
import { DrawerCustom } from "@/components/DrawerCustom";
import { ChallengeDetails } from "@/pages/private/ChallengeDetails";

const DrawerRoutes = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      initialRouteName="HomeTabs"
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
      }}
      drawerContent={(props) => <DrawerCustom {...props} />}
    >
      <Drawer.Screen
        name="HomeTabs"
        component={TabNavigation}
        options={{
          title: "Home",
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={Notifications}
        options={{
          title: "Notificações",
        }}
      />
      <Drawer.Screen
        name="Chat"
        component={Chat}
        options={{
          title: "Chat",
        }}
      />
      <Drawer.Screen
        name="Forum"
        component={Forum}
        options={{
          title: "Fórum",
        }}
      />
    </Drawer.Navigator>
  );
};

export const PrivateRoutes = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DrawerRoutes" component={DrawerRoutes} />
      <Stack.Screen name="ChallengeDetails" component={ChallengeDetails} />
      <Stack.Screen name="Notifications" component={Notifications} />
    </Stack.Navigator>
  );
};

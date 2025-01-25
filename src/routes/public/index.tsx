import Register from "@/pages/public/Register";
import { SignIn } from "@/pages/public/SignIn";
import { theme } from "@/theme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export const PublicRoutes = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{
          headerTitle: "Login",
        }}
      />
      {/* <Stack.Screen name="Register" component={Register} /> */}
    </Stack.Navigator>
  );
};

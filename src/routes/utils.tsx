import { CommonActions, DrawerActions } from "@react-navigation/native";
import { navigationRef } from "./navigationRef";
import type { NavigationState, Route } from "@react-navigation/native";

type RouteConfig = {
  name: string;
  state?: NavigationState;
  params?: Record<string, unknown>;
};

export const navigate = (name: string, params?: Record<string, unknown>) => {
  navigationRef.current?.navigate({
    name,
    params,
  } as never);
};

export const goBack = () => {
  navigationRef.current?.goBack();
};

export const navigateAndReset = (
  routeName: string,
  params?: Record<string, unknown>
) => {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: routeName,
          params,
        },
      ],
    })
  );
};
export const navigateToHome = () => {
  navigateAndReset("DrawerRoutes");
};

export const toggleDrawer = () => {
  navigationRef.current?.dispatch(DrawerActions.toggleDrawer());
};

export const closeDrawer = () => {
  navigationRef.current?.dispatch(DrawerActions.closeDrawer());
};

export const openDrawer = () => {
  navigationRef.current?.dispatch(DrawerActions.openDrawer());
};

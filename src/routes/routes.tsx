import { useSession } from "@/providers/SessionProvider";
import { ActivityIndicator } from "react-native";
import { PublicRoutes } from "./public";
import { PrivateRoutes } from "./private";
import { SplashAnimated } from "@/pages/commom/SplashAnimated";
import { useState, useEffect } from "react";

export const Routes = () => {
  const { isLoading, session } = useSession();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!isLoading && showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (showSplash || isLoading) {
    return <SplashAnimated />;
  }

  if (session) {
    return <PrivateRoutes />;
  }

  return <PublicRoutes />;
};

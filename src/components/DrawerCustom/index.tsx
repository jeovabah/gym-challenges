import { theme } from "@/theme";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import React from "react";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import * as S from "./styles";
import { useSession } from "@/providers/SessionProvider";

export const DrawerCustom = (props: DrawerContentComponentProps) => {
  const { signOut, user } = useSession();
  const currentRoute = props.state.routeNames[props.state.index];

  return (
    <S.Container colors={[theme.colors.primary, "#14137D"]}>
      <S.Header>
        <S.AvatarContainer>
          <FontAwesome5 name="user-circle" size={60} color="#fff" />
        </S.AvatarContainer>
        <S.UserName>{user?.user?.name}</S.UserName>
        <S.UserEmail>{user?.user?.email}</S.UserEmail>
      </S.Header>

      <S.MenuContainer>
        <S.MenuItem
          isActive={currentRoute === "HomeTabs"}
          onPress={() => props.navigation.navigate("HomeTabs")}
        >
          <FontAwesome5 name="home" size={24} color="#fff" />
          <S.MenuText>Início</S.MenuText>
        </S.MenuItem>

        <S.MenuItem
          isActive={currentRoute === "Notifications"}
          onPress={() => props.navigation.navigate("Notifications")}
        >
          <MaterialIcons name="notifications" size={24} color="#fff" />
          <S.MenuText>Notificações</S.MenuText>
        </S.MenuItem>

        <S.MenuItem
          isActive={currentRoute === "Chat"}
          onPress={() => props.navigation.navigate("Chat")}
        >
          <MaterialIcons name="chat" size={24} color="#fff" />
          <S.MenuText>Chat</S.MenuText>
        </S.MenuItem>

        <S.MenuItem
          isActive={currentRoute === "Forum"}
          onPress={() => props.navigation.navigate("Forum")}
        >
          <FontAwesome5 name="comments" size={24} color="#fff" />
          <S.MenuText>Fórum</S.MenuText>
        </S.MenuItem>
      </S.MenuContainer>

      <S.LogoutButton onPress={signOut}>
        <MaterialIcons name="logout" size={24} color="#fff" />
        <S.LogoutText>Sair</S.LogoutText>
      </S.LogoutButton>
    </S.Container>
  );
};

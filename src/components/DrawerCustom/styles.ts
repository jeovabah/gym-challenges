import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@/theme";

export const Container = styled(LinearGradient)`
  flex: 1;
  padding: 20px;
`;

export const Header = styled.View`
  align-items: center;
  margin-top: 50px;
  margin-bottom: 50px;
`;

export const AvatarContainer = styled.View`
  margin-bottom: 15px;
`;

export const UserName = styled.Text`
  color: ${({ theme }) => theme.colors.background};
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const UserEmail = styled.Text`
  color: ${({ theme }) => theme.colors.background};
  font-size: 14px;
`;

export const MenuContainer = styled.View`
  flex: 1;
`;

export const MenuItem = styled.TouchableOpacity<{ isActive?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 15px;
  border-radius: 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.background}20;
  background-color: ${(props) =>
    props.isActive ? `${theme.colors.background}20` : "transparent"};
`;

export const MenuText = styled.Text`
  color: ${({ theme }) => theme.colors.background};
  font-size: 16px;
  margin-left: 15px;
`;

export const LogoutButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 15px 0;
  margin-bottom: 20px;
`;

export const LogoutText = styled.Text`
  color: ${({ theme }) => theme.colors.background};
  font-size: 16px;
  margin-left: 15px;
`;

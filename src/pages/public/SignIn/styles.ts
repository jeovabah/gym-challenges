import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
  flex-direction: row;
  position: relative;
  align-items: center;
  margin-bottom: 40px;
`;

export const ContainerLogoSup = styled.View`
  position: absolute;
  top: 60px;
  align-items: center;
  justify-content: center;
  width: 100%;
  /* border: 1px solid red; */
`;

export const Curve = styled(LinearGradient)`
  width: 106%;
  height: 250px;
  border-bottom-left-radius: 150px;
  margin-left: -10px;
  border-bottom-right-radius: 150px;
`;

export const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const Globe = styled.Image`
  width: 32px;
  height: 32px;
  margin-right: 8px;
`;

export const Card = styled.View`
  background-color: #ffffff;
  margin-top: 0px;
  max-width: 304px;
  margin-right: 49px;
  margin-left: 49px;
  border-radius: 16px;
  padding: 24px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

export const Input = styled.TextInput`
  background-color: #f0f0f0;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

export const ContainerButton = styled.View`
  margin-top: 24px;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const OrText = styled.Text`
  text-align: center;
  margin: 16px 0;
  color: #666;
`;

export const SocialButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 16px;
`;

export const SocialButton = styled.TouchableOpacity`
  padding: 8px;
`;

export const SocialIcon = styled.Image`
  width: 24px;
  height: 24px;
`;

export const ForgotPassword = styled.Text`
  color: blue;
  text-align: right;
  margin-top: 8px;
  font-size: 12px;
`;

export const TabContainer = styled.View`
  flex-direction: row;
  margin-bottom: 24px;
  background-color: ${({ theme }) => theme.colors.backgroundInput};
  border-radius: 15px;
`;

export const Tab = styled.TouchableOpacity<{ active?: boolean }>`
  flex: 1;
  padding: 12px;
  background-color: ${(props) =>
    props.active ? props.theme.colors.secondary : "transparent"};
  border-radius: 15px;
  align-items: center;
`;

export const TabText = styled.Text<{ active?: boolean }>`
  color: #fff;
  font-weight: bold;
`;

export const Logo = styled.Image`
  width: 215px;
  height: 88px;
`;

export const LogoInf = styled.Image`
  width: 160px;
  height: 88px;
`;

export const LogoInfContainer = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
`;

export const LogoImage = styled.Image`
  width: 50%;
`;

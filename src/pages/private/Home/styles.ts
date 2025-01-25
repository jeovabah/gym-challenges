import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 10px 0;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 35px;
`;

export const ProfileContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ProfileImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 12px;
`;

export const ProfileText = styled.View``;

export const CourseContainer = styled(LinearGradient).attrs({
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1.3 },
})`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-right: 30px;
  margin-left: 30px;
  height: 100px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.background};
`;
export const CourseText = styled.Text`
  font-size: 16px;
  color: #fff;
  font-weight: bold;
`;

export const CourseImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 12px;
  margin-left: 12px;
`;

export const WelcomeText = styled.Text`
  font-size: 16px;
  color: #000;
  font-weight: bold;
`;

export const SubtitleText = styled.Text`
  font-size: 14px;
  color: #666;
`;

export const MenuButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
`;

export const Carousel = styled.View`
  /* padding: 16px; */
  margin-top: 12px;
  /* border: 1px solid violet; */
`;

export const CarouselImage = styled.Image`
  width: 100%;
  height: 150px;
  border-radius: 8px;
`;

export const CardContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 25px;
  padding: 16px;
  margin-top: 20px;
`;

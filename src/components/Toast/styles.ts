import Animated from "react-native-reanimated";
import styled from "styled-components/native";

export const Container = styled(Animated.View)`
  width: 90%;
  min-height: 50px;
  border: 1px solid #d3d3d3;
  position: absolute;
  top: 10px;
  z-index: 100;
  align-self: center;
  border-radius: 8px;
  overflow: hidden;
`;

export const Button = styled.TouchableOpacity`
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  align-items: flex-start;
  justify-content: center;
  padding: 12px;
  border-left-width: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

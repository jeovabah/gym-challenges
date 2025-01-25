import styled from "styled-components/native";

export const IconContainer = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: transparent;
  border: 2px solid #ccc;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  margin-right: auto;

  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

export const CardText = styled.Text`
  color: #000000;
  font-size: 14px;
  text-align: left;
  font-weight: 500;
`;

export const Card = styled.TouchableOpacity`
  width: 160px;
  /* max-width: 160px; */
  background-color: #ffffff;
  border-radius: 20px;
  padding: 16px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  position: relative;
`;

export const ProgressBorder = styled.View`
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 22px;
  overflow: hidden;
`;

export const BaseBorder = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid #e8e8e8;
  border-radius: 22px;
`;

export const PercentageContainer = styled.View`
  position: absolute;
  top: -12px;
  align-self: center;
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: 4px 8px;
  border-radius: 12px;
  z-index: 1;
`;

export const PercentageText = styled.Text`
  color: #ffffff;
  font-weight: bold;
  font-size: 12px;
`;

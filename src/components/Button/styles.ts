import styled from "styled-components/native";
import { TouchableOpacity, Text } from "react-native";

interface ContainerProps {
  variant: "primary" | "secondary" | "tertiary" | "gradient";
  size: "small" | "medium" | "large";
}

export const Container = styled(TouchableOpacity)<ContainerProps>`
  align-items: center;
  justify-content: center;
  border-radius: 15px;

  ${({ variant, theme }) => {
    switch (variant) {
      case "secondary":
        return `background-color: ${theme.colors.secondary};
                border: 1px solid ${theme.colors.primary};
        `;
      case "tertiary":
        return `background-color: ${theme.colors.tertiary};`;
      default:
        return `background-color: ${theme.colors.primary};`;
    }
  }}

  ${({ size }) => {
    switch (size) {
      case "small":
        return `
          height: 32px;
          min-width: 80px;
        `;
      case "large":
        return `
          height: 32px;
          min-width: 160px;
        `;
      default:
        return `
          height: 32px;
          min-width: 120px;
        `;
    }
  }}
`;

export const ButtonText = styled(Text)<ContainerProps>`
  color: #fff;
  font-weight: bold;

  ${({ size }) => {
    switch (size) {
      case "small":
        return `font-size: 14px;`;
      case "large":
        return `font-size: 18px;`;
      default:
        return `font-size: 16px;`;
    }
  }}
`;

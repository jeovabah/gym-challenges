import styled, { css } from "styled-components/native";
import { TextInput } from "react-native";
import { Mask } from "@/utils/mask";

interface InputProps {
  size?: "small" | "medium" | "large";
  variant?: "cpf" | "phone" | "birthday" | "password" | "default";
  hasError?: boolean;
  variantStyle?: "white" | "default";
}

const inputSizes = {
  small: css`
    height: 32px;
    padding: 0 12px;
    font-size: 12px;
  `,
  medium: css`
    height: 40px;
    padding: 0 12px;
    font-size: 14px;
  `,
  large: css`
    height: 48px;
    padding: 0 12px;
    font-size: 16px;
  `,
};

export const Container = styled.View`
  width: 100%;
  margin-bottom: 16px;
`;

export const InputContainer = styled.View<InputProps>`
  background-color: ${({ theme, variantStyle }) =>
    variantStyle === "white" ? "#fff" : theme.colors.backgroundInput};
  border-radius: 15px;
  flex-direction: row;
  align-items: center;
  ${({ size = "medium" }) => inputSizes[size]}
  ${({ hasError }) =>
    hasError &&
    css`
      border: 1px solid ${({ theme }) => theme.colors.tertiary};
    `}
`;
export const StyledInput = styled(TextInput).attrs<InputProps>((props) => ({
  placeholderTextColor: props.variantStyle === "white" ? "#ccc" : "#fff",
}))`
  flex: 1;
  color: ${({ variantStyle }) => (variantStyle === "white" ? "#000" : "#fff")};
  font-weight: bold;
`;

export const PasswordToggle = styled.TouchableOpacity`
  padding: 0 12px;
`;

export const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.tertiary};
  font-size: 12px;
  margin-top: 4px;
`;

export const Label = styled.Text`
  font-size: 14px;
  color: #4ddc55;
  font-weight: bold;
  padding-bottom: 10px;
`;

export const Required = styled.Text`
  color: ${({ theme }) => theme.colors.tertiary};
  font-size: 14px;
`;

export const formatByVariant = (text: string, variant?: string) => {
  switch (variant) {
    case "cpf":
      return Mask.maskCpf(text);
    case "phone":
      return Mask.maskPhone(text);
    case "birthday":
      return Mask.maskBirthday(text);
    case "cep":
      return Mask.maskCep(text);
    default:
      return text;
  }
};

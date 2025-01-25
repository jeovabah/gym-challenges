import React, { useState, useEffect } from "react";
import { TextInputProps } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as S from "./styles";
import { useTheme } from "styled-components/native";

interface Props extends TextInputProps {
  size?: "small" | "medium" | "large";
  variant?: "cpf" | "phone" | "birthday" | "password" | "cep" | "default";
  variantStyle?: "white" | "default";
  error?: string;
  label?: string;
  required?: boolean;
}

export const Input = ({
  size = "medium",
  variant = "default",
  variantStyle = "default",
  error,
  value,
  onChangeText,
  secureTextEntry,
  label,
  required,
  ...rest
}: Props) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleChangeText = (text: string) => {
    const formattedText = S.formatByVariant(text, variant);
    setInputValue(formattedText);
    if (onChangeText) {
      onChangeText(formattedText);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <S.Container>
      {label && (
        <S.Label>
          {label}
          {required && <S.Required> *</S.Required>}
        </S.Label>
      )}
      <S.InputContainer
        size={size}
        hasError={!!error}
        variantStyle={variantStyle}
      >
        <S.StyledInput
          {...rest}
          value={inputValue}
          onChangeText={handleChangeText}
          secureTextEntry={
            variant === "password" ? !showPassword : secureTextEntry
          }
          variantStyle={variantStyle}
        />
        {variant === "password" && (
          <S.PasswordToggle onPress={togglePasswordVisibility}>
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={theme.colors.primary}
            />
          </S.PasswordToggle>
        )}
      </S.InputContainer>
      {error && <S.ErrorText>{error}</S.ErrorText>}
    </S.Container>
  );
};

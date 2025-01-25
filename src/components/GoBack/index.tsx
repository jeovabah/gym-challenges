import React from "react";
import { ContainerButton } from "./styles";
import { Feather } from "@expo/vector-icons";
import { goBack } from "@/routes/utils";

export const BackButton = ({ onPressBack }: { onPressBack?: () => void }) => {
  const handleBack = () => {
    if (onPressBack) {
      return onPressBack();
    }
    goBack();
  };
  return (
    <ContainerButton onPress={handleBack}>
      <Feather name="arrow-left" size={24} color="#000" />
    </ContainerButton>
  );
};

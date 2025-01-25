import React from "react";
import {
  Card,
  IconContainer,
  CardText,
  ProgressBorder,
  BaseBorder,
  PercentageContainer,
  PercentageText,
} from "./styles";
import { ProgressBorderSVG } from "../../utils/progressCard";

export const CardAnimated = ({
  icon,
  title,
  percentage,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  percentage?: string;
  onPress: () => void;
}) => {
  return (
    <Card onPress={onPress}>
      {percentage && (
        <ProgressBorder>
          <BaseBorder />
          <ProgressBorderSVG percentage={Number(percentage)} />
        </ProgressBorder>
      )}

      <IconContainer>{icon}</IconContainer>
      <CardText>{title}</CardText>
      {percentage && (
        <PercentageContainer>
          <PercentageText>{percentage}%</PercentageText>
        </PercentageContainer>
      )}
    </Card>
  );
};

import styled from "styled-components/native";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width - 70;
const SPACING = 35;

export const Container = styled.View`
  width: ${width};
  height: 200px;
  /* background-color: ${({ theme }) => theme.colors.background}; */
  /* padding-left: ${SPACING}px; */
  /* justify-content: start; */
  /* border: 1px solid red; */
`;

export const ScrollViewStyled = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  pagingEnabled: true,
  snapToInterval: SPACING + ITEM_WIDTH + SPACING,
  decelerationRate: "normal",
  snapToAlignment: "start",
})``;

export const ImageContainer = styled.View`
  width: ${ITEM_WIDTH}px;
  /* height: 200px; */
  justify-content: center;
  align-items: flex-start;
  margin: 0 ${SPACING}px;
  border-radius: 10px;
  overflow: hidden;
`;

export const CarouselImage = styled.Image`
  width: ${ITEM_WIDTH}px;
  /* height: 160px; */
  aspect-ratio: 16/9;
  object-fit: cover;
`;

export const View = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 8px;
  padding-top: 10px;
`;

export const Dot = styled.View<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.backgroundInput};
`;

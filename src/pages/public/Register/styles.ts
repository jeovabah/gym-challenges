import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
`;

export const Title = styled.Text`
  font-size: 24px;
  color: #000;
  margin-bottom: 24px;
`;

export const InputRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: 12px;
`;

export const HalfInputContainer = styled.View`
  flex: 1;
`;

export const FullInputContainer = styled.View`
  width: 100%;
  margin-bottom: 12px;
`;

export const AddressRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: 12px;
`;

export const NumberInput = styled.View`
  flex: 1;
`;

export const ComplementInput = styled.View`
  flex: 2;
`;

export const CourseContainer = styled.View`
  margin-bottom: 16px;
`;

export const CourseCard = styled.TouchableOpacity`
  background-color: #fff;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  flex-direction: row;
  gap: 12px;
`;

export const CourseImageContainer = styled.View`
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
`;

export const CourseContent = styled.View`
  flex: 1;
  justify-content: space-between;
`;

export const CourseHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const CourseTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
`;

export const CoursePrice = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

export const CourseDescription = styled.Text`
  font-size: 12px;
  color: #666;
  flex: 1;
`;

export const StepIndicator = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-bottom: 24px;
`;

export const StepDot = styled.View<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.backgroundInput};
  margin: 0 4px;
`;

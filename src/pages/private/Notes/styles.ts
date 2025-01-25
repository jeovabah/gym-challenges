import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const NoteCard = styled.TouchableOpacity`
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

export const NoteTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
`;

export const NoteContent = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  line-height: 20px;
`;

export const NoteDate = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.backgroundInput};
  margin-top: 8px;
  font-style: italic;
`;

export const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  opacity: 0.7;
`;

export const EmptyText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  font-style: italic;
`;

export const NotesList = styled.FlatList`
  flex: 1;
  width: 100%;
`;

export const AddButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

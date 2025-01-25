import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const NotificationCard = styled.TouchableOpacity`
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

export const NotificationContent = styled.View`
  flex: 1;
  margin-left: 12px;
`;

export const NotificationTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
`;

export const NotificationDescription = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  margin-top: 4px;
  line-height: 20px;
`;

export const NotificationTime = styled.Text`
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

export const NotificationIcon = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.primary}20;
  justify-content: center;
  align-items: center;
`;

export const NotificationList = styled.FlatList`
  flex: 1;
  width: 100%;
`;

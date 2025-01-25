import { Layout } from "@/components/Layout";
import {
  Container,
  NotificationCard,
  NotificationContent,
  NotificationTitle,
  NotificationDescription,
  NotificationTime,
  EmptyContainer,
  EmptyText,
  NotificationIcon,
  NotificationList,
} from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useTheme } from "styled-components/native";

export const Notifications = () => {
  const theme = useTheme();
  const [notifications] = useState([
    {
      id: "1",
      title: "Nova aula disponível",
      description:
        "A aula de Inglês Intermediário foi disponibilizada. Acesse agora mesmo!",
      time: "2 horas atrás",
      icon: "school",
    },
    {
      id: "2",
      title: "Lembrete de atividade",
      description:
        "Você tem uma atividade pendente que vence em 2 dias. Não deixe para última hora!",
      time: "5 horas atrás",
      icon: "assignment",
    },
    {
      id: "3",
      title: "Nota disponível",
      description:
        "Sua nota da última avaliação já está disponível. Confira seu desempenho!",
      time: "1 dia atrás",
      icon: "grade",
    },
  ]);

  const renderNotification = ({ item }: any) => (
    <NotificationCard>
      <NotificationIcon>
        <MaterialIcons
          name={item.icon}
          size={24}
          color={theme.colors.primary}
        />
      </NotificationIcon>
      <NotificationContent>
        <NotificationTitle>{item.title}</NotificationTitle>
        <NotificationDescription>{item.description}</NotificationDescription>
        <NotificationTime>{item.time}</NotificationTime>
      </NotificationContent>
    </NotificationCard>
  );

  return (
    <Layout useSafeArea useHeader title="Notificações">
      <Container>
        {notifications.length > 0 ? (
          <NotificationList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item: any) => item.id}
          />
        ) : (
          <EmptyContainer>
            <EmptyText>Você não possui notificações</EmptyText>
          </EmptyContainer>
        )}
      </Container>
    </Layout>
  );
};

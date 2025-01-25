import React, { useState } from "react";
import { useTheme } from "styled-components/native";
import {
  Container,
  NoteCard,
  NoteTitle,
  NoteContent,
  NoteDate,
  EmptyContainer,
  EmptyText,
  NotesList,
  AddButton,
} from "./styles";
import { Layout } from "@/components/Layout";
import { MaterialIcons } from "@expo/vector-icons";

export const Notes = () => {
  const theme = useTheme();
  const [notes] = useState([
    {
      id: "1",
      title: "Anotação 1",
      content: "Conteúdo da primeira anotação com detalhes importantes.",
      date: "2 horas atrás",
    },
    {
      id: "2",
      title: "Anotação 2",
      content: "Conteúdo da segunda anotação com mais informações relevantes.",
      date: "5 horas atrás",
    },
    {
      id: "3",
      title: "Anotação 3",
      content: "Conteúdo da terceira anotação com dados adicionais.",
      date: "1 dia atrás",
    },
  ]);

  const renderNote = ({ item }: any) => (
    <NoteCard>
      <NoteTitle>{item.title}</NoteTitle>
      <NoteContent>{item.content}</NoteContent>
      <NoteDate>{item.date}</NoteDate>
    </NoteCard>
  );

  return (
    <Layout useSafeArea useHeader title="Anotações">
      <Container>
        {notes.length > 0 ? (
          <NotesList
            data={notes}
            renderItem={renderNote}
            keyExtractor={(item: any) => item.id}
          />
        ) : (
          <EmptyContainer>
            <EmptyText>Você não possui anotações</EmptyText>
          </EmptyContainer>
        )}
        <AddButton>
          <MaterialIcons name="add" size={24} color="#fff" />
        </AddButton>
      </Container>
    </Layout>
  );
};

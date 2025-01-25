import styled from "styled-components/native";

export const Container = styled.ScrollView<{ noPadding?: boolean }>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ noPadding }) => (noPadding ? "0px" : "24px")};
`;

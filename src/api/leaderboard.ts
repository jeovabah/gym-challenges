import { supabase } from "@/utils/supabase";

interface Elo {
  level: number;
}

interface UserClient {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string;
  points: number;
  elo_id: string;
  elo?: Elo;
}

export interface LeaderboardUser extends UserClient {
  position: number;
}

export interface LeaderboardResponse {
  users: LeaderboardUser[];
  currentUserPosition?: LeaderboardUser;
}

export const getLeaderboard = async (
  page: number = 1,
  userId?: string
): Promise<LeaderboardResponse> => {
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  // Busca todos os usuários para calcular a posição correta
  const { data: allUsers, error: allUsersError } = await supabase
    .from("users_clients")
    .select(
      `
      id, 
      user_id, 
      name, 
      avatar_url, 
      points,
      elo_id,
      elo:elo_id (
        level
      )
    `
    );

  if (allUsersError) {
    console.error(`Erro ao buscar o leaderboard: ${allUsersError.message}`);
    throw new Error(`Erro ao buscar o leaderboard: ${allUsersError.message}`);
  }

  // Ordena todos os usuários
  const sortedData = (allUsers as unknown as UserClient[]).sort((a, b) => {
    const levelA = a.elo?.level ?? 0;
    const levelB = b.elo?.level ?? 0;
    
    if (levelA !== levelB) {
      return levelB - levelA;
    }
    
    return b.points - a.points;
  });

  // Adiciona posição a todos os usuários
  const allUsersWithPosition = sortedData.map((user, index) => ({
    ...user,
    position: index + 1,
  }));

  // Encontra a posição do usuário atual se o userId for fornecido
  const currentUserPosition = userId 
    ? allUsersWithPosition.find(user => user.user_id === userId)
    : undefined;

  // Retorna apenas a página solicitada
  const paginatedUsers = allUsersWithPosition.slice(start, end + 1);

  return {
    users: paginatedUsers,
    currentUserPosition
  };
};

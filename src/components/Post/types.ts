export type UserClient = {
  id: string;
  name: string;
  avatar_url: string | null;
};

export type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  users_clients: UserClient;
};

export type Like = {
  user_id: string;
};

export type Post = {
  id: string;
  content: string;
  image_url?: string | null;
  created_at: string;
  user_id: string;
  users_clients: UserClient;
  comments: Comment[];
  likes: Like[];
};
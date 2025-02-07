import { supabase } from "@/utils/supabase";

// Tipos
type Post = {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  created_at: string;
};

type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_comment_id?: string;
  created_at: string;
};

type Like = {
  id: string;
  post_id: string;
  user_id: string;
  comment_id?: string;
  created_at: string;
};

// Posts
export async function createPost(post: Omit<Post, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPosts() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      users_clients (
        id,
        name,
        avatar_url
      ),
      comments (
        id,
        content,
        created_at,
        user_id,
        users_clients (
          name,
          avatar_url
        )
      ),
      likes (
        user_id
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return posts;
}

// Comments
export async function createComment(comment: Omit<Comment, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPostComments(postId: string) {
  const { data: comments, error } = await supabase
    .from('comments')
    .select(`
      *,
      users_clients (
        name,
        avatar_url
      )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return comments;
}

// Likes
export async function toggleLike(like: Omit<Like, 'id' | 'created_at'>) {
  // Primeiro verifica se já existe um like
  const { data: existingLike } = await supabase
    .from('likes')
    .select()
    .eq('post_id', like.post_id)
    .eq('user_id', like.user_id)
    .maybeSingle();

  if (existingLike) {
    // Se existe, remove o like
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('id', existingLike.id);

    if (error) throw error;
    return null;
  } else {
    // Se não existe, cria um novo like
    const { data, error } = await supabase
      .from('likes')
      .insert(like)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

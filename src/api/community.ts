import { supabase } from "@/utils/supabase";
import { ELOS_NAME, ELOS_IMAGE } from "@/constants/elo";

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

// Tipos atualizados
export type UserProfile = {
  id: string;
  name: string;
  avatar_url: string | null;
  elo_id: string;
  points: number;
  followers_count: number;
  following_count: number;
  is_following: boolean;
};

const uploadPostImage = async (
  imageUri: string
): Promise<string | undefined> => {
  if (!imageUri) return undefined;
  try {
    const timestamp = new Date().getTime();
    const filename = `post-${timestamp}.jpg`;

    const file = {
      name: filename,
      type: "image/jpeg",
      uri: imageUri,
    };

    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(filename, file as any);

    if (uploadError) {
      console.error(uploadError);
      throw new Error(`Erro ao fazer upload da imagem: ${uploadError.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("posts").getPublicUrl(filename);
    return publicUrl;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

// Posts
export async function createPost(post: Omit<Post, "id" | "created_at">) {
  const imageUrl = post.image_url
    ? await uploadPostImage(post.image_url)
    : undefined;

  const { data, error } = await supabase
    .from("posts")
    .insert({
      ...post,
      image_url: imageUrl,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPosts() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      users_clients!inner (
        id,
        name,
        avatar_url,
        elo_id,
        points
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
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar posts:", error);
    throw error;
  }

  // Buscar contagens de followers e following para cada usuário
  const postsWithCounts = await Promise.all(
    posts.map(async (post) => {
      const [followersCount, followingCount] = await Promise.all([
        getFollowersCount(post.user_id),
        getFollowingCount(post.user_id),
      ]);

      return {
        ...post,
        users_clients: {
          ...post.users_clients,
          followers_count: followersCount,
          following_count: followingCount,
          elo_name: ELOS_NAME[post.users_clients.elo_id],
          elo_image: ELOS_IMAGE[post.users_clients.elo_id],
        },
      };
    })
  );

  return postsWithCounts;
}

// Função auxiliar para contar followers
async function getFollowersCount(userId: string) {
  const { count } = await supabase
    .from("followers")
    .select("*", { count: "exact", head: true })
    .eq("follows_user_id", userId);

  return count || 0;
}

// Função auxiliar para contar following
async function getFollowingCount(userId: string) {
  const { count } = await supabase
    .from("followers")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  return count || 0;
}

// Comments
export async function createComment(comment: {
  post_id: string;
  user_id: string;
  content: string;
}) {
  const { data, error } = await supabase
    .from("comments")
    .insert(comment)
    .select(
      `
      *,
      users_clients!inner (
        name,
        avatar_url
      )
    `
    )
    .single();

  if (error) throw error;
  return data;
}

export async function getPostComments(postId: string) {
  const { data: comments, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      users_clients (
        name,
        avatar_url
      )
    `
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return comments;
}

// Likes
export async function toggleLike(like: { post_id: string; user_id: string }) {
  const { data: existingLike } = await supabase
    .from("likes")
    .select()
    .eq("post_id", like.post_id)
    .eq("user_id", like.user_id)
    .maybeSingle();

  if (existingLike) {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("id", existingLike.id);

    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase.from("likes").insert(like);

    if (error) throw error;
    return true;
  }
}

// Função para verificar se um usuário está seguindo outro
export async function isFollowing(followerId: string, followedId: string) {
  const { data } = await supabase
    .from("followers")
    .select("id")
    .eq("user_id", followerId)
    .eq("follows_user_id", followedId)
    .single();

  return !!data;
}

// Função para alternar follow/unfollow
export async function toggleFollow(targetUserId: string) {
  const { data: currentUser } = await supabase.auth.getUser();
  const userId = currentUser.user?.id;

  if (!userId || userId === targetUserId) return null;

  const following = await isFollowing(userId, targetUserId);

  if (following) {
    const { error } = await supabase
      .from("followers")
      .delete()
      .eq("user_id", userId)
      .eq("follows_user_id", targetUserId);

    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase.from("followers").insert({
      user_id: userId,
      follows_user_id: targetUserId,
    });

    if (error) throw error;
    return true;
  }
}

// Função para buscar perfil do usuário com contagem de followers
export async function getUserProfile(userId: string) {
  const { data: currentUser } = await supabase.auth.getUser();
  const currentUserId = currentUser.user?.id;

  const { data, error } = await supabase
    .from("users_clients")
    .select(
      `
      *,
      followers:followers!follows_user_id (count),
      following:followers!user_id (count)
    `
    )
    .eq("user_id", userId)
    .single();

  if (error) throw error;

  // Verificar se o usuário atual segue este perfil
  const { data: isFollowing } = await supabase
    .from("followers")
    .select("id")
    .eq("user_id", currentUserId)
    .eq("follows_user_id", userId)
    .single();

  return {
    ...data,
    followers_count: data.followers[0]?.count || 0,
    following_count: data.following[0]?.count || 0,
    is_following: !!isFollowing,
    elo_name: ELOS_NAME[data.elo_id],
    elo_image: ELOS_IMAGE[data.elo_id],
  };
}

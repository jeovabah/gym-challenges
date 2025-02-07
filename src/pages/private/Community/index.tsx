import { HeaderPage } from "@/components/HeaderPage";
import { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Post as PostComponent } from "@/components/Post";
import { Post, Comment } from "@/components/Post/types";
import { CreatePostModal } from "@/components/CreatePostModal";
import { CreatePostBox } from "@/components/CreatePostBox";
import * as communityApi from "@/api/community";
import { showToast } from "@/utils/toast";
import { getAvatarUrl } from "@/utils/avatar";
import { useSession } from "@/providers/SessionProvider";
import { TAB_BAR_HEIGHT } from "../Challenge";

export const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreatePostVisible, setIsCreatePostVisible] = useState(false);
  const { user: userSession } = useSession();

  const user = userSession?.auth;

  const currentUser = {
    avatar: getAvatarUrl(
      user?.email || "",
      user?.user_metadata?.avatar_url || ""
    ),
    name: user?.user_metadata?.name || user?.email?.split("@")[0],
  };

  const loadPosts = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const postsData = await communityApi.getPosts();
      setPosts(postsData);
    } catch (error) {
      showToast("error", "Erro ao carregar posts. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadPosts(false);
    setIsRefreshing(false);
  }, []);

  const handleCreatePost = async (content: string, mediaUrl?: string) => {
    try {
      await communityApi.createPost({
        user_id: user?.id as string,
        content,
        image_url: mediaUrl,
      });

      loadPosts();
      setIsCreatePostVisible(false);
      showToast("success", "Post criado com sucesso!");
    } catch (error) {
      showToast("error", "Erro ao criar post. Tente novamente mais tarde.");
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await communityApi.toggleLike({
        post_id: postId,
        user_id: user?.id as string,
      });
      setPosts(
        // @ts-ignore
        posts.map((post) => {
          if (post.id === postId) {
            const userLiked = post.likes.some(
              (like) => like.user_id === user?.id
            );
            const likes = userLiked
              ? post.likes.filter((like) => like.user_id !== user?.id)
              : [...post.likes, { user_id: user?.id }];
            return { ...post, likes };
          }
          return post;
        })
      );
    } catch (error) {
      showToast("error", "Erro ao processar like. Tente novamente mais tarde.");
    }
  };

  const handleComment = async (postId: string, commentText: string) => {
    try {
      const newComment = await communityApi.createComment({
        post_id: postId,
        user_id: user?.id as string,
        content: commentText,
      });

      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [
                ...post.comments,
                {
                  ...newComment,
                  users_clients: {
                    name: currentUser.name,
                    avatar_url: currentUser.avatar,
                  },
                },
              ],
            };
          }
          return post;
        })
      );
    } catch (error) {
      showToast(
        "error",
        "Erro ao criar comentário. Tente novamente mais tarde."
      );
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#0284c7" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background py-2">
      <View className="px-4 my-4">
        <HeaderPage title="Comunidade" />
      </View>

      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={["#0284c7"]}
          />
        }
      >
        <CreatePostBox
          userAvatar={currentUser.avatar}
          onPress={() => setIsCreatePostVisible(true)}
        />

        {posts.map((post) => (
          <PostComponent
            key={post.id}
            {...post}
            currentUserId={user?.id || ""}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}

        <View
          style={{
            height: TAB_BAR_HEIGHT,
          }}
        />
      </ScrollView>

      <CreatePostModal
        isVisible={isCreatePostVisible}
        onClose={() => setIsCreatePostVisible(false)}
        onCreatePost={handleCreatePost}
        userAvatar={currentUser.avatar}
        userName={currentUser.name || ""}
      />
    </SafeAreaView>
  );
};

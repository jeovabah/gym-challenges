import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import { Comment } from "./types";
import { CommentItem } from "../CommentItem";
import { CommentModal } from "../CommentModal";
import { getAvatarUrl } from "@/utils/avatar";
import { UserProfileModal } from "../UserProfileModal";
import { toggleFollow } from "@/api/community";
import { useSession } from "@/providers/SessionProvider";
import { ELOS_NAME, ELOS_IMAGE } from "@/constants/elo";
import { showToast } from "@/utils/toast";
import { ImagePreviewModal, ImagePreviewModalRef } from "../ImagePreviewModal";

type PostProps = {
  id: string;
  user_id: string;
  content: string;
  image_url?: string | null;
  likes: Array<{ user_id: string }>;
  comments: Comment[];
  created_at: string;
  users_clients: {
    id: string;
    name: string;
    avatar_url: string | null;
    elo_id: string;
    points: number;
    followers_count: number;
    following_count: number;
    is_following: boolean;
    elo_name: string;
    elo_image: string;
  };
  currentUserId: string;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
};

export function Post({
  id,
  content,
  image_url,
  created_at,
  user_id,
  users_clients,
  comments,
  likes,
  currentUserId,
  onLike,
  onComment,
}: PostProps) {
  const { user } = useSession();
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(users_clients.is_following);
  const [followersCount, setFollowersCount] = useState(users_clients.followers_count || 0);
  const visibleComments = comments.slice(-3);
  const imagePreviewRef = useRef<ImagePreviewModalRef>(null);

  const isLiked = likes.some((like) => like.user_id === currentUserId);
  const createdAtDate = new Date(created_at);

  useEffect(() => {
    setIsFollowing(users_clients.is_following);
    setFollowersCount(users_clients.followers_count || 0);
  }, [users_clients.is_following, users_clients.followers_count]);

  const handleToggleFollow = async () => {
    try {
      const result = await toggleFollow(user_id);
      if (result !== null) {
        setIsFollowing(result);
        setFollowersCount(prev => result ? prev + 1 : prev - 1);
        showToast('success', result ? 'Seguindo usuário' : 'Deixou de seguir usuário');
      }
    } catch (error) {
      showToast('error', 'Erro ao atualizar seguidor');
    }
  };

  const isCurrentUser = user?.auth.id === user_id;

  return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity 
          className="flex-row items-center flex-1"
          onPress={() => setIsProfileModalVisible(true)}
        >
          <Image
            source={{ uri: getAvatarUrl(users_clients.name, users_clients.avatar_url) }}
            className="w-10 h-10 rounded-full"
          />
          <View className="ml-3 flex-1">
            <Text className="font-bold">{users_clients.name}</Text>
            <View className="flex-row items-center">
              <Image
                source={ELOS_IMAGE[users_clients.elo_id]}
                className="w-4 h-4"
                resizeMode="contain"
              />
              <Text className="text-xs text-gray-500 ml-1">
                {ELOS_NAME[users_clients.elo_id]}
              </Text>
              <Text className="text-xs text-gray-500 ml-2">
                • {followersCount} seguidores
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {!isCurrentUser && (
          <TouchableOpacity
            onPress={handleToggleFollow}
            className={`px-4 py-1 rounded-full ${
              isFollowing ? 'bg-gray-200' : 'bg-blue-500'
            }`}
          >
            <Text className={isFollowing ? 'text-gray-800' : 'text-white'}>
              {isFollowing ? 'Seguindo' : 'Seguir'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text className="text-gray-800 mb-4">{content}</Text>

      {image_url && (
        <TouchableOpacity onPress={() => imagePreviewRef.current?.show(image_url)}>
          <Image
            source={{ uri: image_url }}
            className="w-full h-48 rounded-lg mb-4"
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}

      <View className="flex-row justify-between items-center mb-2">
        <TouchableOpacity
          onPress={() => onLike(id)}
          className="flex-row items-center"
        >
          <MaterialIcons
            name={isLiked ? "favorite" : "favorite-border"}
            size={24}
            color={isLiked ? "#FF0000" : "#666"}
          />
          <Text className="ml-1">{likes.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => setIsCommentModalVisible(true)}
        >
          <FontAwesome name="comment-o" size={22} color="#666" />
          <Text className="ml-1">{comments.length}</Text>
        </TouchableOpacity>
      </View>

      {visibleComments.map((comment) => (
        <CommentItem key={comment.id} {...comment} />
      ))}

      {comments.length > 3 && (
        <TouchableOpacity
          onPress={() => setIsCommentModalVisible(true)}
          className="mt-1"
        >
          <Text className="text-gray-500">
            Ver todos os {comments.length} comentários
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        className="flex-row mt-2"
        onPress={() => setIsCommentModalVisible(true)}
      >
        <Text className="text-gray-500">Adicionar um comentário...</Text>
      </TouchableOpacity>

      <CommentModal
        isVisible={isCommentModalVisible}
        onClose={() => setIsCommentModalVisible(false)}
        comments={comments}
        onComment={(comment) => onComment(id, comment)}
        postUserName={users_clients.name}
      />

      <UserProfileModal
        isVisible={isProfileModalVisible}
        onClose={() => setIsProfileModalVisible(false)}
        user={users_clients}
        isCurrentUser={isCurrentUser}
        onToggleFollow={handleToggleFollow}
      />

      <ImagePreviewModal ref={imagePreviewRef} />
    </View>
  );
}

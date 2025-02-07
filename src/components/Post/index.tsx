import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { Comment } from "./types";
import { CommentItem } from "../CommentItem";
import { CommentModal } from "../CommentModal";
import { getAvatarUrl } from "@/utils/avatar";

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
  };
  currentUserId: string;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
};

export function Post({
  id,
  users_clients,
  content,
  image_url,
  likes,
  comments,
  created_at,
  currentUserId,
  onLike,
  onComment,
}: PostProps) {
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const visibleComments = comments.slice(-3);

  const userLiked = likes.some((like) => like.user_id === currentUserId);
  const createdAtDate = new Date(created_at);

  return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <View className="flex-row items-center mb-4">
        <Image
          source={{
            uri: getAvatarUrl(users_clients.name, users_clients.avatar_url),
          }}
          className="w-10 h-10 rounded-full"
        />
        <View className="ml-3">
          <Text className="font-bold">{users_clients.name}</Text>
          <Text className="text-gray-500 text-xs">
            {createdAtDate?.toLocaleDateString()}
          </Text>
        </View>
      </View>

      <Text className="mb-3">{content}</Text>

      {image_url && (
        <Image
          source={{ uri: image_url }}
          className="w-full h-48 rounded-lg mb-3"
          resizeMode="cover"
        />
      )}

      <View className="flex-row justify-between items-center mb-2">
        <TouchableOpacity
          onPress={() => onLike(id)}
          className="flex-row items-center"
        >
          <MaterialIcons
            name={userLiked ? "favorite" : "favorite-border"}
            size={24}
            color={userLiked ? "#FF0000" : "#666"}
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
        onComment={(comment) => {
          onComment(id, comment);
        }}
        postUserName={users_clients.name}
      />
    </View>
  );
}

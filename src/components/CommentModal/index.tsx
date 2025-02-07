import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, Animated, Image } from "react-native";
import { useState, useEffect, useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getAvatarUrl } from "@/utils/avatar";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  users_clients: {
    name: string;
    avatar_url: string;
  };
};

type CommentModalProps = {
  isVisible: boolean;
  onClose: () => void;
  comments: any;
  onComment: (comment: string) => void;
  postUserName: string;
};

export function CommentModal({ 
  isVisible, 
  onClose, 
  comments, 
  onComment,
  postUserName 
}: CommentModalProps) {
  const [newComment, setNewComment] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    onComment(newComment);
    setNewComment('');
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <TouchableOpacity 
          className="flex-1"
          onPress={onClose}
        />
        
        <Animated.View 
          className="bg-white rounded-t-3xl h-3/4"
          style={{
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [600, 0],
                })
              }
            ]
          }}
        >
          <View className="p-4 border-b border-gray-200">
            <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />
            <Text className="text-lg font-bold text-center">Comentários</Text>
          </View>

          <ScrollView className="flex-1">
            {comments.map((comment: any) => (
              <View key={comment.id} className="p-4 border-b border-gray-100">
                <View className="flex-row items-center mb-2">
                  <Image
                    source={{ 
                      uri: getAvatarUrl(
                        comment.users_clients.name,
                        comment.users_clients.avatar_url
                      )
                    }}
                    className="w-8 h-8 rounded-full"
                  />
                  <View className="ml-3">
                    <Text className="font-bold">{comment.users_clients.name}</Text>
                    <Text className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        locale: ptBR,
                        addSuffix: true
                      })}
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-700">{comment.content}</Text>
              </View>
            ))}
          </ScrollView>

          <View className="p-4 border-t border-gray-200">
            <View className="flex-row items-center">
              <TextInput
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
                placeholder="Adicione um comentário..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity 
                onPress={handleSubmitComment}
                disabled={!newComment.trim()}
                className={`p-2 rounded-full ${!newComment.trim() ? 'bg-gray-300' : 'bg-blue-500'}`}
              >
                <MaterialIcons 
                  name="send" 
                  size={24} 
                  color={!newComment.trim() ? '#666' : '#FFF'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
} 
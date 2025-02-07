import { View, Text } from "react-native";
import { Comment } from "../Post/types";

export function CommentItem({ users_clients, content }: Comment) {
  return (
    <View className="bg-gray-100 p-2 rounded-lg mb-2">
      <Text className="font-bold">{users_clients.name}</Text>
      <Text>{content}</Text>
    </View>
  );
} 
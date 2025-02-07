import { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  Animated,
  Image,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { showToast } from '@/utils/toast';

type CreatePostModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onCreatePost: (content: string, mediaUrl?: string) => Promise<void>;
  userAvatar: string;
  userName: string;
};

export function CreatePostModal({ 
  isVisible, 
  onClose, 
  onCreatePost,
  userAvatar,
  userName
}: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setMediaUrl(result.assets[0].uri);
      }
    } catch (error) {
      showToast('error', 'Erro ao selecionar imagem');
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      showToast('error', 'Digite algo para compartilhar');
      return;
    }

    try {
      setIsLoading(true);
      await onCreatePost(content, mediaUrl || undefined);
      setContent('');
      setMediaUrl(null);
      onClose();
    } catch (error) {
      showToast('error', 'Erro ao criar post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <Animated.View 
          className="flex-1 bg-white mt-20 rounded-t-3xl"
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
          <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-gray-500">Cancelar</Text>
            </TouchableOpacity>
            <Text className="text-lg font-bold">Criar Post</Text>
            <TouchableOpacity 
              onPress={handleSubmit}
              disabled={isLoading || !content.trim()}
            >
              <Text className={`font-bold ${!content.trim() || isLoading ? 'text-gray-400' : 'text-blue-500'}`}>
                Publicar
              </Text>
            </TouchableOpacity>
          </View>

          <View className="p-4">
            <View className="flex-row items-center mb-4">
              <Image 
                source={{ uri: userAvatar }}
                className="w-10 h-10 rounded-full"
              />
              <Text className="ml-3 font-bold">{userName}</Text>
            </View>

            <TextInput
              className="text-base"
              placeholder="No que você está pensando?"
              multiline
              value={content}
              onChangeText={setContent}
              style={{ minHeight: 100 }}
            />

            {mediaUrl && (
              <View className="mt-4 relative">
                <Image 
                  source={{ uri: mediaUrl }}
                  className="w-full h-48 rounded-lg"
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  className="absolute top-2 right-2 bg-black/50 p-1 rounded-full"
                  onPress={() => setMediaUrl(null)}
                >
                  <MaterialIcons name="close" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {isLoading ? (
            <View className="p-4 items-center">
              <ActivityIndicator size="small" color="#0284c7" />
            </View>
          ) : (
            <TouchableOpacity 
              className="p-4 flex-row items-center"
              onPress={handlePickImage}
            >
              <MaterialIcons name="photo-library" size={24} color="#666" />
              <Text className="ml-2 text-gray-600">Adicionar foto</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
} 
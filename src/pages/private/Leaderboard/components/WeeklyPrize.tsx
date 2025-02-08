import { View, Text, Image } from 'react-native';

type WeeklyPrizeProps = {
  title: string;
  description: string;
  image: { uri: string };
};

export const WeeklyPrize = ({ title, description, image }: WeeklyPrizeProps) => {
  return (
    <View className="mb-4 bg-primary/10 p-4 rounded-xl">
      <Text className="text-white font-bold text-lg mb-2">{title}</Text>
      <Text className="text-white/80 mb-3">{description}</Text>
      <Image 
        source={image}
        className="w-full h-32 rounded-lg"
        resizeMode="contain"
      />
    </View>
  );
}; 
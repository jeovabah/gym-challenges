import { View, Text } from "react-native";

type CardHeaderProps = {
  title: string;
  description: string;
};

export const CardHeader = ({ title, description }: CardHeaderProps) => {
  return (
    <>
      <Text className="text-green-500 text-2xl font-bold font-poppins-bold text-right">
        {title}
      </Text>
      <Text className="text-gray-300 text-lg text-left mt-2 font-poppins-regular">
        |
      </Text>
      <Text className="text-gray-300 text-base text-left mt-2 flex-1 font-poppins-regular">
        {description}
      </Text>
    </>
  );
};

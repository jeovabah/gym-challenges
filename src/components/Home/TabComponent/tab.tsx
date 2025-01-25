import { ReactNode } from "react";
import { Text, TouchableOpacity } from "react-native";

export const Tab = ({
  title,
  icon,
  isActive,
  onPress,
}: {
  title: string;
  icon: ReactNode;
  isActive: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 items-center justify-center p-1 rounded-lg"
    >
      {icon && icon}
      <Text
        className={`font-poppins-regular text-sm text-center ${
          isActive ? "text-white" : "text-gray-400"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

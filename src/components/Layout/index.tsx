import { SafeAreaView, Text, View, ScrollView } from "react-native";
import { BackButton } from "@/components/GoBack";
import { useTheme } from "styled-components/native";

interface LayoutProps {
  children: React.ReactNode;
  noPadding?: boolean;
  useSafeArea?: boolean;
  title?: string;
  icon?: React.ReactNode;
  onPressBack?: () => void;
  useHeader?: boolean;
}

export const Layout = ({
  children,
  noPadding,
  useSafeArea = false,
  useHeader = false,
  title,
  icon,
  onPressBack,
}: LayoutProps) => {
  const theme = useTheme();
  const renderHeader = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 16,
        }}
      >
        <BackButton onPressBack={onPressBack} />
        {title ? <Text className="font-poppins-regular" style={{ marginRight: 8 }}>{title}</Text> : <View />}
        {icon ? icon : <View />}
      </View>
    );
  };

  const content = (
    <>
      {useHeader && renderHeader()}
      {children}
    </>
  );

  if (useSafeArea) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: theme.colors.background,
            padding: noPadding ? 0 : 24,
          }}
        >
          {content}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: noPadding ? 0 : 24,
        backgroundColor: theme.colors.background,
      }}
    >
      {content}
    </ScrollView>
  );
};

import { LinearGradient } from "expo-linear-gradient";
import { Container, ButtonText } from "./styles";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components/native";

interface ButtonProps {
  variant?: "primary" | "secondary" | "tertiary" | "gradient";
  size?: "small" | "medium" | "large";
  children?: React.ReactNode;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Button = ({
  variant = "primary",
  size = "medium",
  children,
  onPress,
  loading,
  disabled,
  className,
}: ButtonProps) => {
  const theme = useTheme();

  if (variant === "gradient") {
    return (
      <LinearGradient
        colors={theme.colors.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 15,
        }}
      >
        <Container
          variant={variant}
          size={size}
          onPress={onPress}
          disabled={disabled || loading}
          style={{
            backgroundColor: "transparent",
          }}
          className={className}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <ButtonText variant={variant} size={size}>
              {children}
            </ButtonText>
          )}
        </Container>
      </LinearGradient>
    );
  }
  return (
    <Container
      variant={variant}
      size={size}
      onPress={onPress}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <ActivityIndicator color="#FFF" />
      ) : (
        <ButtonText variant={variant} size={size}>
          {children}
        </ButtonText>
      )}
    </Container>
  );
};

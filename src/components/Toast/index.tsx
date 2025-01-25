import React, { useEffect } from "react";
import { Text } from "react-native";
import { Button, Container } from "./styles";
import {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useToastEvent } from "./toastEvent";

const Toast = () => {
  const { useToast, dispatch } = useToastEvent();
  const toast = useToast();
  const vOffset = useSharedValue(-100);

  const statusColor = (status: string) => {
    switch (status) {
      case "success":
        return "green";
      case "error":
        return "red";
      case "warning":
        return "yellow";
      default:
        return "blue";
    }
  };
  
  const config = {
    duration: 500,
  };

  const animatedProps = useAnimatedProps(() => {
    return {
      top: withTiming(vOffset.value, config),
    };
  });

  const animateIn = () => {
    vOffset.value = 50;
  };

  const animateOut = () => {
    vOffset.value = -100;
    setTimeout(() => {
      dispatch(null);
    }, config.duration);
  };

  React.useEffect(() => {
    if (toast) {
      animateIn();
      setTimeout(animateOut, config.duration + 3000);
    }
  }, [toast]);

  return toast ? (
    <Container
      style={[
        animatedProps,
        {
          borderColor: statusColor(toast.status),
          borderWidth: 1,
        },
      ]}
    >
      <Button
        onPress={animateOut}
        style={{
          shadowColor: "#000000",
          shadowOffset: {
            width: 1,
            height: 3,
          },
          shadowOpacity: 0.17,
          shadowRadius: 3.05,
          elevation: 4,
          borderLeftColor: statusColor(toast.status),
        }}
      >
        <Text className="font-poppins-regular">{toast.message}</Text>
      </Button>
    </Container>
  ) : null;
};

export default Toast;

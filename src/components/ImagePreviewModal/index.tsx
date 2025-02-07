import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, View, TouchableOpacity, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  PinchGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export interface ImagePreviewModalRef {
  show: (imageUrl: string) => void;
  hide: () => void;
}

interface ImagePreviewModalProps {}

type PinchContext = {
  startScale: number;
};

const ImagePreviewModalComponent: React.ForwardRefRenderFunction<
  ImagePreviewModalRef,
  ImagePreviewModalProps
> = (props, ref) => {
  const [visible, setVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchHandler = useAnimatedGestureHandler({
    onStart: (event, context: PinchContext) => {
      context.startScale = savedScale.value;
    },
    onActive: (event, context: PinchContext) => {
      scale.value = Math.max(
        0.5,
        Math.min(context.startScale * event.scale, 4)
      );
    },
    onEnd: () => {
      savedScale.value = scale.value;
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  useImperativeHandle(ref, () => ({
    show: (url: string) => {
      setImageUrl(url);
      setVisible(true);
    },
    hide: () => {
      setVisible(false);
      scale.value = 1;
      savedScale.value = 1;
    },
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View className="flex-1 bg-black">
        <TouchableOpacity
          onPress={() => setVisible(false)}
          className="absolute top-12 right-4 z-10"
        >
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>

        <GestureHandlerRootView className="flex-1">
          <PinchGestureHandler onGestureEvent={pinchHandler}>
            <Animated.View className="flex-1 justify-center items-center">
              <Animated.Image
                source={{ uri: imageUrl }}
                style={[
                  {
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT * 0.6,
                    resizeMode: "contain",
                  },
                  animatedStyle,
                ]}
              />
            </Animated.View>
          </PinchGestureHandler>
        </GestureHandlerRootView>
      </View>
    </Modal>
  );
};

export const ImagePreviewModal = forwardRef<
  ImagePreviewModalRef,
  ImagePreviewModalProps
>(ImagePreviewModalComponent);

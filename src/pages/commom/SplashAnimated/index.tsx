import { View, Image, Animated, Easing, Text } from "react-native";
import { useEffect, useRef } from "react";
import Logo from "../../../../assets/gymgreen-no-bg.png";
import { navigate } from "@/routes/utils";

export const SplashAnimated = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.2)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    const animations = [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -20,
          duration: 1500,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 2000,
        delay: 500,
        useNativeDriver: true,
      }),
    ];

    Animated.parallel(animations).start(() => {});
  }, [fadeAnim, scaleAnim, rotateAnim, bounceAnim, textFadeAnim]);

  return (
    <View className="flex-1 bg-[#232323] items-center justify-center">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            {
              rotate: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"],
              }),
            },
            { translateY: bounceAnim },
          ],
        }}
      >
        <Image
          source={Logo}
          className="w-[200px] h-[200px]"
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View
        style={{
          opacity: textFadeAnim,
          marginTop: 20,
        }}
      >
        <Text className="text-green-500 text-3xl text-center tracking-wider font-poppins-bold">
          Gym Green
        </Text>
      </Animated.View>
    </View>
  );
};

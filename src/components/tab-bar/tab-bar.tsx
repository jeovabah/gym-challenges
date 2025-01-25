import React, { FC, useEffect } from "react";
import { Dimensions, TextStyle, View, ViewStyle } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import Animated, {
  runOnJS,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { interpolatePath } from "react-native-redash";

import usePath from "./path/hooks/usePath";
import { getPathXCenter } from "./path/path";
import TabItem from "./tab-item/tab-item";
import AnimatedCircle from "./animated-circle/animated-circle";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import styles from "./tab-bar.styles";

type Props = BottomTabBarProps & {
  numOfTabs: number;
  lableStyle?: TextStyle;
  iconUnActiveColor: string;
  iconActiveColor: string;
  circleStyle?: ViewStyle;
};
const AnimatedPath = Animated.createAnimatedComponent(Path);
export const TabBar: FC<Props> = ({
  state,
  descriptors,
  navigation,
  numOfTabs,
  lableStyle,
  iconUnActiveColor,
  iconActiveColor,
  circleStyle,
}) => {
  const { width } = Dimensions.get("screen");
  const { containerPath, curvedPaths, tHeight } = usePath({
    numTabs: numOfTabs,
  });
  const circleXCoordinate = useSharedValue(0);
  const progress = useSharedValue(1);
  const handleMoveCircle = (currentPath: string) => {
    circleXCoordinate.value = getPathXCenter(currentPath);
  };

  const animatedProps = useAnimatedProps(() => {
    const currentPath = interpolatePath(
      progress.value,
      Array.from({ length: curvedPaths.length }, (_, index) => index + 1),
      curvedPaths
    );
    runOnJS(handleMoveCircle)(currentPath);
    return {
      d: `${containerPath} ${currentPath}`,
    };
  });

  useEffect(() => {
    progress.value = withTiming(state.index + 1);
  }, [state.index]);

  const handleTabPress = (_: number, tab: string) => {
    navigation.navigate(tab);
  };

  return (
    <View style={styles.tabBarContainer}>
      <Svg width={width} height={tHeight} style={styles.shadowMd}>
        <Defs>
          <LinearGradient id="gradient" x1="0" y1="1" x2="1" y2="1">
            <Stop offset="0" stopColor="#1C5520" stopOpacity="1" />
            <Stop offset="1" stopColor="#2E8A33" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <AnimatedPath fill="url(#gradient)" animatedProps={animatedProps} />
      </Svg>
      <AnimatedCircle style={circleStyle} circleX={circleXCoordinate} />
      <View
        style={[
          styles.tabItemsContainer,
          {
            height: tHeight,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ? options.title : route.name;

          return (
            <TabItem
              iconActiveColor={iconActiveColor}
              iconUnActiveColor={iconUnActiveColor}
              lableStyle={lableStyle}
              totalTabs={state.routes.length}
              key={index.toString()}
              label={label as string}
              activeIndex={state.index + 1}
              index={index}
              onTabPress={() => handleTabPress(index + 1, route.name)}
              icon={
                options.tabBarIcon
                  ? options.tabBarIcon({
                      focused: state.index === index,
                      color:
                        state.index === index
                          ? iconActiveColor
                          : iconUnActiveColor,
                      size: 24,
                    })
                  : null
              }
            />
          );
        })}
      </View>
    </View>
  );
};
export default TabBar;

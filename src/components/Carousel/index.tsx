import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  ScrollViewStyled,
  ImageContainer,
  CarouselImage,
  View,
  Dot,
} from "./styles";
import { Dimensions, ScrollView } from "react-native";

const { width } = Dimensions.get("window");

export const Carousel = ({ images }: { images: string[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    if (isAutoScrolling) return;

    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAutoScrolling(true);
      setActiveIndex((prevIndex) => {
        const currentIndex = (prevIndex + 1) % images.length;
        scrollViewRef.current?.scrollTo({
          x: currentIndex * width,
          animated: true,
        });
        return currentIndex;
      });

      // dot ficava piscando de um lado para outro, estava dando conflito com handleScroll,
      // agora o código sabe quando foi automático e quando foi o usuário
      setTimeout(() => setIsAutoScrolling(false), 500);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <Container>
      <ScrollViewStyled
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          justifyContent: images.length === 1 ? "center" : "flex-start",
        }}
      >
        {images.map((image, index) => (
          <ImageContainer key={index}>
            <CarouselImage source={{ uri: image }} resizeMode="cover" />
          </ImageContainer>
        ))}
      </ScrollViewStyled>
      <View>
        {images.map((_, index) => (
          <Dot key={index} active={activeIndex === index} />
        ))}
      </View>
    </Container>
  );
};

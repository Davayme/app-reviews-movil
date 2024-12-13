import React, { useState, useRef } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import tw from 'tailwind-react-native-classnames';

const { width: screenWidth } = Dimensions.get('window');

interface CarouselProps {
  data: Array<{ uri: string }>;
  renderItem: ({ item }: { item: { uri: string } }) => JSX.Element;
}

const Carousel: React.FC<CarouselProps> = ({ data, renderItem }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(index);
  };

  return (
    <View style={tw`w-full`}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {data.map((item, index) => (
          <View key={index} style={{ width: screenWidth }}>
            {renderItem({ item })}
          </View>
        ))}
      </ScrollView>
      <View style={tw`flex-row justify-center mt-2`}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              tw`h-2 w-2 rounded-full mx-1`,
              currentIndex === index ? tw`bg-blue-500` : tw`bg-gray-300`,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default Carousel;
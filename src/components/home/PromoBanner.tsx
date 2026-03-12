import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRef, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { FlatList, Image, Pressable, Text, useWindowDimensions, View } from 'react-native';

interface BannerItem {
  id: string;
  badge: string;
  title: string;
  cta: string;
  overlay: string;
  image: string;
}

const BANNERS: BannerItem[] = [
  {
    id: '1',
    badge: 'CHĂM SÓC TOÀN DIỆN',
    title: 'Chăm sóc sức khỏe\nphổi toàn diện',
    cta: 'Khám phá ngay',
    overlay: 'rgba(10,124,255,0.85)',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCYxDTSa51LrRLJsK4BTzCss1JQTQgnOsX1g-rO51r4EYTNrOScpK4-yHLycKeck2A6sz5r7eNc0zjmL6YNawHTzluXZGmE2iF9frPWZ4p9kcR1nQtCJa5iXD1j5AdfyQ-kdLYVVl7Q55GNFCe54ayCKMrqWkDVBL98PLgbXttWefV2WKqsVIxEcdTPXyx1lU-p3g49wDyuH2l2ued3MBzemwNuXJMYR1NqSTZDQNsh4yFkPQDZF9yKfBr5LsZh7EH831C-k0gKAo0m',
  },
  {
    id: '2',
    badge: 'ĐẶT LỊCH NGAY',
    title: 'Hơn 50 bác sĩ\nchuyên khoa hô hấp',
    cta: 'Đặt lịch khám',
    overlay: 'rgba(5,150,105,0.85)',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC_iLiX96-7KdxD4YhY0FSz0j7UjUIwRaf_hijFJXoGnoU0IKtsM5oAaEYSD5faycH9y8oNIauP5l9PXYxdsY8BgA76M9mLZJ8ee-3zNiE5svEEj9YwZ2w1qWdc7fqr3OPfkX5dkfXBaLvlobTs2n7EgUxU2vrO2z08OQ7LYxOz-yk62p01ISci48F58PYinPutu76l38sDmsdKyYvzADcFQ5Ir61f-_9CilNd2SDQQ-joUrGyreyvry5R-zRH__G7ns7a-0x5bTuPF',
  },
  {
    id: '3',
    badge: 'CÔNG NGHỆ AI',
    title: 'Phân tích X-quang\nphổi bằng AI',
    cta: 'Thử ngay miễn phí',
    overlay: 'rgba(79,70,229,0.85)',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD8Z35PMEKVy1oCowwCra6qNghyrapFVbSjVECe3cNKjl9gZJHbC4gWSbILWcIonzWzC2L-dgPNFoAVbfFQj8SIDoprB3jEKaqmVyP6_DkfYIAuSHJxPiThA1CjgGDL1vIkDu8l4o0VvJbY1M-7mGIRoFs5AbQiuFe9F8eVabNuGTYVUXVKT5QW0pmOXYzTKTwkDUyGpEZGa_xZ-2_an9chkmWtjg9hPXGNeXRmlFf3hHtS1ahwIv5dJKZmRNMlXphQUS7w_KvcyEMB',
  },
];

export function PromoBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { width } = useWindowDimensions();
  const itemWidth = width - 32;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / itemWidth);
    setActiveIndex(idx);
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={BANNERS}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        snapToAlignment="start"
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={{ width: itemWidth }} className="h-44 rounded-2xl overflow-hidden relative">
            <Image
              source={{ uri: item.image }}
              className="absolute inset-0 w-full h-full"
              resizeMode="cover"
            />
            <View style={{ backgroundColor: item.overlay }} className="absolute inset-0" />
            <View className="absolute top-0 bottom-0 left-0 w-1.5 bg-secondary" />

            <View className="absolute top-0 bottom-0 left-5 right-4 justify-center">
              <View className="flex-row items-center gap-2 mb-2.5">
                <View className="bg-white/20 border border-white/25 rounded-lg px-2.5 py-1">
                  <Text className="text-white text-[10px] font-bold tracking-wide">{item.badge}</Text>
                </View>
                <View className="w-2 h-2 rounded-full bg-secondary" />
              </View>

              <Text className="text-white text-xl font-bold leading-7 mb-4">{item.title}</Text>

              <Pressable
                style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
                className="bg-secondary rounded-xl px-5 py-2.5 self-start flex-row items-center gap-1.5"
              >
                <Text className="text-white text-sm font-bold">{item.cta}</Text>
                <MaterialIcons name="arrow-forward" size={16} color="white" />
              </Pressable>
            </View>

            <View className="absolute bottom-3 right-4 flex-row gap-1.5">
              {BANNERS.map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: i === activeIndex ? 16 : 6,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: i === activeIndex ? 'white' : 'rgba(255,255,255,0.4)',
                  }}
                />
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}


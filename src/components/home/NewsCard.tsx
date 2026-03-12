import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image, Pressable, Text, View } from 'react-native';

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  image: string;
  badge?: string;
}

interface NewsCardProps {
  item: NewsItem;
}

export function NewsCard({ item }: NewsCardProps) {
  return (
    <Pressable
      style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
      className="w-60 bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm elevation-1"
    >
      <View className="h-32 relative overflow-hidden rounded-t-[18px]">
        <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
        {item.badge && (
          <View className="absolute top-2 left-2 bg-blue-600/90 rounded-lg px-2 py-1">
            <Text className="text-white text-[10px] font-bold">{item.badge}</Text>
          </View>
        )}
      </View>
      <View className="p-3.5">
        <Text className="text-sm font-bold text-gray-800 leading-[18px] mb-2" numberOfLines={2}>
          {item.title}
        </Text>
        <View className="flex-row items-center gap-1">
          <MaterialIcons name="calendar-today" size={13} color="#94A3B8" />
          <Text className="text-[11px] text-slate-400">{item.date}</Text>
        </View>
      </View>
    </Pressable>
  );
}


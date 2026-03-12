import { Pressable, Text, View } from 'react-native';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

export function SectionHeader({ title, onSeeAll }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-3.5">
      <Text className="text-[17px] font-bold text-gray-800">{title}</Text>
      {onSeeAll && (
        <Pressable onPress={onSeeAll}>
          <Text className="text-secondary text-sm font-semibold">Xem tất cả</Text>
        </Pressable>
      )}
    </View>
  );
}


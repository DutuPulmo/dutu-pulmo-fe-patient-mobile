import { Text, View } from 'react-native';

interface InfoListProps {
  items: string[];
}

export function InfoList({ items }: InfoListProps) {
  return (
    <View className="gap-1.5">
      {items.map((item, i) => (
        <View key={`${item}-${i}`} className="flex-row gap-2">
          <Text className="text-sm text-gray-400"></Text>
          <Text className="flex-1 text-sm leading-relaxed text-gray-600">{item}</Text>
        </View>
      ))}
    </View>
  );
}


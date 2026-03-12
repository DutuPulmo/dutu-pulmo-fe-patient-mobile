import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface SectionLabelProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  color: string;
}

export function SectionLabel({ icon, label, color }: SectionLabelProps) {
  return (
    <View className="mb-3 flex-row items-center gap-2">
      <MaterialIcons name={icon} size={18} color={color} />
      <Text className="text-sm font-semibold text-gray-800">{label}</Text>
    </View>
  );
}


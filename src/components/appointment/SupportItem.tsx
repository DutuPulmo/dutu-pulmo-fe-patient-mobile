import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

interface SupportItemProps {
  icon: string;
  label: string;
}

export function SupportItem({ icon, label }: SupportItemProps) {
  return (
    <Pressable
      className="flex-row items-center border-b border-slate-100 py-[14px]"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <View className="mr-3 h-9 w-9 items-center justify-center rounded-[10px] bg-slate-100">
        <MaterialIcons name={icon as any} size={18} color="#6b7280" />
      </View>
      <Text className="flex-1 text-sm text-gray-700">{label}</Text>
      <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
    </Pressable>
  );
}

export default SupportItem;

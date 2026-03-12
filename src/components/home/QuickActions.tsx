import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, Text, View } from 'react-native';

export interface QuickAction {
  key: string;
  label: string;
  iconName: string;
  color: string;
  bg: string;
  onPress: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <View className="bg-white rounded-3xl p-5 shadow-sm elevation-2 border border-slate-100">
      <View className="flex-row flex-wrap">
        {actions.map((item, idx) => (
          <View
            key={item.key}
            className="w-1/4 items-center"
            style={{ marginBottom: idx < actions.length - 4 ? 24 : 0 }}
          >
            <Pressable
              onPress={item.onPress}
              style={({ pressed }) => ({
                backgroundColor: item.bg,
                opacity: pressed ? 0.85 : 1,
              })}
              className="w-14 h-14 rounded-2xl items-center justify-center"
            >
              <MaterialIcons name={item.iconName as never} size={26} color={item.color} />
            </Pressable>
            <Text className="text-[10px] font-bold text-gray-800 text-center mt-2 leading-tight">
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}


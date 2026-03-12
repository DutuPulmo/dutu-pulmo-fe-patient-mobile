import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

interface SpecialtyGridProps {
  items: string[];
}

function getSpecialtyConfig(specialty: string) {
  switch (specialty) {
    case 'Pulmonology':
      return { label: 'Hô hấp', icon: 'lungs', color: theme.colors.primary, bg: '#EFF6FF' };
    case 'Thoracic Surgery':
      return {
        label: 'Phẫu thuật lồng ngực',
        icon: 'heart-pulse',
        color: theme.colors.secondary,
        bg: '#F0FDF4',
      };
    case 'Respiratory Medicine':
      return { label: 'Nội khoa hô hấp', icon: 'stethoscope', color: '#4F46E5', bg: '#EEF2FF' };
    case 'Tuberculosis':
      return { label: 'Lao phổi', icon: 'virus', color: '#EF4444', bg: '#FEF2F2' };
    default:
      return { label: specialty, icon: 'medical-bag', color: '#6B7280', bg: '#F3F4F6' };
  }
}

export function SpecialtyGrid({ items }: SpecialtyGridProps) {
  return (
    <View className="flex-row flex-wrap gap-4">
      {items.slice(0, 4).map((specialty) => {
        const { label, icon, color, bg } = getSpecialtyConfig(specialty);

        return (
          <Pressable key={specialty} className="items-center gap-1.5 w-16">
            <View
              style={{ backgroundColor: bg }}
              className="w-14 h-14 rounded-2xl items-center justify-center"
            >
              <MaterialCommunityIcons name={icon as never} size={34} color={color} />
            </View>
            <Text className="text-[10px] font-medium text-gray-500 text-center" numberOfLines={2}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

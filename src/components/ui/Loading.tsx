import { ActivityIndicator, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

type Props = {
  label?: string;
  fullscreen?: boolean;
};

export function Loading({ label = 'Loading...', fullscreen = true }: Props) {
  return (
    <View className={`${fullscreen ? 'flex-1' : 'py-6'} items-center justify-center`}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text className="mt-2 text-sm text-slate-500">{label}</Text>
    </View>
  );
}

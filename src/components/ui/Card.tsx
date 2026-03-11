import { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { theme } from '@/constants/theme';

type Props = PropsWithChildren<{ className?: string }>;

export function Card({ children, className = '' }: Props) {
  return (
    <View className={`rounded-2xl border border-slate-200 bg-white p-4 ${className}`} style={theme.shadow.card}>
      {children}
    </View>
  );
}

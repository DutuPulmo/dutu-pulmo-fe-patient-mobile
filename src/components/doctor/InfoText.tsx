import type { ReactNode } from 'react';
import { Text } from 'react-native';

interface InfoTextProps {
  children: ReactNode;
}

export function InfoText({ children }: InfoTextProps) {
  return <Text className="text-sm leading-relaxed text-gray-600">{children}</Text>;
}


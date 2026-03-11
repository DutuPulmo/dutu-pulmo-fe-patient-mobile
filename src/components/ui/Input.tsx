import { ReactNode } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { theme } from '@/constants/theme';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  left?: ReactNode;
  right?: ReactNode;
};

export function Input({ label, error, left, right, ...props }: Props) {
  return (
    <View className="w-full">
      {label ? <Text className="mb-2 text-sm font-medium text-slate-700">{label}</Text> : null}
      <View
        className={`flex-row items-center rounded-xl border bg-white px-3 ${error ? 'border-red-500' : 'border-slate-200'}`}
        style={theme.shadow.card}
      >
        {left}
        <TextInput
          className="h-12 flex-1 text-base text-slate-900"
          placeholderTextColor="#94a3b8"
          {...props}
        />
        {right}
      </View>
      {error ? <Text className="mt-1 text-xs text-red-500">{error}</Text> : null}
    </View>
  );
}

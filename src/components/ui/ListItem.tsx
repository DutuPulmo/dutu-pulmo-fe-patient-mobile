import { type ReactNode } from 'react';
import { Pressable, type PressableProps, Text, View } from 'react-native';

type Props = PressableProps & {
  title: string;
  subtitle?: string;
  right?: ReactNode;
};

export function ListItem({ title, subtitle, right, ...props }: Props) {
  return (
    <Pressable className="flex-row items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3" {...props}>
      <View className="flex-1 pr-3">
        <Text className="text-base font-semibold text-slate-900">{title}</Text>
        {subtitle ? <Text className="mt-0.5 text-sm text-slate-500">{subtitle}</Text> : null}
      </View>
      {right}
    </Pressable>
  );
}

export default ListItem;

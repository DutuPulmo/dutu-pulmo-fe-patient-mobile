import { Text, View } from 'react-native';

type Props = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: Props) {
  return (
    <View className="items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6">
      <Text className="text-base font-semibold text-slate-800">{title}</Text>
      {description ? <Text className="mt-1 text-center text-sm text-slate-500">{description}</Text> : null}
    </View>
  );
}

export default EmptyState;

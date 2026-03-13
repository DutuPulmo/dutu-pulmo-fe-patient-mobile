import { Text, View } from 'react-native';

interface InfoRowHorizontalProps {
  label: string;
  value: string;
}

/**
 * Horizontal info row — label on left, value on right.
 * Used in BookAppointmentScreen patient info section.
 */
export function InfoRowHorizontal({ label, value }: InfoRowHorizontalProps) {
  return (
    <View className="flex-row items-center justify-between py-2">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="ml-4 max-w-[60%] shrink-0 text-right text-sm font-medium text-slate-900">
        {value}
      </Text>
    </View>
  );
}

export default InfoRowHorizontal;

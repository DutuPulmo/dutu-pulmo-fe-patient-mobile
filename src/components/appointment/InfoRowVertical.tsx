import { Text, View } from 'react-native';

interface InfoRowVerticalProps {
  label: string;
  value: string;
}

interface InfoRowVerticalTwoProps {
  items: { label: string; value: string }[];
}

/**
 * Vertical info row — small label above, bold value below.
 * Used in ConfirmAppointmentScreen patient info section.
 */
export function InfoRowVertical({ label, value }: InfoRowVerticalProps) {
  return (
    <View className="mb-3">
      <Text className="mb-[3px] text-xs text-slate-400">{label}</Text>
      <Text className="text-sm font-semibold text-slate-900">{value}</Text>
    </View>
  );
}

/**
 * Two-column vertical info row — two InfoRowVertical side by side.
 * Used in ConfirmAppointmentScreen for paired fields (gender + dob, phone + insurance).
 */
export function InfoRowVerticalTwo({ items }: InfoRowVerticalTwoProps) {
  return (
    <View className="mb-3 flex-row">
      {items.map((item, i) => (
        <View key={i} className="flex-1">
          <Text className="mb-[3px] text-xs text-slate-400">{item.label}</Text>
          <Text className="text-sm font-semibold text-slate-900">{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

export default InfoRowVertical;

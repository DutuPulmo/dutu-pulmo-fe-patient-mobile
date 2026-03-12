import { Text, TouchableOpacity, View } from 'react-native';

export interface TimeSlot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  period: 'morning' | 'afternoon';
}

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export function TimeSlotGrid({ slots, selected, onSelect }: TimeSlotGridProps) {
  if (slots.length === 0) return null;

  return (
    <View className="flex-row flex-wrap gap-3">
      {slots.map((slot) => {
        const isSelected = slot.id === selected;

        return (
          <TouchableOpacity
            key={slot.id}
            onPress={() => onSelect(slot.id)}
            className={`rounded-lg border px-3 py-2.5 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
            style={{ minWidth: 108 }}
          >
            <Text className={`text-center text-xs font-semibold ${isSelected ? 'text-blue-600' : 'text-gray-700'}`}>
              {slot.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


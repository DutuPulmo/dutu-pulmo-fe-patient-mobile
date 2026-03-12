import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export interface DateItem {
  label: string;
  day: number;
  date: string;
  slots: number;
}

function SlotBadge({ count }: { count: number }) {
  const active = count > 0;

  return (
    <View className={`mt-1 rounded-full px-2 py-0.5 ${active ? 'bg-emerald-500' : 'bg-gray-100'}`}>
      <Text
        className={`text-[10px] font-bold ${active ? 'text-white' : 'text-gray-400'}`}
        numberOfLines={1}
      >
        {count > 0 ? `${count} slot` : '0 slot'}
      </Text>
    </View>
  );
}

interface DatePickerProps {
  dates: DateItem[];
  selected: string;
  onSelect: (date: string) => void;
}

export function DatePicker({ dates, selected, onSelect }: DatePickerProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 12, paddingHorizontal: 4, paddingBottom: 8 }}
    >
      {dates.map((item) => {
        const isSelected = item.date === selected;

        return (
          <TouchableOpacity
            key={item.date}
            onPress={() => onSelect(item.date)}
            className="items-center"
            style={{ minWidth: 52 }}
          >
            <Text className={`mb-1 text-xs font-semibold ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
              {item.label}
            </Text>
            <View
              className={`h-11 w-11 items-center justify-center rounded-full ${
                isSelected ? 'border border-blue-400 bg-blue-50' : 'border border-gray-200 bg-white'
              }`}
            >
              <Text className={`text-base font-bold ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
                {item.day}
              </Text>
            </View>
            <SlotBadge count={item.slots} />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}


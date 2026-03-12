import { Image, Pressable, Text, View } from 'react-native';

export interface Facility {
  id: string;
  name: string;
  address: string;
  type: string;
  distance: string;
  logo: string;
  typeColor: string;
  typeBg: string;
}

interface FacilityCardProps {
  item: Facility;
}

export function FacilityCard({ item }: FacilityCardProps) {
  return (
    <Pressable
      style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
      className="w-[152px] bg-white p-3 rounded-[18px] border border-slate-100 shadow-sm elevation-1"
    >
      <View className="w-24 h-24 rounded-xl bg-slate-50 overflow-hidden self-center mb-2.5">
        <Image source={{ uri: item.logo }} className="w-full h-full" resizeMode="cover" />
      </View>
      <Text className="text-sm font-bold text-gray-800 leading-[18px]" numberOfLines={2}>
        {item.name}
      </Text>
      <Text className="text-[11px] text-gray-500 mt-1 mb-1.5" numberOfLines={1}>
        {item.address}
      </Text>

      <View className="flex-row items-center justify-between mt-auto">
        <View style={{ backgroundColor: item.typeBg }} className="rounded-md px-1.5 py-0.5">
          <Text style={{ color: item.typeColor }} className="text-[9px] font-semibold">
            {item.type}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

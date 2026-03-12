import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { HospitalCard } from '@/components/hospital/HospitalCard';
import { HospitalFilterSheet } from '@/components/hospital/HospitalFilterSheet';
import type { HospitalFilter } from '@/components/hospital/HospitalFilterSheet';
import { useHospitals } from '@/hooks/useHospitals';

export function HospitalListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<HospitalFilter>({
    city: '',
    type: 'all',
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (text: string) => {
    setSearch(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchDebounced(text), 400);
  };

  const hospitalsQuery = useHospitals({
    search: searchDebounced || undefined,
    city: activeFilter.city || undefined,
    page: 1,
    limit: 50,
  });

  const hasFilters = activeFilter.city || activeFilter.type !== 'all';
  const rawHospitals = hospitalsQuery.data?.items ?? [];

  const hospitals = rawHospitals.filter((h) => {
    if (activeFilter.type === 'clinic') return h.name.toLowerCase().includes('phòng khám');
    if (activeFilter.type === 'hospital') return !h.name.toLowerCase().includes('phòng khám');
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={{
          backgroundColor: '#0A7CFF',
          paddingTop: 52,
          paddingBottom: 16,
          paddingHorizontal: 16,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Pressable
            onPress={() => router.back()}
            style={{ padding: 8, marginLeft: -8, marginRight: 8 }}
          >
            <MaterialIcons name="arrow-back-ios" size={20} color="white" />
          </Pressable>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '700', flex: 1 }}>
            Cơ sở y tế
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 12,
            paddingHorizontal: 12,
            height: 44,
            gap: 8,
          }}
        >
          <MaterialIcons name="search" size={20} color="#94A3B8" />
          <TextInput
            placeholder="Tên bệnh viện, phòng khám..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={handleSearchChange}
            style={{ flex: 1, fontSize: 14, color: '#1F2937' }}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <Pressable
              onPress={() => {
                setSearch('');
                setSearchDebounced('');
              }}
            >
              <MaterialIcons name="close" size={18} color="#94A3B8" />
            </Pressable>
          )}
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 10,
          gap: 8,
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#F1F5F9',
        }}
      >
        <Pressable
          onPress={() => setFilterVisible(true)}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: hasFilters ? '#EFF6FF' : '#F8FAFC',
            borderRadius: 20,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: hasFilters ? '#0A7CFF' : '#E2E8F0',
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <MaterialCommunityIcons
            name="tune-variant"
            size={16}
            color={hasFilters ? '#0A7CFF' : '#6B7280'}
          />
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: hasFilters ? '#0A7CFF' : '#6B7280',
            }}
          >
            Bộ lọc{hasFilters ? ' •' : ''}
          </Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        {!hospitalsQuery.isLoading && (
          <Text style={{ fontSize: 12, color: '#94A3B8' }}>{hospitals.length} cơ sở</Text>
        )}
      </View>

      {hospitalsQuery.isLoading ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}
        >
          <ActivityIndicator size="large" color="#0A7CFF" />
          <Text style={{ color: '#94A3B8', fontSize: 14 }}>Đang tải cơ sở y tế...</Text>
        </View>
      ) : hospitals.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: 40,
          }}
        >
          <MaterialIcons name="apartment" size={56} color="#CBD5E1" />
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#374151' }}>
            Không tìm thấy cơ sở
          </Text>
          <Text style={{ fontSize: 14, color: '#94A3B8', textAlign: 'center' }}>
            Thử thay đổi từ khoá hoặc xoá bộ lọc.
          </Text>
          {hasFilters && (
            <Pressable
              onPress={() => setActiveFilter({ city: '', type: 'all' })}
              style={({ pressed }) => ({
                backgroundColor: '#EFF6FF',
                borderRadius: 12,
                paddingHorizontal: 20,
                paddingVertical: 10,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text style={{ color: '#0A7CFF', fontWeight: '600' }}>Xoá bộ lọc</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <FlatList
          data={hospitals}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          renderItem={({ item }) => (
            <HospitalCard
              hospital={item}
              onPress={() => router.push(`/hospitals/${item.id}` as any)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}

      <HospitalFilterSheet
        visible={filterVisible}
        current={activeFilter}
        onApply={setActiveFilter}
        onClose={() => setFilterVisible(false)}
      />
    </View>
  );
}

export default HospitalListScreen;

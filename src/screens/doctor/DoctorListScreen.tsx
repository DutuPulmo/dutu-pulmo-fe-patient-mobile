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

import { DoctorCard } from '@/components/doctor/DoctorCard';
import { DoctorFilterSheet } from '@/components/doctor/DoctorFilterSheet';
import type { DoctorFilterState } from '@/components/doctor/DoctorFilterSheet';
import { usePublicDoctors } from '@/hooks/useAppointments';
import type { AppointmentTypeFilter } from '@/services/appointment.service';

export function DoctorListScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AppointmentTypeFilter>('offline');
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<DoctorFilterState>({
    specialty: '',
    hospitalId: '',
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (text: string) => {
    setSearch(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchDebounced(text), 400);
  };

  const doctorsQuery = usePublicDoctors({
    page: 1,
    limit: 20,
    search: searchDebounced || undefined,
    specialty: activeFilter.specialty || undefined,
    hospitalId: activeFilter.hospitalId || undefined,
    appointmentType: activeTab,
  });

  const hasFilters = activeFilter.specialty || activeFilter.hospitalId;
  const doctors = doctorsQuery.data?.items ?? [];

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
            Tìm bác sĩ
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
            placeholder="Tên bác sĩ, triệu chứng, chuyên khoa"
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
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#F1F5F9',
            borderRadius: 20,
            padding: 3,
          }}
        >
          {(
            [
              { key: 'offline', label: 'Lịch khám' },
              { key: 'online', label: 'Lịch tư vấn' },
            ] as const
          ).map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 7,
                borderRadius: 16,
                backgroundColor: activeTab === tab.key ? '#FFFFFF' : 'transparent',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: activeTab === tab.key ? '#0A7CFF' : '#64748B',
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

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

        {!doctorsQuery.isLoading && (
          <Text style={{ fontSize: 12, color: '#94A3B8' }}>{doctors.length} bác sĩ</Text>
        )}
      </View>

      {doctorsQuery.isLoading ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}
        >
          <ActivityIndicator size="large" color="#0A7CFF" />
          <Text style={{ color: '#94A3B8', fontSize: 14 }}>Đang tìm bác sĩ phù hợp...</Text>
        </View>
      ) : doctors.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: 40,
          }}
        >
          <MaterialCommunityIcons name="doctor" size={56} color="#CBD5E1" />
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#374151' }}>
            Không tìm thấy bác sĩ
          </Text>
          <Text style={{ fontSize: 14, color: '#94A3B8', textAlign: 'center' }}>
            Thử thay đổi từ khoá tìm kiếm hoặc xoá bộ lọc để xem thêm kết quả.
          </Text>
          {hasFilters && (
            <Pressable
              onPress={() => setActiveFilter({ specialty: '', hospitalId: '' })}
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
          data={doctors}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          renderItem={({ item }) => (
            <DoctorCard doctor={item} onPress={() => router.push(`/doctors/${item.id}`)} />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}

      <DoctorFilterSheet
        visible={filterVisible}
        current={activeFilter}
        onApply={setActiveFilter}
        onClose={() => setFilterVisible(false)}
      />
    </View>
  );
}

export default DoctorListScreen;

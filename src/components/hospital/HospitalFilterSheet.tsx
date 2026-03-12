import { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { useHospitalCities } from '@/hooks/useHospitals';

export interface HospitalFilter {
  city: string;
  type: 'all' | 'hospital' | 'clinic';
}

interface HospitalFilterSheetProps {
  visible: boolean;
  current: HospitalFilter;
  onApply: (f: HospitalFilter) => void;
  onClose: () => void;
}

export function HospitalFilterSheet({
  visible,
  current,
  onApply,
  onClose,
}: HospitalFilterSheetProps) {
  const [draft, setDraft] = useState<HospitalFilter>(current);
  const citiesQuery = useHospitalCities();
  const onOpen = useCallback(() => setDraft(current), [current]);

  const typeOptions: { value: HospitalFilter['type']; label: string }[] = [
    { value: 'all', label: 'Tất cả' },
    { value: 'hospital', label: 'Bệnh viện' },
    { value: 'clinic', label: 'Phòng khám' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onShow={onOpen}
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
        onPress={onClose}
      />
      <View
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 32,
          maxHeight: '75%',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <View
          style={{
            width: 40,
            height: 4,
            backgroundColor: '#E2E8F0',
            borderRadius: 2,
            alignSelf: 'center',
            marginBottom: 16,
          }}
        />
        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#1F2937',
            marginBottom: 20,
          }}
        >
          Bộ lọc
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#374151',
              marginBottom: 12,
            }}
          >
            Loại cơ sở
          </Text>
          {typeOptions.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => setDraft((d) => ({ ...d, type: opt.value }))}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#F8FAFC',
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: draft.type === opt.value ? '#0A7CFF' : '#CBD5E1',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {draft.type === opt.value && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#0A7CFF',
                    }}
                  />
                )}
              </View>
              <Text style={{ fontSize: 14, color: '#374151' }}>{opt.label}</Text>
            </Pressable>
          ))}

          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#374151',
              marginTop: 20,
              marginBottom: 12,
            }}
          >
            Tỉnh / Thành phố
          </Text>
          {[
            { value: '', label: 'Tất cả' },
            ...(citiesQuery.data ?? []).map((c) => ({ value: c, label: c })),
          ].map((item) => (
            <Pressable
              key={item.value}
              onPress={() => setDraft((d) => ({ ...d, city: item.value }))}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: '#F8FAFC',
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: draft.city === item.value ? '#0A7CFF' : '#CBD5E1',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {draft.city === item.value && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#0A7CFF',
                    }}
                  />
                )}
              </View>
              <Text style={{ fontSize: 14, color: '#374151' }}>{item.label}</Text>
            </Pressable>
          ))}
          <View style={{ height: 20 }} />
        </ScrollView>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          <Pressable
            onPress={() => setDraft({ city: '', type: 'all' })}
            style={({ pressed }) => ({
              flex: 1,
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: 'center',
              backgroundColor: '#F1F5F9',
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text style={{ color: '#374151', fontWeight: '600' }}>Xoá bộ lọc</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              onApply(draft);
              onClose();
            }}
            style={({ pressed }) => ({
              flex: 1,
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: 'center',
              backgroundColor: '#0A7CFF',
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ color: 'white', fontWeight: '700' }}>Áp dụng</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

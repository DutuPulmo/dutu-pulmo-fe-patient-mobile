import { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { useSpecialties } from '@/hooks/useAppointments';
import { useHospitals } from '@/hooks/useHospitals';
import { getSpecialtyLabel } from '@/utils/doctor-display';

export interface DoctorFilterState {
  specialty: string;
  hospitalId: string;
}

interface DoctorFilterSheetProps {
  visible: boolean;
  current: DoctorFilterState;
  onApply: (f: DoctorFilterState) => void;
  onClose: () => void;
}

export function DoctorFilterSheet({
  visible,
  current,
  onApply,
  onClose,
}: DoctorFilterSheetProps) {
  const [draft, setDraft] = useState<DoctorFilterState>(current);
  const specialtiesQuery = useSpecialties();
  const hospitalsQuery = useHospitals({ page: 1, limit: 50 });
  const onOpen = useCallback(() => setDraft(current), [current]);

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
          maxHeight: '80%',
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
            Chuyên khoa
          </Text>
          {[
            { value: '', label: 'Tất cả' },
            ...(specialtiesQuery.data ?? []).map((s) => ({
              value: s,
              label: getSpecialtyLabel(s),
            })),
          ].map((item) => (
            <Pressable
              key={item.value}
              onPress={() => setDraft((d) => ({ ...d, specialty: item.value }))}
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
                  borderColor:
                    draft.specialty === item.value ? '#0A7CFF' : '#CBD5E1',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {draft.specialty === item.value && (
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
              <Text style={{ fontSize: 14, color: '#374151' }}>
                {item.label}
              </Text>
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
            Nơi khám
          </Text>
          {[
            { value: '', label: 'Tất cả' },
            ...(hospitalsQuery.data?.items ?? []).map((h) => ({
              value: h.id,
              label: h.name,
            })),
          ].map((item) => (
            <Pressable
              key={item.value}
              onPress={() =>
                setDraft((d) => ({ ...d, hospitalId: item.value }))
              }
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
                  borderColor:
                    draft.hospitalId === item.value ? '#0A7CFF' : '#CBD5E1',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {draft.hospitalId === item.value && (
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
              <Text
                style={{ fontSize: 14, color: '#374151' }}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
          <View style={{ height: 20 }} />
        </ScrollView>

        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          {/* Xoá bộ lọc */}
          <View style={{ flex: 1, marginRight: 6 }}>
            <View
              style={{
                height: 50,
                borderRadius: 14,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#F1F5F9',
                borderWidth: 1,
                borderColor: '#E2E8F0',
              }}
            >
              <Pressable
                onPress={() => setDraft({ specialty: '', hospitalId: '' })}
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#475569',
                    fontWeight: '600',
                    fontSize: 15,
                  }}
                >
                  Xoá bộ lọc
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Áp dụng */}
          <View style={{ flex: 1, marginLeft: 6 }}>
            <View
              style={{
                height: 50,
                borderRadius: 14,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#2563EB',
                shadowColor: '#2563EB',
                shadowOpacity: 0.25,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                elevation: 3,
              }}
            >
              <Pressable
                onPress={() => {
                  onApply(draft);
                  onClose();
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontWeight: '700',
                    fontSize: 15,
                  }}
                >
                  Áp dụng
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import type { DoctorResponseDto } from '@/types/generated/patient-api';
import { getDoctorTitleLabel, getSpecialtyLabel } from '@/utils/doctor-display';

interface DoctorCardProps {
  doctor: DoctorResponseDto;
  onPress: () => void;
}

export function DoctorCard({ doctor, onPress }: DoctorCardProps) {
  const [avatarError, setAvatarError] = useState(false);
  const hasOnlineFutureSlots = doctor.hasOnlineFutureSlots === true;
  const hasOfflineFutureSlots = doctor.hasOfflineFutureSlots === true;

  const initials = doctor.fullName
    ? doctor.fullName
        .split(' ')
        .slice(-2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('')
    : '?';

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
        marginBottom: 12,
      }}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: '#F1F5F9',
          shadowColor: '#000',
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 1,
          marginBottom: 12,
          opacity: pressed ? 0.93 : 1,
        })}
      >
        <View style={{ flexDirection: 'row', gap: 14 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              overflow: 'hidden',
              backgroundColor: '#DBEAFE',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {doctor.avatarUrl && !avatarError ? (
              <Image
                source={{ uri: doctor.avatarUrl }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <Text
                style={{ fontSize: 22, fontWeight: '700', color: '#0A7CFF' }}
              >
                {initials}
              </Text>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                marginBottom: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: hasOnlineFutureSlots ? '#DCFCE7' : '#F1F5F9',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 999,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: hasOnlineFutureSlots ? '#15803D' : '#64748B',
                  }}
                >
                  {hasOnlineFutureSlots ? 'Online' : 'Không online'}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: hasOfflineFutureSlots
                    ? '#E0F2FE'
                    : '#F1F5F9',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 999,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: '700',
                    color: hasOfflineFutureSlots ? '#0369A1' : '#64748B',
                  }}
                >
                  {hasOfflineFutureSlots ? 'Offline' : 'Không offline'}
                </Text>
              </View>
            </View>
            <Text
              style={{
                fontSize: 11,
                color: '#6B7280',
                fontWeight: '500',
                marginBottom: 2,
              }}
            >
              {getDoctorTitleLabel(doctor.title)}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#1F2937',
                marginBottom: 2,
              }}
              numberOfLines={1}
            >
              {doctor.fullName ?? 'Bác sĩ'}
            </Text>
            {doctor.yearsOfExperience && (
              <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>
                {doctor.yearsOfExperience} năm kinh nghiệm
              </Text>
            )}
            {doctor.specialty && (
              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: '#EFF6FF',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{ color: '#0A7CFF', fontSize: 11, fontWeight: '600' }}
                >
                  {getSpecialtyLabel(doctor.specialty)}
                </Text>
              </View>
            )}
          </View>

          {!!doctor.averageRating && parseFloat(doctor.averageRating) > 0 && (
            <View style={{ alignItems: 'center', gap: 2 }}>
              <MaterialIcons name="star" size={16} color="#FBBF24" />
              <Text
                style={{ fontSize: 12, fontWeight: '700', color: '#1F2937' }}
              >
                {parseFloat(doctor.averageRating).toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        {(doctor.address || doctor.primaryHospital?.address) && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 6,
              marginTop: 12,
            }}
          >
            <MaterialIcons
              name="location-on"
              size={14}
              color="#6B7280"
              style={{ marginTop: 1 }}
            />
            <Text
              style={{
                flex: 1,
                fontSize: 12,
                color: '#6B7280',
                lineHeight: 18,
              }}
              numberOfLines={2}
            >
              {doctor.address || doctor.primaryHospital?.address}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

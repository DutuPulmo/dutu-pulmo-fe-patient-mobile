import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useMyPatient, useUpdateMyUser } from '@/hooks/useProfile';
import { useAuthStore } from '@/store/auth.store';
import type { components } from '@/types/generated/patient-api';

type UpdateUserDto = components['schemas']['UpdateUserDto'];

type GenderValue = NonNullable<UpdateUserDto['gender']>;

export function EditProfileScreen() {
  const router = useRouter();
  const authUser = useAuthStore((state) => state.user);
  const myPatientQuery = useMyPatient();
  const updateMyUser = useUpdateMyUser();

  const patientUser = myPatientQuery.data?.user;
  const initialData = useMemo(
    () => ({
      fullName: patientUser?.fullName ?? authUser?.fullName ?? '',
      phone: patientUser?.phone ?? '',
      dateOfBirth: patientUser?.dateOfBirth ?? '',
      gender: (patientUser?.gender as GenderValue | undefined) ?? undefined,
      address: patientUser?.address ?? '',
      province: patientUser?.province ?? '',
      ward: patientUser?.ward ?? '',
    }),
    [authUser?.fullName, patientUser],
  );

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<GenderValue | undefined>(undefined);
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('');
  const [ward, setWard] = useState('');

  useEffect(() => {
    setFullName(initialData.fullName);
    setPhone(initialData.phone);
    setDateOfBirth(initialData.dateOfBirth);
    setGender(initialData.gender);
    setAddress(initialData.address);
    setProvince(initialData.province);
    setWard(initialData.ward);
  }, [initialData]);

  const canSubmit = fullName.trim().length > 0 && !updateMyUser.isPending;

  const onSave = () => {
    const payload: UpdateUserDto = {
      fullName: fullName.trim(),
      phone: phone.trim() || undefined,
      dateOfBirth: dateOfBirth.trim() || undefined,
      gender,
      address: address.trim() || undefined,
      province: province.trim() || undefined,
      ward: ward.trim() || undefined,
    };

    updateMyUser.mutate(payload, {
      onSuccess: () => router.back(),
    });
  };

  if (myPatientQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator color="#0A7CFF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <View className="flex-row items-center gap-3 bg-blue-500 px-4 pb-4 pt-12">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="rounded-full p-1"
        >
          <MaterialIcons name="arrow-back-ios-new" size={22} color="white" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-white">Cập nhật hồ sơ</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
          <View className="rounded-2xl bg-white p-4">
            <Text className="mb-2 text-xs font-semibold text-slate-500">Họ và tên</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nhập họ và tên"
              className="mb-4 rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900"
            />

            <Text className="mb-2 text-xs font-semibold text-slate-500">Số điện thoại</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="Nhập số điện thoại"
              className="mb-4 rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900"
            />

            <Text className="mb-2 text-xs font-semibold text-slate-500">Ngày sinh (YYYY-MM-DD)</Text>
            <TextInput
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="1990-01-15"
              className="mb-4 rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900"
            />

            <Text className="mb-2 text-xs font-semibold text-slate-500">Giới tính</Text>
            <View className="mb-4 flex-row gap-2">
              {([
                { key: 'MALE', label: 'Nam' },
                { key: 'FEMALE', label: 'Nữ' },
                { key: 'OTHER', label: 'Khác' },
              ] as const).map((item) => {
                const selected = gender === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => setGender(item.key)}
                    className={`rounded-xl px-3 py-2 ${selected ? 'bg-blue-500' : 'bg-slate-100'}`}
                  >
                    <Text className={selected ? 'text-white' : 'text-slate-700'}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text className="mb-2 text-xs font-semibold text-slate-500">Địa chỉ chi tiết</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Nhập địa chỉ"
              className="mb-4 rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900"
            />

            <Text className="mb-2 text-xs font-semibold text-slate-500">Tỉnh/Thành</Text>
            <TextInput
              value={province}
              onChangeText={setProvince}
              placeholder="Nhập tỉnh/thành"
              className="mb-4 rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900"
            />

            <Text className="mb-2 text-xs font-semibold text-slate-500">Phường/Xã</Text>
            <TextInput
              value={ward}
              onChangeText={setWard}
              placeholder="Nhập phường/xã"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900"
            />
          </View>
        </ScrollView>

        <View className="border-t border-slate-200 bg-white p-4">
          <TouchableOpacity
            onPress={onSave}
            disabled={!canSubmit}
            className={`items-center rounded-xl py-3 ${canSubmit ? 'bg-blue-500' : 'bg-blue-300'}`}
          >
            <Text className="font-semibold text-white">
              {updateMyUser.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default EditProfileScreen;

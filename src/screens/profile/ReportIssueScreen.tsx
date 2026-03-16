import { MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';

import { useCreateReport } from '@/hooks/useReports';

const REPORT_TYPES = [
  {
    value: 'doctor',
    label: 'Báo cáo bác sĩ',
    icon: 'person-off',
    color: '#dc2626',
    bgColor: '#FEF2F2',
  },
  {
    value: 'appointment',
    label: 'Báo cáo lịch khám',
    icon: 'event-busy',
    color: '#d97706',
    bgColor: '#FFFBEB',
  },
  {
    value: 'system',
    label: 'Báo cáo hệ thống',
    icon: 'bug-report',
    color: '#7c3aed',
    bgColor: '#F5F3FF',
  },
] as const;

type ReportTypeValue = 'doctor' | 'appointment' | 'system';

const schema = z.object({
  reportType: z.enum(['doctor', 'appointment', 'system']),
  doctorId: z.string().optional(),
  appointmentId: z.string().optional(),
  content: z.string().min(10, 'Nội dung phải có ít nhất 10 ký tự'),
});

type FormData = z.infer<typeof schema>;

// ══════════════════════════════════════════════════════════════════════════════
export function ReportIssueScreen() {
  const router = useRouter();
  const createMutation = useCreateReport();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      reportType: 'system',
      doctorId: '',
      appointmentId: '',
      content: '',
    },
  });

  const selectedType = watch('reportType');

  const onSubmit = (values: FormData) => {
    createMutation.mutate(
      {
        reportType: values.reportType,
        doctorId: values.doctorId?.trim() || undefined,
        appointmentId: values.appointmentId?.trim() || undefined,
        content: values.content,
      },
      {
        onSuccess: () => {
          Alert.alert('Thành công', 'Báo cáo của bạn đã được gửi. Chúng tôi sẽ xem xét sớm nhất.', [
            { text: 'OK', onPress: () => router.replace('/reports') },
          ]);
        },
        onError: () => {
          Alert.alert('Lỗi', 'Không thể gửi báo cáo. Vui lòng thử lại.');
        },
      },
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* HEADER */}
      <View className="flex-row items-center justify-between bg-blue-500 px-4 pb-4 pt-12">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="rounded-full p-1"
        >
          <MaterialIcons name="arrow-back-ios-new" size={22} color="white" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-white">Gửi báo cáo</Text>
        <View className="w-8" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          padding: 16,
          paddingBottom: Platform.OS === 'ios' ? 120 : 100,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        {/* ── INFO BOX ── */}
        <View className="mb-5 flex-row items-start gap-3 rounded-[14px] border border-blue-200 bg-blue-50 px-4 py-3">
          <MaterialIcons name="info" size={18} color="#0A7CFF" style={{ marginTop: 1 }} />
          <Text className="flex-1 text-[13px] leading-[18px] text-slate-600">
            Báo cáo của bạn sẽ được xem xét trong vòng 1-3 ngày làm việc. Vui lòng cung cấp thông tin chi tiết để chúng tôi hỗ trợ tốt nhất.
          </Text>
        </View>

        {/* ── LOẠI BÁO CÁO ── */}
        <View className="mb-5">
          <Text className="mb-3 text-[15px] font-bold text-slate-900">
            Loại báo cáo
          </Text>
          <View className="gap-2.5">
            {REPORT_TYPES.map((type) => {
              const isSelected = selectedType === type.value;
              return (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => setValue('reportType', type.value as ReportTypeValue)}
                  activeOpacity={0.7}
                  className={`flex-row items-center gap-3 rounded-2xl border px-4 py-[14px] ${
                    isSelected
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-slate-100 bg-white'
                  }`}
                  style={
                    isSelected
                      ? {
                          shadowColor: '#0A7CFF',
                          shadowOpacity: 0.12,
                          shadowRadius: 8,
                          elevation: 2,
                        }
                      : {
                          shadowColor: '#000',
                          shadowOpacity: 0.04,
                          shadowRadius: 4,
                          elevation: 1,
                        }
                  }
                >
                  <View
                    className="h-10 w-10 items-center justify-center rounded-[10px]"
                    style={{ backgroundColor: type.bgColor }}
                  >
                    <MaterialIcons
                      name={type.icon as any}
                      size={20}
                      color={type.color}
                    />
                  </View>
                  <Text
                    className={`flex-1 text-[14px] font-semibold ${
                      isSelected ? 'text-blue-700' : 'text-slate-700'
                    }`}
                  >
                    {type.label}
                  </Text>
                  <View
                    className={`h-5 w-5 items-center justify-center rounded-full border-2 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <MaterialIcons name="check" size={12} color="white" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── ID BÁC SĨ (nếu chọn loại doctor) ── */}
        {selectedType === 'doctor' && (
          <View className="mb-5">
            <Text className="mb-2 text-[15px] font-bold text-slate-900">
              Mã bác sĩ{' '}
              <Text className="text-[13px] font-normal text-slate-400">
                (không bắt buộc)
              </Text>
            </Text>
            <Controller
              control={control}
              name="doctorId"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Nhập mã bác sĩ (UUID)..."
                  placeholderTextColor="#94a3b8"
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900"
                />
              )}
            />
          </View>
        )}

        {/* ── ID LỊCH KHÁM (nếu chọn loại appointment) ── */}
        {selectedType === 'appointment' && (
          <View className="mb-5">
            <Text className="mb-2 text-[15px] font-bold text-slate-900">
              Mã lịch khám{' '}
              <Text className="text-[13px] font-normal text-slate-400">
                (không bắt buộc)
              </Text>
            </Text>
            <Controller
              control={control}
              name="appointmentId"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Nhập mã lịch khám (UUID)..."
                  placeholderTextColor="#94a3b8"
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900"
                />
              )}
            />
          </View>
        )}

        {/* ── NỘI DUNG BÁO CÁO ── */}
        <View className="mb-5">
          <Text className="mb-2 text-[15px] font-bold text-slate-900">
            Nội dung báo cáo
          </Text>
          <Controller
            control={control}
            name="content"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={6}
                className="min-h-[140px] rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900"
                style={{ textAlignVertical: 'top' }}
              />
            )}
          />
          {errors.content && (
            <Text className="mt-1.5 text-[12px] text-red-500">
              {errors.content.message}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* FIXED BOTTOM */}
      <View
        className={`absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white px-4 pt-3 ${
          Platform.OS === 'ios' ? 'pb-9' : 'pb-4'
        }`}
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: -4 },
          shadowRadius: 8,
          elevation: 16,
        }}
      >
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={createMutation.isPending}
          activeOpacity={0.85}
          className={`flex-row items-center justify-center gap-2 rounded-[14px] py-4 ${
            createMutation.isPending ? 'bg-blue-300' : 'bg-blue-500'
          }`}
          style={{
            shadowColor: '#0A7CFF',
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <MaterialIcons name="send" size={18} color="white" />
          <Text className="text-[15px] font-bold text-white">
            {createMutation.isPending ? 'Đang gửi...' : 'Gửi báo cáo'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ReportIssueScreen;
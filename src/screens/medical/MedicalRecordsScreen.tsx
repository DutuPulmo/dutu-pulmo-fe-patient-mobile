import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { patientService } from '@/services/patient.service';
import { useQuery } from '@tanstack/react-query';

// ─── Status config (đồng bộ với appointment screens) ──────────────────────────
const RECORD_STATUS_CONFIG: Record<
  string,
  { label: string; icon: string; color: string; bgClass: string; borderClass: string; textClass: string }
> = {
  DRAFT: {
    label: 'Đang xử lý',
    icon: 'edit-note',
    color: '#d97706',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-700',
  },
  IN_PROGRESS: {
    label: 'Đang khám',
    icon: 'medical-services',
    color: '#0A7CFF',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
    textClass: 'text-blue-600',
  },
  COMPLETED: {
    label: 'Đã hoàn thành',
    icon: 'done-all',
    color: '#16a34a',
    bgClass: 'bg-green-50',
    borderClass: 'border-green-200',
    textClass: 'text-green-700',
  },
};

const FALLBACK_STATUS = RECORD_STATUS_CONFIG['DRAFT'];

// ─── Record card ──────────────────────────────────────────────────────────────
function MedicalRecordCard({
  record,
  onPress,
}: {
  record: any;
  onPress: () => void;
}) {
  const statusConfig = RECORD_STATUS_CONFIG[record.status] ?? FALLBACK_STATUS;
  const scheduledAt = record.appointment?.scheduledAt
    ? new Date(record.appointment.scheduledAt)
    : new Date(record.createdAt);
  const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="overflow-hidden rounded-2xl bg-white"
      style={{
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      {/* Card header: status badge + date chip */}
      <View className="flex-row items-center justify-between border-b border-slate-50 px-4 pb-3 pt-4">
        <View
          className={`flex-row items-center gap-1.5 ${statusConfig.bgClass} border ${statusConfig.borderClass} rounded-lg px-3 py-1.5`}
        >
          <MaterialIcons name={statusConfig.icon as any} size={14} color={statusConfig.color} />
          <Text className={`text-xs font-semibold ${statusConfig.textClass}`}>
            {statusConfig.label}
          </Text>
        </View>

        <View className="rounded-lg bg-slate-50 px-3 py-1.5">
          <Text className="text-xs font-semibold text-slate-500">
            {`${weekdays[scheduledAt.getDay()]}, ${scheduledAt.toLocaleDateString('vi-VN')}`}
          </Text>
        </View>
      </View>

      {/* Doctor info */}
      <View className="flex-row items-center gap-3 px-4 py-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          <MaterialIcons name="person" size={20} color="#60a5fa" />
        </View>

        <View className="flex-1">
          <Text className="text-[15px] font-bold uppercase text-slate-900" numberOfLines={1}>
            {record.doctor?.fullName ?? 'Bác sĩ'}
          </Text>
          <Text className="mt-0.5 text-xs text-slate-500" numberOfLines={1}>
            {record.appointment?.scheduledAt
              ? new Date(record.appointment.scheduledAt).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '—'}
          </Text>
        </View>

        <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
      </View>

      {/* Footer: record number */}
      <View className="flex-row items-center px-4 pb-3">
        <Text className="text-[11px] text-slate-400">
          Mã hồ sơ:{' '}
          <Text className="font-semibold text-slate-500">{record.recordNumber ?? '—'}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
export function MedicalRecordsScreen() {
  const router = useRouter();

  const meQuery = useQuery({
    queryKey: ['profile', 'my-patient'],
    queryFn: () => patientService.getMyPatient(),
  });

  const recordsQuery = useQuery({
    queryKey: ['medical-records', meQuery.data?.id],
    queryFn: () => patientService.getPatientMedicalRecords(meQuery.data!.id),
    enabled: Boolean(meQuery.data?.id),
  });

  if (meQuery.isLoading || recordsQuery.isLoading) {
    return <Loading label="Đang tải hồ sơ y tế..." />;
  }

  if (meQuery.isError || recordsQuery.isError) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-6">
        <EmptyState title="Không thể tải hồ sơ" description="Vui lòng thử lại sau." />
      </View>
    );
  }

  const records = recordsQuery.data ?? [];

  return (
    <View className="flex-1 bg-slate-50">
      {/* HEADER */}
      <View className="flex-row items-center justify-between bg-blue-500 px-4 pb-4 pt-12">
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="rounded-full p-1">
          <MaterialIcons name="arrow-back-ios-new" size={22} color="white" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-white">Hồ sơ y tế</Text>
        <View className="w-8" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Summary row */}
        {records.length > 0 && (
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-sm text-slate-500">
              Tổng cộng{' '}
              <Text className="font-bold text-slate-900">{records.length}</Text>{' '}
              hồ sơ
            </Text>
          </View>
        )}

        {/* List */}
        <View className="gap-3">
          {records.length === 0 ? (
            <View className="mt-16 items-center">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                <MaterialIcons name="folder-open" size={36} color="#93c5fd" />
              </View>
              <Text className="text-base font-bold text-slate-700">Chưa có hồ sơ y tế</Text>
              <Text className="mt-1 text-center text-sm text-slate-400">
                Hồ sơ sẽ xuất hiện sau khi hoàn thành buổi khám
              </Text>
            </View>
          ) : (
            records.map((record: any) => (
              <MedicalRecordCard
                key={record.id}
                record={record}
                onPress={() => router.push(`/medical-records/${record.id}`)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

export default MedicalRecordsScreen;

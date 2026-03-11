import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ScrollView, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { medicalService } from '@/services/medical.service';

export function MedicalRecordDetailScreen() {
  const { recordId } = useLocalSearchParams<{ recordId: string }>();

  const detailQuery = useQuery({
    queryKey: ['medical-record', 'detail', recordId],
    queryFn: () => medicalService.getMedicalRecordDetail(recordId),
    enabled: Boolean(recordId),
  });

  if (detailQuery.isLoading) return <Loading label="Loading record details..." />;

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-6">
        <EmptyState title="Record not found" description="Please try again later." />
      </View>
    );
  }

  const record = detailQuery.data;

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <Text className="text-2xl font-bold text-slate-900">Chi tiết hồ sơ y tế</Text>

      <Card className="mt-4">
        <Text className="text-sm text-slate-500">Mã hồ sơ</Text>
        <Text className="text-base font-bold text-slate-900">{record.recordNumber || 'N/A'}</Text>

        <Text className="mt-3 text-sm font-semibold text-slate-700">Bệnh nhân</Text>
        <Text className="mt-1 text-sm text-slate-600">{record.patient.fullName}</Text>

        <Text className="mt-3 text-sm font-semibold text-slate-700">Bác sĩ</Text>
        <Text className="mt-1 text-sm text-slate-600">{record.doctor.fullName}</Text>

        <Text className="mt-3 text-sm font-semibold text-slate-700">Lịch khám</Text>
        <Text className="mt-1 text-sm text-slate-600">{record.appointment.appointmentNumber}</Text>
        <Text className="mt-1 text-xs text-slate-500">{new Date(record.appointment.scheduledAt).toLocaleString()}</Text>
      </Card>

      <Card className="mt-4">
        <Text className="text-base font-bold text-slate-900">Bệnh án</Text>
        <Text className="mt-3 text-sm font-semibold text-slate-700">Lý do khám</Text>
        <Text className="mt-1 text-sm text-slate-600">{record.chiefComplaint || 'Chưa cập nhật'}</Text>

        <Text className="mt-3 text-sm font-semibold text-slate-700">Chẩn đoán</Text>
        <Text className="mt-1 text-sm text-slate-600">{record.diagnosis || record.primaryDiagnosis || 'Chưa cập nhật'}</Text>

        <Text className="mt-3 text-sm font-semibold text-slate-700">Kế hoạch điều trị</Text>
        <Text className="mt-1 text-sm text-slate-600">{record.treatmentPlan || 'Chưa cập nhật'}</Text>
      </Card>

      <Card className="mt-4">
        <Text className="text-base font-bold text-slate-900">Chỉ số sinh hiệu</Text>
        <Text className="mt-2 text-sm text-slate-600">Nhiệt độ: {record.vitalSigns.temperature ?? '-'}</Text>
        <Text className="mt-1 text-sm text-slate-600">Mạch: {record.vitalSigns.heartRate ?? '-'}</Text>
        <Text className="mt-1 text-sm text-slate-600">Huyết áp: {record.vitalSigns.bloodPressure ?? '-'}</Text>
        <Text className="mt-1 text-sm text-slate-600">SpO2: {record.vitalSigns.spo2 ?? '-'}</Text>
      </Card>

      <Card className="mt-4">
        <Text className="text-base font-bold text-slate-900">Đơn thuốc</Text>
        {record.prescriptions.length === 0 ? (
          <Text className="mt-2 text-sm text-slate-500">Chưa có đơn thuốc.</Text>
        ) : (
          <View className="mt-3 gap-2">
            {record.prescriptions.map((prescription) => (
              <View key={prescription.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <Text className="text-sm font-semibold text-slate-900">{prescription.prescriptionNumber}</Text>
                <Text className="mt-1 text-xs text-slate-600">Số thuốc: {prescription.items.length}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>
    </ScrollView>
  );
}

export default MedicalRecordDetailScreen;

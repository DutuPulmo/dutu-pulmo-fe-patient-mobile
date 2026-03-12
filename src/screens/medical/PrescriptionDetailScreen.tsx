import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ScrollView, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { medicalService } from '@/services/medical.service';

export function PrescriptionDetailScreen() {
  const { prescriptionId } = useLocalSearchParams<{ prescriptionId: string }>();

  const detailQuery = useQuery({
    queryKey: ['prescription', 'detail', prescriptionId],
    queryFn: () => medicalService.getPrescriptionDetail(prescriptionId),
    enabled: Boolean(prescriptionId),
  });

  if (detailQuery.isLoading) return <Loading label="Loading prescription details..." />;

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light px-6">
        <EmptyState title="Prescription not found" description="Please try again later." />
      </View>
    );
  }

  const prescription = detailQuery.data;

  return (
    <ScrollView className="flex-1 bg-background-light" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <Text className="text-2xl font-bold text-slate-900">Prescription details</Text>

      <Card className="mt-4">
        <Text className="text-sm text-slate-500">Prescription code</Text>
        <Text className="text-base font-bold text-slate-900">{prescription.prescriptionNumber}</Text>

        <Text className="mt-3 text-sm font-semibold text-slate-700">Diagnosis</Text>
        <Text className="mt-1 text-sm text-slate-600">{prescription.diagnosis || 'Not updated yet'}</Text>

        <Text className="mt-3 text-sm font-semibold text-slate-700">Medication list</Text>
        <View className="mt-2 gap-2">
          {prescription.items.map((item) => (
            <View key={item.id} className="rounded-lg border border-slate-200 bg-background-light p-3">
              <Text className="text-sm font-semibold text-slate-900">{item.medicineName || 'Medicine'}</Text>
              <Text className="mt-1 text-xs text-slate-600">
                {item.dosage} - {item.frequency} - {item.duration}
              </Text>
            </View>
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}

export default PrescriptionDetailScreen;

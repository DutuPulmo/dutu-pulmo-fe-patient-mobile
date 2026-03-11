import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { patientService } from '@/services/patient.service';

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
    return <Loading label="Loading medical records..." />;
  }

  if (meQuery.isError || recordsQuery.isError) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-6">
        <EmptyState title="Unable to load records" description="Please try again later." />
      </View>
    );
  }

  const records = recordsQuery.data ?? [];

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <Text className="text-2xl font-bold text-slate-900">Medical records</Text>

      <View className="mt-4 gap-3">
        {records.length === 0 ? (
          <EmptyState title="No medical records yet" description="Records will appear after your consultations are completed." />
        ) : (
          records.map((record) => (
            <Card key={record.id}>
              <Text className="text-sm text-slate-500">Record code</Text>
              <Text className="text-base font-bold text-slate-900">{record.recordNumber}</Text>
              <Text className="mt-2 text-sm text-slate-600">{record.diagnosis || 'No diagnosis yet'}</Text>
              <Text className="mt-1 text-xs text-slate-500">{new Date(record.createdAt).toLocaleString()}</Text>

              <View className="mt-3">
                <Button
                  title="View details"
                  onPress={() => router.push(`/medical-records/${record.id}`)}
                />
              </View>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
}

export default MedicalRecordsScreen;
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { patientService } from '@/services/patient.service';

export function PrescriptionsScreen() {
  const router = useRouter();

  const meQuery = useQuery({
    queryKey: ['profile', 'my-patient'],
    queryFn: () => patientService.getMyPatient(),
  });

  const prescriptionsQuery = useQuery({
    queryKey: ['prescriptions', meQuery.data?.id],
    queryFn: () => patientService.getPatientPrescriptions(meQuery.data!.id),
    enabled: Boolean(meQuery.data?.id),
  });

  if (meQuery.isLoading || prescriptionsQuery.isLoading) {
    return <Loading label="Loading prescriptions..." />;
  }

  if (meQuery.isError || prescriptionsQuery.isError) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-6">
        <EmptyState title="Unable to load prescriptions" description="Please try again later." />
      </View>
    );
  }

  const prescriptions = prescriptionsQuery.data ?? [];

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <Text className="text-2xl font-bold text-slate-900">Prescriptions</Text>

      <View className="mt-4 gap-3">
        {prescriptions.length === 0 ? (
          <EmptyState title="No prescriptions yet" description="Prescriptions will appear after the doctor issues them." />
        ) : (
          prescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <Text className="text-sm text-slate-500">Prescription code</Text>
              <Text className="text-base font-bold text-slate-900">{prescription.prescriptionNumber}</Text>
              <Text className="mt-2 text-sm text-slate-600">{prescription.diagnosis || 'No diagnosis yet'}</Text>
              <Text className="mt-1 text-xs text-slate-500">{new Date(prescription.createdAt).toLocaleString()}</Text>

              <View className="mt-3">
                <Button
                  title="View details"
                  onPress={() => router.push(`/prescriptions/${prescription.id}`)}
                />
              </View>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
}

export default PrescriptionsScreen;
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, Text, View } from 'react-native';
import { z } from 'zod';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useCreateReport } from '@/hooks/useReports';

const schema = z.object({
  reportType: z.enum(['doctor', 'appointment', 'system']),
  doctorId: z.string().optional(),
  appointmentId: z.string().optional(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

export function ReportIssueScreen() {
  const router = useRouter();
  const createMutation = useCreateReport();

  const {
    control,
    handleSubmit,
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

  const onSubmit = (values: FormData) => {
    createMutation.mutate(
      {
        reportType: values.reportType,
        doctorId: values.doctorId || undefined,
        appointmentId: values.appointmentId || undefined,
        content: values.content,
      },
      {
        onSuccess: () => router.replace('/reports'),
      },
    );
  };

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <Text className="text-2xl font-bold text-slate-900">Submit a report</Text>

      <Card className="mt-4">
        <Controller
          control={control}
          name="reportType"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Report type"
              placeholder="doctor | appointment | system"
              value={value}
              onChangeText={(text) => onChange((text || 'system') as FormData['reportType'])}
              error={errors.reportType?.message}
            />
          )}
        />

        <View className="mt-3">
          <Controller
            control={control}
            name="doctorId"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Doctor ID (optional)"
                placeholder="UUID"
                value={value}
                onChangeText={onChange}
                error={errors.doctorId?.message}
              />
            )}
          />
        </View>

        <View className="mt-3">
          <Controller
            control={control}
            name="appointmentId"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Appointment ID (optional)"
                placeholder="UUID"
                value={value}
                onChangeText={onChange}
                error={errors.appointmentId?.message}
              />
            )}
          />
        </View>

        <View className="mt-3">
          <Controller
            control={control}
            name="content"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Report content"
                placeholder="Describe the issue in detail"
                value={value}
                onChangeText={onChange}
                error={errors.content?.message}
              />
            )}
          />
        </View>
      </Card>

      <View className="mt-4">
        <Button title="Submit report" loading={createMutation.isPending} onPress={handleSubmit(onSubmit)} />
      </View>

      {createMutation.isError ? <Text className="mt-3 text-sm text-red-500">Unable to submit report. Please verify your data.</Text> : null}
    </ScrollView>
  );
}

export default ReportIssueScreen;
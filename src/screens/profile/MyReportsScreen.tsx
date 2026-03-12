import { ScrollView, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { useReports } from '@/hooks/useReports';

export function MyReportsScreen() {
  const reportsQuery = useReports();

  if (reportsQuery.isLoading) return <Loading label="Loading reports..." />;

  if (reportsQuery.isError) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light px-6">
        <EmptyState title="Unable to load reports" description="Please try again later." />
      </View>
    );
  }

  const reports = reportsQuery.data ?? [];

  return (
    <ScrollView className="flex-1 bg-background-light" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <Text className="text-2xl font-bold text-slate-900">My reports</Text>

      <View className="mt-4 gap-3">
        {reports.length === 0 ? (
          <EmptyState title="No reports yet" description="You have not submitted any reports." />
        ) : (
          reports.map((report) => (
            <Card key={report.id}>
              <Text className="text-sm text-slate-500">Type: {report.reportType}</Text>
              <Text className="mt-1 text-base font-semibold text-slate-900">{report.content}</Text>
              <Text className="mt-2 text-xs text-blue-600">Status: {report.status}</Text>
              <Text className="mt-1 text-xs text-slate-400">{new Date(report.createdAt).toLocaleString()}</Text>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
}

export default MyReportsScreen;

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { reportService } from '@/services/report.service';
import type { CreateReportDto } from '@/types/report.types';

const reportKeys = {
  myReports: ['reports', 'my-reports'] as const,
  detail: (reportId: string) => ['reports', 'detail', reportId] as const,
};

export function useReports() {
  return useQuery({
    queryKey: reportKeys.myReports,
    queryFn: () => reportService.getMyReports(),
  });
}

export function useReportDetail(reportId: string) {
  return useQuery({
    queryKey: reportKeys.detail(reportId),
    queryFn: () => reportService.getReportById(reportId),
    enabled: Boolean(reportId),
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReportDto) => reportService.createReport(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reportKeys.myReports });
    },
  });
}

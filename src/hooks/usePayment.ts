import { useMutation, useQuery } from '@tanstack/react-query';
import { paymentService } from '@/services/payment.service';

export function useCreatePayment() {
  return useMutation({
    mutationFn: (appointmentId: string) =>
      paymentService.createPayment(appointmentId),
  });
}

export function usePaymentStatus(appointmentId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['payment', appointmentId],
    queryFn: () => paymentService.getPaymentByAppointment(appointmentId),
    enabled: enabled && !!appointmentId,
    refetchInterval: (query) =>
      query.state.data?.status === 'PENDING' ? 5000 : false,
  });
}

export function useCancelPayment() {
  return useMutation({
    mutationFn: ({ appointmentId, reason }: { appointmentId: string; reason?: string }) =>
      paymentService.cancelPayment(appointmentId, reason),
  });
}

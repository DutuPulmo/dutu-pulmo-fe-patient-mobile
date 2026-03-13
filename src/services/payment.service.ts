import { api } from '@/services/api';

export interface PaymentResponseDto {
  id: string;
  orderCode: string;
  amount: string;
  description: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED' | 'FAILED';
  checkoutUrl: string;
  qrCode: string;
  accountNumber?: string;
  accountName?: string;
  bin?: string;
  appointmentId: string;
  paidAt?: string;
  expiredAt?: string;
}

export const paymentService = {
  createPayment: (appointmentId: string): Promise<PaymentResponseDto> =>
    api.post('/payment/create', { appointmentId }).then((r) => r.data?.data ?? r.data),

  getPaymentByAppointment: (appointmentId: string): Promise<PaymentResponseDto> =>
    api.get(`/payment/appointment/${appointmentId}`).then((r) => r.data?.data ?? r.data),

  cancelPayment: (appointmentId: string, reason?: string): Promise<PaymentResponseDto> =>
    api
      .post(`/payment/cancel/appointment/${appointmentId}`, { reason })
      .then((r) => r.data?.data ?? r.data),
};

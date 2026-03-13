import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import { Loading } from '@/components/ui/Loading';
import { StepBar } from '@/components/appointment/StepBar';
import { useAppointmentDetail } from '@/hooks/useAppointments';
import { useCreatePayment, usePaymentStatus } from '@/hooks/usePayment';
import QRCode from 'react-native-qrcode-svg';

// ══════════════════════════════════════════════════════════════════════════════
export function PaymentScreen() {
  const router = useRouter();
  const { appointmentId } = useLocalSearchParams<{
    appointmentId: string;
  }>();

  const detailQuery = useAppointmentDetail(appointmentId);
  const appointment = detailQuery.data;

  const createPayment = useCreatePayment();
  const payment = createPayment.data;

  // Poll every 5s while PENDING — stops automatically when status changes
  const statusQuery = usePaymentStatus(appointmentId, !!payment);
  const livePayment = statusQuery.data ?? payment;
  const paymentStatus = livePayment?.status;

  // Amount from API response (authoritative)
  const totalAmount = Number(livePayment?.amount ?? 0);
  const formattedAmount =
    totalAmount === 0 ? '0đ' : `${totalAmount.toLocaleString('vi-VN')}đ`;

  // Trigger payment creation on mount (idempotent guard)
  useEffect(() => {
    if (!appointmentId || createPayment.isPending || createPayment.data) return;
    createPayment.mutate(appointmentId, {
      onError: () => {
        Alert.alert(
          'Không thể tạo thanh toán',
          'Vui lòng thử lại hoặc liên hệ hỗ trợ.',
          [{ text: 'Quay lại', onPress: () => router.back() }],
        );
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  // Navigate to success when paid
  useEffect(() => {
    if (paymentStatus === 'PAID') {
      router.replace(`/appointments/success?appointmentId=${appointmentId}`);
    }
  }, [paymentStatus, appointmentId, router]);

  const handleOpenCheckout = () => {
    const url = livePayment?.checkoutUrl;
    if (url) Linking.openURL(url);
  };

  // ── Loading state ──
  if (detailQuery.isLoading || createPayment.isPending) {
    return <Loading label="Đang tạo thanh toán..." />;
  }

  // Use properties from PayOS to build the QR image URL from VietQR
  const bin = livePayment?.bin;
  const accountNumber = livePayment?.accountNumber;
  const accountName = livePayment?.accountName;
  const description = livePayment?.description;
  const qrCodeData = livePayment?.qrCode;

  const isCancelled =
    paymentStatus === 'CANCELLED' || paymentStatus === 'EXPIRED';

  return (
    <View className="flex-1 bg-slate-50">
      {/* HEADER */}
      <View className="flex-row items-center justify-between bg-blue-500 px-4 pb-4 pt-12">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="rounded-full p-1"
        >
          <MaterialIcons name="arrow-back-ios-new" size={22} color="white" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-white">Thanh toán</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* STEP BAR */}
      <StepBar current={3} step3Label="Thanh toán" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-[120px]"
        showsVerticalScrollIndicator={false}
      >
        {/* ── TỔNG THANH TOÁN ── */}
        <View className="px-4 pt-5">
          <View
            className="items-center rounded-[20px] bg-white p-6"
            style={{
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Text className="text-xs font-semibold tracking-[1.2px] text-slate-400">
              TỔNG THANH TOÁN
            </Text>
            <Text className="mt-2 text-[36px] font-extrabold tracking-tight text-blue-500">
              {formattedAmount}
            </Text>

            {appointment && (
              <View className="mt-[14px] w-full flex-row items-center gap-[10px] rounded-xl bg-slate-50 px-[14px] py-[10px]">
                <MaterialIcons name="event" size={18} color="#0A7CFF" />
                <View className="flex-1">
                  <Text className="text-[13px] font-semibold text-slate-900">
                    {appointment.doctor?.fullName ?? 'Bác sĩ'}
                  </Text>
                  <Text className="mt-0.5 text-xs text-gray-500">
                    {new Date(appointment.scheduledAt).toLocaleDateString(
                      'vi-VN',
                      {
                        weekday: 'short',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      },
                    )}
                  </Text>
                </View>
                <View className="rounded-lg bg-blue-50 px-2 py-1">
                  <Text className="text-[11px] font-semibold text-blue-500">
                    #{appointment.appointmentNumber?.slice(-6)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ── QR CODE ── */}
        {qrCodeData && !isCancelled && (
          <View className="mt-6 px-4">
            <Text className="mb-[10px] text-[11px] font-bold tracking-[1px] text-slate-400">
              QUÉT QR ĐỂ THANH TOÁN
            </Text>
            <View
              className="items-center rounded-2xl bg-white p-6"
              style={{ shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}
            >
              <View className="rounded-xl border border-slate-100 bg-white p-3">
                <QRCode
                  value={livePayment.qrCode}
                  size={200}
                  backgroundColor="white"
                  color="black"
                />
              </View>

              {/* Bank Info */}
              <View className="mt-4 w-full space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-slate-500">Số tài khoản</Text>
                  <Text className="text-sm font-semibold text-slate-800">
                    {accountNumber}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-slate-500">Chủ tài khoản</Text>
                  <Text className="text-sm font-semibold text-slate-800">
                    {accountName}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-slate-500">Số tiền</Text>
                  <Text className="text-sm font-bold text-blue-500">
                    {formattedAmount}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-slate-500">Nội dung</Text>
                  <Text className="ml-4 flex-1 text-right text-sm font-semibold text-slate-800">
                    {description}
                  </Text>
                </View>
              </View>

              {/* Polling indicator */}
              <View className="mt-5 flex-row items-center gap-2">
                <View className="h-2 w-2 rounded-full bg-green-500" />
                <Text className="text-xs text-slate-500">
                  Đang chờ xác nhận thanh toán...
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ── CANCELLED / EXPIRED ── */}
        {isCancelled && (
          <View className="mt-6 px-4">
            <View className="items-center rounded-2xl border border-red-100 bg-red-50 p-6">
              <MaterialIcons name="cancel" size={48} color="#ef4444" />
              <Text className="mt-3 text-base font-bold text-red-600">
                {paymentStatus === 'EXPIRED'
                  ? 'Thanh toán đã hết hạn'
                  : 'Thanh toán đã bị huỷ'}
              </Text>
              <Text className="mt-1 text-center text-sm text-slate-500">
                Vui lòng quay lại và thử lại
              </Text>
            </View>
          </View>
        )}

        {/* ── SECURITY NOTE ── */}
        <View className="mt-5 px-4">
          <View className="flex-row items-start gap-[10px] rounded-[14px] border border-slate-200 bg-slate-50 px-[14px] py-3">
            <MaterialIcons
              name="lock"
              size={18}
              color="#64748b"
              style={{ marginTop: 1 }}
            />
            <Text className="flex-1 text-xs leading-[18px] text-slate-500">
              Dữ liệu thanh toán được mã hóa theo tiêu chuẩn PCI DSS. QR được
              làm mới tự động.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* <View
        className={`absolute bottom-0 left-0 right-0 border-t border-slate-100 bg-white px-4 pt-3 ${
          Platform.OS === 'ios' ? 'pb-9' : 'pb-4'
        }`}
        style={{
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: -4 },
          shadowRadius: 8,
          elevation: 16,
        }}
      >
        <TouchableOpacity
          onPress={handleOpenCheckout}
          disabled={!payment?.checkoutUrl}
          activeOpacity={0.85}
          className="flex-row items-center justify-center gap-2 rounded-[14px] bg-blue-500 py-4"
          style={{
            shadowColor: '#0A7CFF',
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 10,
            elevation: 6,
          }}
        >
          <MaterialIcons name="open-in-browser" size={20} color="white" />
          <Text className="text-base font-bold text-white">
            Mở trang thanh toán
          </Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

export default PaymentScreen;

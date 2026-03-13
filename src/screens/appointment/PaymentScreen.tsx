/**
 * PaymentScreen — Step 3: Thanh toán
 * Flow: BookAppointment → ConfirmAppointment (gọi API) → PaymentScreen → AppointmentSuccessScreen
 *
 * Nhận appointmentId qua route params.
 * Khi nhấn "Thanh toán ngay" → gọi payment API (mock / thực tế) → navigate success.
 * Sử dụng NativeWind CSS (Tailwind cho React Native)
 */

import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Loading } from '@/components/ui/Loading';
import { StepBar } from '@/components/appointment/StepBar';
import { useAppointmentDetail } from '@/hooks/useAppointments';

// ─── Payment method data ───────────────────────────────────────────────────────
type PaymentMethod = {
  id: string;
  label: string;
  description: string;
  icon: string;
  iconBgClass: string;
  iconColorClass: string;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'momo',
    label: 'Ví điện tử MoMo',
    description: 'Miễn phí thanh toán',
    icon: 'M',
    iconBgClass: 'bg-pink-100',
    iconColorClass: 'text-pink-700',
  },
  {
    id: 'zalopay',
    label: 'Ví ZaloPay',
    description: 'Giảm 10% tối đa 20k',
    icon: 'Z',
    iconBgClass: 'bg-sky-100',
    iconColorClass: 'text-sky-600',
  },
  {
    id: 'atm',
    label: 'Thẻ ATM nội địa',
    description: 'Internet Banking',
    icon: '≡',
    iconBgClass: 'bg-green-100',
    iconColorClass: 'text-green-700',
  },
  {
    id: 'card',
    label: 'Thẻ quốc tế',
    description: 'Visa, Mastercard, JCB',
    icon: '◉',
    iconBgClass: 'bg-orange-50',
    iconColorClass: 'text-orange-600',
  },
  {
    id: 'payos',
    label: 'Thanh toán qua PayOS',
    description: 'Chuyển khoản ngân hàng qua mã VietQR',
    icon: '⊞',
    iconBgClass: 'bg-purple-100',
    iconColorClass: 'text-purple-700',
  },
];

// ─── Method item ──────────────────────────────────────────────────────────────
function PaymentMethodItem({
  method,
  selected,
  onSelect,
  isLast,
}: {
  method: PaymentMethod;
  selected: boolean;
  onSelect: () => void;
  isLast: boolean;
}) {
  return (
    <Pressable
      onPress={onSelect}
      className={`flex-row items-center py-[14px] px-4 ${
        selected ? 'bg-blue-50' : 'bg-white'
      } ${isLast ? '' : 'border-b border-slate-50'}`}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      {/* Icon */}
      <View
        className={`w-11 h-11 rounded-xl ${method.iconBgClass} items-center justify-center mr-[14px]`}
      >
        <Text className={`text-xl font-extrabold ${method.iconColorClass}`}>
          {method.icon}
        </Text>
      </View>

      {/* Text */}
      <View className="flex-1">
        <Text className="text-sm font-semibold text-slate-900">{method.label}</Text>
        <Text className="text-xs text-gray-500 mt-0.5">{method.description}</Text>
      </View>

      {/* Radio */}
      <View
        className={`w-[22px] h-[22px] rounded-full border-2 items-center justify-center ${
          selected ? 'border-blue-500' : 'border-gray-300'
        }`}
      >
        {selected && (
          <View className="w-[11px] h-[11px] rounded-full bg-blue-500" />
        )}
      </View>
    </Pressable>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
export function PaymentScreen() {
  const router = useRouter();
  const { appointmentId, amount } = useLocalSearchParams<{
    appointmentId: string;
    amount?: string;
  }>();

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  const detailQuery = useAppointmentDetail(appointmentId);
  const appointment = detailQuery.data;

  const totalAmount = Number(amount ?? 0);
  const formattedAmount = totalAmount === 0
    ? '0đ'
    : `${totalAmount.toLocaleString('vi-VN')}đ`;

  const isCtaDisabled = isPaying || !selectedMethod;

  const handlePay = async () => {
    if (!selectedMethod) {
      Alert.alert('Vui lòng chọn phương thức thanh toán');
      return;
    }
    setIsPaying(true);
    try {
      // TODO: Gọi payment API thực tế ở đây
      await new Promise((resolve) => setTimeout(resolve, 1200));
      router.replace(`/appointments/success?appointmentId=${appointmentId}`);
    } catch {
      Alert.alert('Lỗi thanh toán', 'Không thể xử lý thanh toán. Vui lòng thử lại.');
    } finally {
      setIsPaying(false);
    }
  };

  const handleSkip = () => {
    router.replace(`/appointments/success?appointmentId=${appointmentId}`);
  };

  if (detailQuery.isLoading) {
    return <Loading label="Đang tải thông tin thanh toán..." />;
  }

  return (
    <View className="flex-1 bg-slate-50">

      {/* HEADER */}
      <View className="bg-blue-500 pt-12 pb-4 px-4 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="p-1 rounded-full"
        >
          <MaterialIcons name="arrow-back-ios-new" size={22} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Thanh toán</Text>
        <TouchableOpacity activeOpacity={0.7} className="flex-row items-center gap-1">
          <MaterialIcons name="help-outline" size={18} color="white" />
          <Text className="text-white text-[13px] font-medium">Hỗ trợ</Text>
        </TouchableOpacity>
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
            className="bg-white rounded-[20px] p-6 items-center"
            style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
          >
            <Text className="text-xs font-semibold text-slate-400 tracking-[1.2px]">
              TỔNG THANH TOÁN
            </Text>
            <Text
              className={`text-[36px] font-extrabold mt-2 tracking-tight ${
                totalAmount === 0 ? 'text-slate-900' : 'text-blue-500'
              }`}
            >
              {formattedAmount}
            </Text>

            {/* Appointment summary */}
            {appointment && (
              <View className="mt-[14px] bg-slate-50 rounded-xl px-[14px] py-[10px] w-full flex-row items-center gap-[10px]">
                <MaterialIcons name="event" size={18} color="#0A7CFF" />
                <View className="flex-1">
                  <Text className="text-[13px] font-semibold text-slate-900">
                    {appointment.doctor?.fullName ?? 'Bác sĩ'}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    {new Date(appointment.scheduledAt).toLocaleDateString('vi-VN', {
                      weekday: 'short',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
                <View className="bg-blue-50 px-2 py-1 rounded-lg">
                  <Text className="text-[11px] text-blue-500 font-semibold">
                    #{appointment.appointmentNumber?.slice(-6)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ── PHƯƠNG THỨC THANH TOÁN ── */}
        <View className="px-4 mt-6">
          <Text className="text-[11px] font-bold text-slate-400 tracking-[1px] mb-[10px]">
            CHỌN PHƯƠNG THỨC THANH TOÁN
          </Text>

          <View
            className="bg-white rounded-2xl overflow-hidden"
            style={{ shadowColor: '#000', shadowOpacity: 0.04, elevation: 1 }}
          >
            {PAYMENT_METHODS.map((method, index) => (
              <PaymentMethodItem
                key={method.id}
                method={method}
                selected={selectedMethod === method.id}
                onSelect={() => setSelectedMethod(method.id)}
                isLast={index === PAYMENT_METHODS.length - 1}
              />
            ))}
          </View>
        </View>

        {/* ── SECURITY NOTE ── */}
        <View className="px-4 mt-5">
          <View className="bg-slate-50 rounded-[14px] border border-slate-200 px-[14px] py-3 flex-row items-start gap-[10px]">
            <MaterialIcons name="lock" size={18} color="#64748b" style={{ marginTop: 1 }} />
            <Text className="flex-1 text-xs text-slate-500 leading-[18px]">
              Dữ liệu thanh toán của bạn được mã hóa theo tiêu chuẩn an toàn bảo mật quốc tế (PCI DSS).
            </Text>
          </View>
        </View>

        {/* Bỏ qua nếu tổng = 0đ */}
        {totalAmount === 0 && (
          <View className="px-4 mt-4 items-center">
            <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
              <Text className="text-[13px] text-slate-400 underline">
                Bỏ qua, xem kết quả đặt lịch
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* FIXED CTA */}
      <View
        className={`absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 pt-3 ${
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
          onPress={handlePay}
          disabled={isCtaDisabled}
          activeOpacity={0.85}
          className={`rounded-[14px] py-4 flex-row items-center justify-center gap-2 ${
            isCtaDisabled ? 'bg-blue-300' : 'bg-blue-500'
          }`}
          style={{
            shadowColor: '#0A7CFF',
            shadowOpacity: isCtaDisabled ? 0 : 0.35,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 10,
            elevation: isCtaDisabled ? 0 : 6,
          }}
        >
          {!isPaying && <MaterialIcons name="arrow-forward" size={20} color="white" />}
          <Text className="text-white font-bold text-base">
            {isPaying ? 'Đang xử lý...' : 'Thanh toán ngay →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default PaymentScreen;
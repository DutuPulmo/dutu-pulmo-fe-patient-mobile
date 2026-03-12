/**
 * BookAppointmentScreen
 * – Doctor card: usePublicDoctorDetail
 * – Patient info: useMe() → GET /users/me (fullName, gender, dateOfBirth, phone)
 * – Pre-select slot từ DoctorDetailScreen (param slotId)
 * – Additional info: RichEditor (react-native-pell-rich-editor)
 */

import { MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { z } from 'zod';

import { Loading } from '@/components/ui/Loading';
import {
  useCreateAppointment,
  useDoctorAvailableSlots,
  usePublicDoctorDetail,
} from '@/hooks/useAppointments';
import { useMe } from '@/hooks/useMe';
import { useAuthStore } from '@/store/auth.store';
import { getDoctorTitleLabel, getSpecialtyLabel } from '@/utils/doctor-display';

// ─── Schema ────────────────────────────────────────────────────────────────────
const schema = z.object({
  chiefComplaint: z.string().optional(),
  symptoms: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const today = new Date().toISOString().slice(0, 10);

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatLocalTime(utcStr: string): string {
  const d = new Date(utcStr);
  return d.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatDate(value?: string | null): string {
  if (!value) return '—';
  // Handle 'YYYY-MM-DD' or ISO
  const d = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('vi-VN');
}

function genderLabel(gender?: string | null): string {
  if (!gender) return '—';
  const map: Record<string, string> = {
    MALE: 'Nam', FEMALE: 'Nữ', OTHER: 'Khác',
  };
  return map[gender] ?? gender;
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}>
      <Text style={{ fontSize: 14, color: '#6b7280' }}>{label}</Text>
      <Text style={{ fontSize: 14, fontWeight: '500', color: '#1e293b', flexShrink: 0, marginLeft: 16, textAlign: 'right', maxWidth: '60%' }}>
        {value}
      </Text>
    </View>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: '#f3f4f6' }} />;
}

function TimelineDot({ icon, color = '#0A7CFF' }: { icon: string; color?: string }) {
  return (
    <View style={{ position: 'absolute', left: -33, top: 0, backgroundColor: '#EFF6FF', padding: 4 }}>
      <MaterialIcons name={icon as any} size={20} color={color} />
    </View>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
export function BookAppointmentScreen() {
  const router = useRouter();
  const {
    doctorId,
    date = today,
    slotId: preSelectedSlotId,
  } = useLocalSearchParams<{ doctorId: string; date: string; slotId?: string }>();

  const user = useAuthStore((s) => s.user);

  // ── Queries
  const meQuery        = useMe();                            // GET /users/me
  const doctorQuery    = usePublicDoctorDetail(doctorId ?? '');
  const slotsQuery     = useDoctorAvailableSlots(doctorId, date);
  const createMutation = useCreateAppointment();

  // ── Local state
  const [selectedSlotId, setSelectedSlotId]       = useState<string | null>(preSelectedSlotId ?? null);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [patientNotesHtml, setPatientNotesHtml]     = useState('');
  const richEditorRef = useRef<RichEditor>(null);

  // Đếm ảnh base64 — giới hạn 5 ảnh như backend (giống website)
  const base64ImageCount = (patientNotesHtml.match(/data:image\//gi) ?? []).length;

  // Chiều cao động của RichEditor — tự giãn theo nội dung thay vì scroll nội bộ
  const [editorHeight, setEditorHeight] = useState(140);

  // Xử lý chèn ảnh từ thư viện — cần handle thủ công vì RichToolbar không tự mở picker
  const handleInsertImage = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
      base64: true,         // lấy base64 để nhúng inline vào HTML
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    const mimeType = asset.mimeType ?? 'image/jpeg';
    const b64 = asset.base64;

    if (!b64) return;

    const dataUri = `data:${mimeType};base64,${b64}`;
    richEditorRef.current?.insertImage(dataUri, 'max-width:100%;border-radius:8px;');
  }, []);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { chiefComplaint: '', symptoms: '' },
  });

  // ── Derived
  const me             = meQuery.data;
  const slots          = slotsQuery.data ?? [];
  const selectedSlot   = slots.find((s) => s.id === selectedSlotId) ?? null;
  const selectedLabel  = selectedSlot
    ? `${formatLocalTime(selectedSlot.startTime)} - ${formatLocalTime(selectedSlot.endTime)}`
    : null;

  const doctor         = doctorQuery.data;
  const titleLabel     = doctor ? getDoctorTitleLabel(doctor.title) : '';
  const specialtyLabel = doctor ? getSpecialtyLabel(doctor.specialty ?? '') : '';

  // Patient display — ưu tiên /users/me, fallback authStore
  const displayName    = me?.patient?.user?.fullName ?? user?.fullName ?? '—';
  const displayGender  = genderLabel(me?.patient?.user?.gender);
  const displayDOB     = formatDate(me?.patient?.user?.dateOfBirth);
  const displayPhone   = me?.patient?.user?.phone ?? '—';
  const avatarUrl      = me?.patient?.user?.avatarUrl  ?? user?.avatarUrl;

  const onSubmit = (values: FormData) => {
    if (!selectedSlotId) return;
    createMutation.mutate(
      {
        timeSlotId:     selectedSlotId,
        chiefComplaint: values.chiefComplaint?.trim() || undefined,
        symptoms: values.symptoms
          ? values.symptoms.split(',').map((i) => i.trim()).filter(Boolean)
          : undefined,
        patientNotes: patientNotesHtml || undefined,
      },
      {
        onSuccess: (appointment) => router.replace(`/appointments/${appointment.id}`),
      },
    );
  };

  if (slotsQuery.isLoading || doctorQuery.isLoading) {
    return <Loading label="Đang tải thông tin..." />;
  }

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{ flex: 1, backgroundColor: '#EFF6FF' }}>

        {/* ══ HEADER ══ */}
        <View style={{
          backgroundColor: '#0A7CFF',
          paddingTop: 48, paddingBottom: 16, paddingHorizontal: 16,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ padding: 4, borderRadius: 20 }}>
            <MaterialIcons name="arrow-back-ios-new" size={22} color="white" />
          </TouchableOpacity>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>Đặt lịch khám</Text>
          <TouchableOpacity activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
            <MaterialIcons name="help-outline" size={18} color="white" />
            <Text style={{ color: 'white', fontSize: 13, fontWeight: '500' }}>Hỗ trợ</Text>
          </TouchableOpacity>
        </View>

        {/* ══ STEP INDICATOR ══ */}
        <View style={{
          backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 12,
          borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Step 1 — active */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#0A7CFF', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: 'white', fontSize: 11, fontWeight: '700' }}>1</Text>
            </View>
            <Text style={{ color: '#0A7CFF', fontSize: 12, fontWeight: '600' }}>Chọn lịch khám</Text>
          </View>
          <MaterialIcons name="chevron-right" size={18} color="#d1d5db" />
          {/* Step 2 */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#6b7280', fontSize: 11, fontWeight: '700' }}>2</Text>
            </View>
            <Text style={{ color: '#9ca3af', fontSize: 12 }}>Xác nhận</Text>
          </View>
          <MaterialIcons name="chevron-right" size={18} color="#d1d5db" />
          {/* Step 3 */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#6b7280', fontSize: 11, fontWeight: '700' }}>3</Text>
            </View>
            <Text style={{ color: '#9ca3af', fontSize: 12 }}>Nhận lịch hẹn</Text>
          </View>
        </View>

        {/* ══ SCROLL ══ */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── DOCTOR CARD ── */}
          {doctor && (
            <View style={{
              backgroundColor: 'white', borderRadius: 16, padding: 16,
              shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 3,
              flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 32,
            }}>
              {/* Avatar */}
              <View style={{ position: 'relative' }}>
                <View style={{ width: 64, height: 64, borderRadius: 32, overflow: 'hidden', backgroundColor: '#dbeafe', borderWidth: 2, borderColor: 'white' }}>
                  {doctor.avatarUrl ? (
                    <Image source={{ uri: doctor.avatarUrl }} style={{ width: 64, height: 64 }} resizeMode="cover" />
                  ) : (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                      <MaterialIcons name="person" size={32} color="#60a5fa" />
                    </View>
                  )}
                </View>
                {/* Medical badge */}
                <View style={{ position: 'absolute', bottom: -4, right: -4, backgroundColor: 'white', borderRadius: 12, padding: 3, borderWidth: 1, borderColor: '#f1f5f9' }}>
                  <View style={{ backgroundColor: '#2563eb', width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="medical-services" size={9} color="white" />
                  </View>
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>{titleLabel}</Text>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', marginBottom: 4 }}>
                  {doctor.fullName ?? 'Bác sĩ'}
                </Text>
                <Text style={{ fontSize: 13, color: '#475569' }}>
                  Chuyên khoa: {specialtyLabel}
                </Text>
              </View>
            </View>
          )}

          {/* ══ TIMELINE ══ */}
          <View style={{ marginLeft: 8, paddingLeft: 24, borderLeftWidth: 2, borderLeftColor: '#e5e7eb' }}>

            {/* ── STEP 1 · Bệnh nhân ── */}
            <View style={{ position: 'relative', marginBottom: 32 }}>
              <TimelineDot icon="check" />

              <Text style={{ fontSize: 15, fontWeight: '600', color: '#1e293b', marginBottom: 12 }}>
                Đặt lịch khám này cho:
              </Text>

              <View style={{
                backgroundColor: 'white', borderRadius: 16,
                shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 1 }, shadowRadius: 4, elevation: 1,
                overflow: 'hidden',
              }}>
                {/* Avatar + name banner */}
                <View style={{ padding: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 12, marginBottom: 4, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
                    {avatarUrl ? (
                      <Image source={{ uri: avatarUrl }} style={{ width: 48, height: 48, borderRadius: 24 }} />
                    ) : (
                      <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialIcons name="person" size={24} color="#0A7CFF" />
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: '#0f172a' }}>{displayName}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 }}>
                        <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#22c55e' }} />
                        <Text style={{ fontSize: 11, color: '#16a34a' }}>Hồ sơ đang hoạt động</Text>
                      </View>
                    </View>
                  </View>

                  {/* 4 info rows matching HTML design */}
                  <InfoRow label="Họ và tên"  value={displayName}   />
                  <Divider />
                  <InfoRow label="Giới tính"  value={displayGender} />
                  <Divider />
                  <InfoRow label="Ngày sinh"  value={displayDOB}    />
                  <Divider />
                  <InfoRow label="Điện thoại" value={displayPhone}  />
                </View>

                {/* Footer */}
                <View style={{ backgroundColor: '#f8fafc', paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
                  <Text style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>
                    Thông tin được lấy từ hồ sơ tài khoản của bạn
                  </Text>
                </View>
              </View>
            </View>

            {/* ── STEP 2 · Giờ khám ── */}
            <View style={{ position: 'relative', marginBottom: 32 }}>
              <TimelineDot icon="check" />

              <Text style={{ fontSize: 15, fontWeight: '600', color: '#1e293b', marginBottom: 12 }}>
                Chọn giờ khám
              </Text>

              <Text style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
                Ngày khám:{' '}
                <Text style={{ fontWeight: '600', color: '#334155' }}>
                  {new Date(date).toLocaleDateString('vi-VN', {
                    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
                  })}
                </Text>
              </Text>

              {slots.length === 0 ? (
                <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center' }}>
                  <MaterialIcons name="event-busy" size={36} color="#d1d5db" />
                  <Text style={{ marginTop: 8, fontSize: 13, color: '#9ca3af', textAlign: 'center' }}>
                    Không có khung giờ trống cho ngày này.
                  </Text>
                  <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
                    <Text style={{ fontSize: 13, color: '#0A7CFF', fontWeight: '500' }}>← Chọn ngày khác</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {slots.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    return (
                      <TouchableOpacity
                        key={slot.id}
                        onPress={() => setSelectedSlotId(slot.id)}
                        activeOpacity={0.8}
                        style={{
                          paddingVertical: 10, paddingHorizontal: 14,
                          borderRadius: 12,
                          borderWidth: 1.5,
                          borderColor: isSelected ? '#0A7CFF' : '#e5e7eb',
                          backgroundColor: 'white',
                          shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 1 }, shadowRadius: 2, elevation: 1,
                        }}
                      >
                        <Text style={{ fontSize: 13, fontWeight: isSelected ? '700' : '500', color: isSelected ? '#0A7CFF' : '#475569' }}>
                          {`${formatLocalTime(slot.startTime)} - ${formatLocalTime(slot.endTime)}`}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {!selectedSlotId && slots.length > 0 && (
                <Text style={{ marginTop: 10, fontSize: 12, color: '#d97706' }}>
                  ⚠ Vui lòng chọn một khung giờ để tiếp tục.
                </Text>
              )}
            </View>

            {/* ── STEP 3 · Thông tin bổ sung ── */}
            <View style={{ position: 'relative', paddingBottom: 16 }}>
              <TimelineDot
                icon="radio-button-unchecked"
                color={showAdditionalInfo ? '#0A7CFF' : '#d1d5db'}
              />

              <Text style={{ fontSize: 15, fontWeight: '600', color: '#1e293b', marginBottom: 4 }}>
                Thông tin bổ sung{' '}
                <Text style={{ color: '#9ca3af', fontWeight: '400', fontSize: 13 }}>(không bắt buộc)</Text>
              </Text>
              <Text style={{ fontSize: 13, color: '#6b7280', marginBottom: 16, lineHeight: 20 }}>
                Bạn có thể cung cấp thêm các thông tin như lý do khám, triệu chứng, đơn thuốc sử dụng gần đây.
              </Text>

              {!showAdditionalInfo ? (
                /* Collapsed */
                <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 1 }, shadowRadius: 4, elevation: 1 }}>
                  <TouchableOpacity onPress={() => setShowAdditionalInfo(true)} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={{ color: '#0A7CFF', fontSize: 13, fontWeight: '500' }}>Tôi muốn gửi thêm thông tin</Text>
                    <MaterialIcons name="arrow-forward" size={16} color="#0A7CFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                /* Expanded */
                <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 1 }, shadowRadius: 4, elevation: 1, gap: 20 }}>

                  {/* Lý do khám */}
                  <Controller
                    control={control}
                    name="chiefComplaint"
                    render={({ field: { onChange, value } }) => (
                      <View>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6 }}>Lý do khám</Text>
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          placeholder="Ví dụ: Ho kéo dài, đau ngực..."
                          placeholderTextColor="#9ca3af"
                          style={{
                            borderWidth: 1,
                            borderColor: errors.chiefComplaint ? '#ef4444' : '#e5e7eb',
                            borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11,
                            fontSize: 14, color: '#1e293b', backgroundColor: '#f9fafb',
                          }}
                        />
                        {errors.chiefComplaint && (
                          <Text style={{ color: '#ef4444', fontSize: 11, marginTop: 4 }}>{errors.chiefComplaint.message}</Text>
                        )}
                      </View>
                    )}
                  />

                  {/* Triệu chứng */}
                  <Controller
                    control={control}
                    name="symptoms"
                    render={({ field: { onChange, value } }) => (
                      <View>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 3 }}>Triệu chứng</Text>
                        <Text style={{ fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>
                          Ngăn cách bằng dấu phẩy (VD: Ho, Sốt, Khó thở)
                        </Text>
                        <TextInput
                          value={value}
                          onChangeText={onChange}
                          placeholder="Ho, Sốt, Khó thở..."
                          placeholderTextColor="#9ca3af"
                          style={{
                            borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12,
                            paddingHorizontal: 14, paddingVertical: 11,
                            fontSize: 14, color: '#1e293b', backgroundColor: '#f9fafb',
                          }}
                        />
                      </View>
                    )}
                  />

                  {/* Patient Notes — RichEditor */}
                  <View>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6 }}>
                      Ghi chú thêm cho bác sĩ
                    </Text>

                    {/* Toolbar */}
                    <RichToolbar
                      editor={richEditorRef}
                      actions={[
                        actions.setBold,
                        actions.setItalic,
                        actions.setUnderline,
                        actions.insertBulletsList,
                        actions.insertOrderedList,
                        actions.insertImage,
                        actions.undo,
                        actions.redo,
                      ]}
                      style={{
                        backgroundColor: '#f3f4f6',
                        borderTopLeftRadius: 12, borderTopRightRadius: 12,
                        borderWidth: 1, borderColor: '#e5e7eb', borderBottomWidth: 0,
                        height: 44,
                      }}
                      iconTint="#475569"
                      selectedIconTint="#0A7CFF"
                      onPressAddImage={handleInsertImage}
                    />

                    {/* Editor — scrollEnabled=false + onHeightChange để outer ScrollView
                        xử lý scroll, editor tự giãn chiều cao theo nội dung */}
                    <View style={{
                      borderWidth: 1, borderColor: '#e5e7eb',
                      borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
                      height: editorHeight, overflow: 'hidden', backgroundColor: '#f9fafb',
                    }}>
                      <RichEditor
                        ref={richEditorRef}
                        initialHeight={140}
                        placeholder="Thông tin thêm, đơn thuốc đang sử dụng, tiền sử bệnh..."
                        style={{ backgroundColor: '#f9fafb' }}
                        editorStyle={{
                          backgroundColor: '#f9fafb',
                          color: '#1e293b',
                          placeholderColor: '#9ca3af',
                          contentCSSText:
                            'font-family: -apple-system, sans-serif; font-size: 14px; padding: 10px; line-height: 1.6;',
                        }}
                        scrollEnabled={false}
                        onHeightChange={(h) => setEditorHeight(Math.max(140, h + 20))}
                        onChange={(html: string) => setPatientNotesHtml(html)}
                        useContainer
                      />
                    </View>

                    <Text style={{ fontSize: 11, color: '#9ca3af', marginTop: 5 }}>
                      Hỗ trợ in đậm, in nghiêng, gạch chân, danh sách và chèn ảnh.
                    </Text>

                    {/* Cảnh báo quá 5 ảnh — giống website */}
                    {base64ImageCount > 5 && (
                      <View style={{
                        marginTop: 8,
                        borderRadius: 10, borderWidth: 1,
                        borderColor: '#fcd34d', backgroundColor: '#fffbeb',
                        paddingHorizontal: 12, paddingVertical: 8,
                        flexDirection: 'row', alignItems: 'flex-start', gap: 6,
                      }}>
                        <MaterialIcons name="warning-amber" size={15} color="#d97706" style={{ marginTop: 1 }} />
                        <Text style={{ fontSize: 12, color: '#92400e', flex: 1, lineHeight: 18 }}>
                          Bạn đã chèn {base64ImageCount} ảnh. Backend giới hạn tối đa 5 ảnh mỗi lần đặt lịch.
                        </Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity onPress={() => setShowAdditionalInfo(false)} style={{ alignItems: 'center' }} activeOpacity={0.7}>
                    <Text style={{ color: '#9ca3af', fontSize: 12 }}>Thu gọn ↑</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

          </View>{/* end timeline */}

          {createMutation.isError && (
            <Text style={{ marginTop: 16, fontSize: 13, color: '#ef4444', textAlign: 'center' }}>
              Không thể tạo lịch khám. Vui lòng thử lại.
            </Text>
          )}
        </ScrollView>

        {/* ══ FIXED CTA ══ */}
        <View style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          backgroundColor: 'white',
          borderTopWidth: 1, borderTopColor: '#f1f5f9',
          paddingHorizontal: 16, paddingTop: 12,
          paddingBottom: Platform.OS === 'ios' ? 36 : 16,
          shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: -4 }, shadowRadius: 6, elevation: 12,
        }}>
          {selectedLabel && (
            <Text style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>
              Đã chọn:{' '}
              <Text style={{ fontWeight: '600', color: '#475569' }}>{selectedLabel}</Text>
            </Text>
          )}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={!selectedSlotId || createMutation.isPending}
            activeOpacity={0.85}
            style={{
              backgroundColor: selectedSlotId && !createMutation.isPending ? '#0A7CFF' : '#93c5fd',
              borderRadius: 14, paddingVertical: 16,
              alignItems: 'center', justifyContent: 'center',
              shadowColor: '#0A7CFF',
              shadowOpacity: selectedSlotId ? 0.3 : 0,
              shadowOffset: { width: 0, height: 4 }, shadowRadius: 8,
              elevation: selectedSlotId ? 4 : 0,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
              {createMutation.isPending ? 'Đang xử lý...' : 'Tiếp tục'}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

export default BookAppointmentScreen;
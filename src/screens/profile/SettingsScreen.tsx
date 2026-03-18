import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Linking,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { registerFcmTokenAfterLogin, removeFcmTokenBestEffort } from '@/services/fcm.service';
import { useLogout } from '@/hooks/useLogout';

const PRIVACY_URL = 'https://example.com/privacy';
const HELP_URL = 'https://example.com/help';
const TERMS_URL = 'https://example.com/terms';

const PUSH_PREF_KEY = 'settings.push_enabled';
const EMAIL_PREF_KEY = 'settings.email_enabled';

function SettingRow({
  icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  value,
  isLast,
  onPress,
  rightElement,
}: {
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle?: string;
  value?: string;
  isLast?: boolean;
  onPress?: () => void;
  rightElement?: ReactNode;
}) {
  const content = (
    <>
      <View
        className="h-9 w-9 items-center justify-center rounded-[10px]"
        style={{ backgroundColor: iconBg }}
      >
        <MaterialIcons name={icon as any} size={18} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="text-[14px] font-semibold text-slate-900">{title}</Text>
        {subtitle && (
          <Text className="mt-0.5 text-[12px] text-slate-400">{subtitle}</Text>
        )}
      </View>
      {rightElement ?? (value ? <Text className="text-[13px] text-slate-400">{value}</Text> : null)}
    </>
  );

  const rowClass = `flex-row items-center gap-3 bg-white px-4 py-[14px] ${
    isLast ? '' : 'border-b border-slate-50'
  }`;

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} className={rowClass}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View className={rowClass}>{content}</View>;
}

export function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const logout = useLogout();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [isUpdatingPush, setIsUpdatingPush] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadPreferences = async () => {
      const [pushSaved, emailSaved] = await Promise.all([
        AsyncStorage.getItem(PUSH_PREF_KEY),
        AsyncStorage.getItem(EMAIL_PREF_KEY),
      ]);

      if (!mounted) return;
      setPushEnabled(pushSaved == null ? true : pushSaved === 'true');
      setEmailEnabled(emailSaved == null ? true : emailSaved === 'true');
    };

    void loadPreferences();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    try {
      setIsLoggingOut(true);
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleTogglePush = async () => {
    if (isUpdatingPush) return;

    const nextValue = !pushEnabled;
    setPushEnabled(nextValue);
    setIsUpdatingPush(true);

    try {
      if (nextValue) {
        await registerFcmTokenAfterLogin();
      } else {
        await removeFcmTokenBestEffort();
      }
      await AsyncStorage.setItem(PUSH_PREF_KEY, String(nextValue));
    } catch (error) {
      setPushEnabled(!nextValue);
      console.warn('Failed to update push setting:', error);
    } finally {
      setIsUpdatingPush(false);
    }
  };

  const handleToggleEmail = async () => {
    const nextValue = !emailEnabled;
    setEmailEnabled(nextValue);
    await AsyncStorage.setItem(EMAIL_PREF_KEY, String(nextValue));
  };

  return (
    <View className="flex-1 bg-slate-50">
      <ScreenHeader title="Cài đặt" />

        <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 24),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-5 mx-4">
          <Text className="mb-2 text-[11px] font-bold tracking-[0.8px] text-slate-400 px-1">
            THÔNG TIN ỨNG DỤNG
          </Text>
          <View className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <SettingRow
              icon="smartphone"
              iconColor="#0A7CFF"
              iconBg="#EFF6FF"
              title="Phiên bản"
              value="1.0.0"
            />
            <SettingRow
              icon="language"
              iconColor="#16a34a"
              iconBg="#F0FDF4"
              title="Ngôn ngữ"
              value="Tiếng Việt"
            />
            <SettingRow
              icon="light-mode"
              iconColor="#d97706"
              iconBg="#FFFBEB"
              title="Giao diện"
              value="Sáng"
              isLast
            />
          </View>
        </View>

        <View className="mt-4 mx-4">
          <Text className="mb-2 text-[11px] font-bold tracking-[0.8px] text-slate-400 px-1">
            QUYỀN RIÊNG TƯ & BẢO MẬT
          </Text>
          <View className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <SettingRow
              icon="lock"
              iconColor="#7c3aed"
              iconBg="#F5F3FF"
              title="Bảo mật tài khoản"
              subtitle="Đổi mật khẩu, xác thực 2 bước"
              onPress={() => router.push('/change-password')}
            />
            <SettingRow
              icon="privacy-tip"
              iconColor="#0891b2"
              iconBg="#ECFEFF"
              title="Chính sách quyền riêng tư"
              subtitle="Xem cách chúng tôi bảo vệ dữ liệu"
              onPress={() => void Linking.openURL(PRIVACY_URL)}
              isLast
            />
          </View>
        </View>

        <View className="mt-4 mx-4">
          <Text className="mb-2 text-[11px] font-bold tracking-[0.8px] text-slate-400 px-1">
            THÔNG BÁO
          </Text>
          <View className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <SettingRow
              icon="notifications"
              iconColor="#d97706"
              iconBg="#FFFBEB"
              title="Thông báo đẩy"
              subtitle="Nhận thông báo"
              onPress={handleTogglePush}
              rightElement={(
                <Switch
                  value={pushEnabled}
                  onValueChange={handleTogglePush}
                  disabled={isUpdatingPush}
                />
              )}
            />
            <SettingRow
              icon="mail"
              iconColor="#dc2626"
              iconBg="#FEF2F2"
              title="Thông báo email"
              subtitle="Nhận xác nhận qua email"
              onPress={handleToggleEmail}
              rightElement={(
                <Switch value={emailEnabled} onValueChange={handleToggleEmail} />
              )}
              isLast
            />
          </View>
        </View>

        <View className="mt-4 mx-4">
          <Text className="mb-2 text-[11px] font-bold tracking-[0.8px] text-slate-400 px-1">
            HỖ TRỢ
          </Text>
          <View className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <SettingRow
              icon="help-outline"
              iconColor="#64748b"
              iconBg="#F8FAFC"
              title="Trung tâm trợ giúp"
              subtitle="Câu hỏi thường gặp"
              onPress={() => void Linking.openURL(HELP_URL)}
            />
            <SettingRow
              icon="description"
              iconColor="#64748b"
              iconBg="#F8FAFC"
              title="Điều khoản sử dụng"
              subtitle="Đọc điều khoản dịch vụ"
              onPress={() => void Linking.openURL(TERMS_URL)}
              isLast
            />
          </View>
        </View>

        <View className="mt-4 mx-4">
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.85}
            disabled={isLoggingOut}
            className="flex-row items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-4"
          >
            <MaterialIcons name="logout" size={18} color="#ef4444" />
            <Text className="text-[15px] font-semibold text-red-500">
              {isLoggingOut ? 'Đang xử lý...' : 'Đăng xuất'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6 items-center">
          <Text className="text-[11px] text-slate-300">
            DuTu Pulmo • © 2025 DuTu Health
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default SettingsScreen;


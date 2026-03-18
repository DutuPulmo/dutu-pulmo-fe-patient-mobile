import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export function ChangePasswordScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-slate-50">
      <View className="flex-row items-center gap-3 bg-blue-500 px-4 pb-4 pt-12">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="rounded-full p-1"
        >
          <MaterialIcons name="arrow-back-ios-new" size={22} color="white" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-white">Đổi mật khẩu</Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <View className="items-center rounded-2xl bg-white px-6 py-8 shadow-sm">
          <MaterialIcons name="construction" size={30} color="#0A7CFF" />
          <Text className="mt-3 text-center text-base font-semibold text-slate-900">
            Tính năng đang được phát triển
          </Text>
          <Text className="mt-1 text-center text-sm text-slate-500">
            Màn hình đổi mật khẩu sẽ được cập nhật trong bản tiếp theo.
          </Text>
        </View>
      </View>
    </View>
  );
}

export default ChangePasswordScreen;

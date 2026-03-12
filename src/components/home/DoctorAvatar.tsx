import { useState } from 'react';
import { Image, Text, View } from 'react-native';

interface DoctorAvatarProps {
  avatarUrl?: string;
  name?: string;
}

export function DoctorAvatar({ avatarUrl, name }: DoctorAvatarProps) {
  const [hasError, setHasError] = useState(false);

  const initials = name
    ? name
        .split(' ')
        .slice(-2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('')
    : '?';

  const showImage = Boolean(avatarUrl) && !hasError;

  return (
    <View className="w-24 h-24 rounded-full overflow-hidden mb-2.5 bg-slate-100 self-center">
      {showImage ? (
        <Image
          source={{ uri: avatarUrl }}
          className="w-full h-full"
          resizeMode="cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <View className="flex-1 items-center justify-center bg-blue-100">
          <Text className="text-3xl font-bold text-blue-600">{initials}</Text>
        </View>
      )}
    </View>
  );
}


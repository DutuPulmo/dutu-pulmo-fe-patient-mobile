import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useRouter } from 'expo-router';
import { Alert, FlatList, Image, Pressable, Text, View } from 'react-native';
import { SAMPLE_NEWS } from '@/constants/news-data';

export default function NewsScreen() {
  const router = useRouter();

  const handleNewsPress = (id: string, title: string) => {
    // router.push(`/news/${id}`);
    Alert.alert('Sắp ra mắt', `Tính năng đọc chi tiết bài "${title}" đang được phát triển.`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <Stack.Screen
        options={{
          title: 'Tin tức y khoa',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: 'white' },
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ padding: 8, marginLeft: -8 }}>
              <MaterialIcons name="arrow-back-ios" size={20} color="#1F2937" />
            </Pressable>
          ),
        }}
      />
      <View style={{ flex: 1 }}>
        <FlatList
          data={SAMPLE_NEWS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 16 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleNewsPress(item.id, item.title)}
              style={({ pressed }) => ({
                backgroundColor: 'white',
                borderRadius: 20,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: '#F1F5F9',
                shadowColor: '#000',
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 1,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <View style={{ height: 180, position: 'relative' }}>
                <Image
                  source={{ uri: item.image }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                {item.badge ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      backgroundColor: '#EF4444',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 10, fontWeight: '700' }}>
                      {item.badge}
                    </Text>
                  </View>
                ) : null}
              </View>
              <View style={{ padding: 16 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '700',
                    color: '#1F2937',
                    lineHeight: 22,
                    marginBottom: 12,
                  }}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <MaterialIcons name="calendar-today" size={14} color="#94A3B8" />
                  <Text style={{ fontSize: 12, color: '#94A3B8' }}>{item.date}</Text>
                  <View
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: '#CBD5E1',
                      marginHorizontal: 4,
                    }}
                  />
                  <Text style={{ fontSize: 12, color: '#0A7CFF', fontWeight: '500' }}>Đọc tiếp</Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}

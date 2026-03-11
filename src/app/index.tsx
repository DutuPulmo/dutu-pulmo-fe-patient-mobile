import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';

export default function IndexPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return <Redirect href={accessToken ? '/(tabs)/home' : '/(auth)/login'} />;
}

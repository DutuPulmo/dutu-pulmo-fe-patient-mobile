import { ActivityIndicator, Pressable, PressableProps, Text } from 'react-native';
import { theme } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = PressableProps & {
  title: string;
  loading?: boolean;
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

const variantClassMap: Record<ButtonVariant, string> = {
  primary: 'bg-[#0A7CFF]',
  secondary: 'bg-slate-100',
  ghost: 'bg-transparent',
  danger: 'bg-red-500',
};

const textClassMap: Record<ButtonVariant, string> = {
  primary: 'text-white',
  secondary: 'text-slate-800',
  ghost: 'text-[#0A7CFF]',
  danger: 'text-white',
};

export function Button({ title, loading, variant = 'primary', disabled, fullWidth = true, ...props }: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      className={`h-12 ${fullWidth ? 'w-full' : ''} items-center justify-center rounded-xl ${variantClassMap[variant]} ${isDisabled ? 'opacity-60' : ''}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? '#fff' : theme.colors.textPrimary} />
      ) : (
        <Text className={`text-base font-semibold ${textClassMap[variant]}`}>{title}</Text>
      )}
    </Pressable>
  );
}

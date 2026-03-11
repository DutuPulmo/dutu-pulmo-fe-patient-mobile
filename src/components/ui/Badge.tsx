import { Text } from 'react-native';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

type Props = {
  label: string;
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-rose-100 text-rose-700',
  info: 'bg-blue-100 text-[#0A7CFF]',
  neutral: 'bg-slate-100 text-slate-700',
};

export function Badge({ label, variant = 'neutral' }: Props) {
  return (
    <Text className={`self-start rounded-full px-2.5 py-1 text-xs font-semibold ${variantClasses[variant]}`}>
      {label}
    </Text>
  );
}

export default Badge;

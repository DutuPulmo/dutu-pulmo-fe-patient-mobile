import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

interface AccordionItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({
  icon,
  title,
  children,
  defaultOpen = false,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <View className="border-b border-gray-100">
      <Pressable
        onPress={() => setOpen((v) => !v)}
        className="flex-row items-center justify-between px-4 py-4"
        android_ripple={{ color: '#e5e7eb' }}
      >
        <View className="flex-row items-center gap-3">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-blue-50">
            <MaterialIcons name={icon} size={18} color={theme.colors.primary} />
          </View>
          <Text className="text-[15px] font-semibold text-gray-900">{title}</Text>
        </View>
        <MaterialIcons
          name={open ? 'expand-less' : 'expand-more'}
          size={22}
          color={open ? theme.colors.primary : '#9ca3af'}
        />
      </Pressable>
      {open && <View className="px-4 pb-5 pl-[3.5rem]">{children}</View>}
    </View>
  );
}

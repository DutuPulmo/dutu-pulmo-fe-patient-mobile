import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface StepBarProps {
  current: 1 | 2 | 3;
  /** Label for step 3. Defaults to 'Nhận lịch hẹn' */
  step3Label?: string;
}

const DEFAULT_STEPS = ['Chọn lịch khám', 'Xác nhận', 'Nhận lịch hẹn'] as const;

export function StepBar({ current, step3Label }: StepBarProps) {
  const steps = [
    { n: 1, label: DEFAULT_STEPS[0] },
    { n: 2, label: DEFAULT_STEPS[1] },
    { n: 3, label: step3Label ?? DEFAULT_STEPS[2] },
  ];

  return (
    <View className="flex-row items-center justify-between border-b border-slate-100 bg-white px-4 py-[10px]">
      {steps.map((step, i) => {
        const isDone = step.n < current;
        const isActive = step.n === current;
        return (
          <View
            key={step.n}
            className={`flex-1 flex-row items-center ${
              i === 1 ? 'justify-center' : i === 0 ? 'justify-start' : 'justify-end'
            }`}
          >
            {i > 0 && (
              <MaterialIcons name="chevron-right" size={16} color="#d1d5db" style={{ marginRight: 4 }} />
            )}
            <View
              className={`mr-[5px] h-[22px] w-[22px] items-center justify-center rounded-full ${
                isDone ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              {isDone ? (
                <MaterialIcons name="check" size={12} color="white" />
              ) : (
                <Text className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>
                  {step.n}
                </Text>
              )}
            </View>
            <Text
              className={`text-[11px] ${
                isActive
                  ? 'font-semibold text-blue-500'
                  : isDone
                    ? 'font-normal text-green-500'
                    : 'font-normal text-gray-400'
              }`}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default StepBar;

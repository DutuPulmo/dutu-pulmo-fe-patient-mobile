import { type ReactNode } from 'react';
import { Modal as RNModal, View } from 'react-native';

type Props = {
  visible: boolean;
  onRequestClose: () => void;
  children: ReactNode;
};

export function Modal({ visible, onRequestClose, children }: Props) {
  return (
    <RNModal animationType="fade" transparent visible={visible} onRequestClose={onRequestClose}>
      <View className="flex-1 items-center justify-center bg-black/40 px-6">{children}</View>
    </RNModal>
  );
}

export default Modal;
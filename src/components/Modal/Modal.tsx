import { ReactElement } from 'react';
import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content?: string | ReactElement;
}

export default function Modal(props: ModalProps) {
  const { isOpen, onClose, title, content } = props;

  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent mx={{ base: 2, md: 0 }}>
        <ModalHeader>{title || ''}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>{content || ''}</ModalBody>
      </ModalContent>
    </ChakraModal>
  );
}

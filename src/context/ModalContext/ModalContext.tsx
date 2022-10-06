import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactElement,
} from 'react';
import { useDisclosure } from '@chakra-ui/react';

// components
import Modal from '../../components/Modal/Modal';

interface IModalContext {
  openModal: (modal: any) => void;
  closeModal: () => void;
}

interface ModalProviderProps {
  children: React.ReactNode;
}

interface IModal {
  title: string | null;
  content: string | ReactElement;
  onClose?: () => void;
}

// context
const ModalContext = createContext<IModalContext | undefined>(undefined);

// provider
function ModalProvider({ children }: ModalProviderProps) {
  const [modal, setModal] = useState<IModal | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  /**
   * Handle open modal. Use chakra useDisclosure hook, set modal object to state.
   */
  const openModal = (modal: IModal) => {
    setModal(modal);
    onOpen();
  };

  /**
   * Handle open modal. Use chakra useDisclosure hook, remove modal object from state.
   */
  const closeModal = useCallback(async () => {
    onClose();

    if (modal && typeof modal.onClose === 'function') {
      modal.onClose();
    }

    setModal(null);
  }, [modal, onClose]);

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
      }}
    >
      <>
        {children}

        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          title={modal?.title || ''}
          content={modal?.content}
        />
      </>
    </ModalContext.Provider>
  );
}

/**
 * useModal hook
 */
function useModal() {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
}

export { ModalContext, ModalProvider, useModal };

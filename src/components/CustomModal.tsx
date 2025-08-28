import type { CustomFlowbiteTheme } from 'flowbite-react';
import { Modal } from 'flowbite-react';

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const customTheme: CustomFlowbiteTheme['modal'] = {
  content: {
    inner: 'relative bg-white shadow dark:bg-gray-700 flex flex-col max-h-[90vh] rounded-3xl p-2',
  },
};

const CustomModal = (props: ModalProps) => {
  const {
    opened,
    onClose,
    children,
  } = props;

  return (
    <Modal show={opened} onClose={onClose} position="center" size="md" popup dismissible theme={customTheme}>
      <Modal.Header />
      <Modal.Body>
        {children}
      </Modal.Body>
    </Modal>
  )
};

export default CustomModal;

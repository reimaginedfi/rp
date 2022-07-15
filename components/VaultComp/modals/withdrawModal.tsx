import {
    ModalOverlay,
    ModalCloseButton,
    ModalContent,
    Modal,
    ModalHeader,
    ModalBody,
    Heading,
    Button,
    Grid,
    Text,
    useColorMode
  } from "@chakra-ui/react";

  type ModalProps = {
    onClose?: () => void;
    isOpen?: boolean;
  };

  export default function DepositModal({isOpen, onClose}: ModalProps) {
    const {colorMode} = useColorMode();

    return (
        <Modal
        isCentered
        scrollBehavior="inside"
        size="md"
        onClose={onClose!}
        isOpen={isOpen!}>
          <ModalOverlay onClick={onClose} />
          <ModalContent>
            <ModalHeader>
              <Heading variant="large" textAlign="center">
                Withdraw
              </Heading>
            </ModalHeader>
            <ModalCloseButton _focus={{ boxShadow: "none" }} />
    
            <ModalBody
              px="0.25rem"
              borderTop="solid 1px"
              borderColor={colorMode === "dark" ? "#232323" : "#F3F3F3"}
            >
                
            </ModalBody>
          </ModalContent>
        </Modal>
    )
  }
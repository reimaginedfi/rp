import { useState, useEffect } from "react";

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
  useColorMode,
  Stack,
  Flex,
  Input,
  Container,
} from "@chakra-ui/react";

type ModalProps = {
  onClose?: () => void;
  isOpen?: boolean;
};

export default function WithdrawModal({ isOpen, onClose }: ModalProps) {
  const { colorMode } = useColorMode();
  const [amount, setAmount] = useState<string>();

  return (
    <Modal
      isCentered
      scrollBehavior="inside"
      size="md"
      onClose={onClose!}
      isOpen={isOpen!}
    >
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
          <Container>
            <Stack gap={2} mx={2} my={3}>
              <Text variant="large">Your Vault Tokens</Text>
              <Flex alignItems="center" gap={6}>
                <Flex
                  fontSize={{ base: "1rem", md: "2rem" }}
                  alignItems="center"
                  gap={3}
                >
                  <Input
                    fontWeight={600}
                    type="number"
                    w={{ base: "5rem", sm: "10rem" }}
                    onChange={(e) => setAmount(e.target.value)}
                    value={amount}
                  />{" "}
                  <Text fontWeight={600}>VT</Text>
                </Flex>
                <Text fontWeight={600}>500 USDC</Text>
              </Flex>
              <Text variant="large">Max 10.00 VT</Text>
            </Stack>
            <Button mt={"4rem"} w="80%" m="auto" variant="primary">
              Unlock {amount!}
            </Button>
          </Container>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

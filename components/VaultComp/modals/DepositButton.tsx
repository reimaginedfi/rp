import {
  Avatar,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Progress,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";

const TokenInput = () => {
  return (
    <Stack
      w={"full"}
      alignItems="stretch"
      p={2}
      borderRadius="md"
      bgColor={"whiteAlpha.100"}
      borderWidth="1px"
      borderStyle={"solid"}
      borderColor={"blackAlpha.200"}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        borderRadius="md"
        my={1}
      >
        <Flex
          alignItems={"center"}
          py={1}
          px={2}
          borderRadius="md"
          bgColor={"whiteAlpha.200"}
          borderWidth="1px"
          borderStyle={"solid"}
          borderColor={"blackAlpha.200"}
          mr={2}
          alignSelf="stretch"
        >
          <Avatar name="USDC" size={"xs"} mr={2} />
          <Text>USDC</Text>
        </Flex>
        <NumberInput
          placeholder={"0.0"}
          min={0}
          step={0.1}
          flex={1}
          allowMouseWheel
        >
          <NumberInputField textAlign="right" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>
      <Flex justifyContent={"space-between"}>
        <Flex>
          <Text fontSize="sm" mr={2}>
            Balance: 303.010101
          </Text>
          <Button size="sm" variant={"link"}>
            Max
          </Button>
        </Flex>
        <Text fontSize="sm" textAlign={"right"}>
          $303.12
        </Text>
      </Flex>
      <Progress size={"xs"} borderRadius="full" />
      <Text fontSize="xs" color={"red"}>
        Exceeds wallet balance
      </Text>
    </Stack>
  );
};

export const DepositButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button w={"full"} onClick={onOpen}>
        Deposit
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay></ModalOverlay>
        <ModalContent>
          <ModalHeader>
            Deposit to Vault <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <TokenInput />
              <TableContainer>
                <Table>
                  <Tbody>
                    <Tr>
                      <Td px={2} py={1}>
                        <Text fontSize={"lg"} fontWeight="bold">
                          Total
                        </Text>
                      </Td>
                      <Td px={2} py={1}>
                        <Flex justifyContent={"space-between"}>
                          <Text fontSize={"lg"} fontWeight="bold">
                            $303.12
                          </Text>
                          <Button variant={"link"} size="xs">
                            Max
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td px={2} py={1}>
                        Fees
                      </Td>
                      <Td px={2} py={1}>
                        <Flex justifyContent={"space-between"}>
                          <Text>$3.03</Text>
                        </Flex>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Stack w="full">
              <Button w={"full"} onClick={onClose}>
                Approve
              </Button>
              <Button variant={"link"} w={"full"} onClick={onClose}>
                Cancel
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

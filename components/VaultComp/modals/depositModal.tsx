import { useState, useEffect } from "react";

import {
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  Modal,
  ModalHeader,
  ModalBody,
  Heading,
  Input,
  Button,
  Grid,
  Text,
  useColorMode,
  Flex,
  Stack,
  VStack,
} from "@chakra-ui/react";
//Wagmi
import { useNetwork } from "wagmi";

//Vaults
import { useVaultDeposit } from "../../hooks/useVault";
import { vaults } from "../../../contracts";

type ModalProps = {
  onClose?: () => void;
  isOpen?: boolean;
};

export default function DepositModal({ isOpen, onClose }: ModalProps) {
  const { colorMode } = useColorMode();
  const { chain } = useNetwork();

  const [contractConfig, setContractConfig] = useState<any>();
  const [amount, setAmount] = useState<string>("0");

  const {
    balanceDisplay,
    isAllowed,
    approve,
    isApproving,
    storeAsset,
    isStoring,
    approveMax,
    isApprovingMax,
  } = useVaultDeposit(contractConfig, amount === "" ? "0" : amount);

  useEffect(() => {
    vaults[chain!.id].map((contract) => {
      setContractConfig(contract);
      console.log("contract", contract);
    });
  }, [chain, vaults]);

  useEffect(() => {
    console.log({ balanceDisplay });
  }, [balanceDisplay]);

  const handleDeposit = async () => {
    if(!isAllowed) {
      return
    }
    await storeAsset();
  };

  const handleApprove = async () => {
    await approve()
  };

  const handleApproveMax = async () => {
    await approveMax()
  };

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
            DEPOSIT
          </Heading>
        </ModalHeader>
        <ModalCloseButton _focus={{ boxShadow: "none" }} />

        <ModalBody
          px="0.25rem"
          borderTop="solid 1px"
          borderColor={colorMode === "dark" ? "#232323" : "#F3F3F3"}
        >
          <VStack align="center" gap={2} mx={2} mt={3} mb={6}>
            <Heading variant="medium">Wallet Balance</Heading>
            <Text fontWeight={600}                 fontSize={{ base: "1rem", md: "1.5rem" }}>{balanceDisplay} USDC</Text>
            <Text variant="large">Deposit Balance</Text>
            <Flex alignItems="center" gap="1rem">
              <Input
                fontSize={{ base: "1rem", md: "1.5rem" }}
                fontWeight={600}
                type="number"
                w="10rem"
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
                bg="#373737"
                border="none"
              />
              <Text fontWeight={600} fontSize={{ base: "1rem", md: "1.5rem" }}>USDC</Text>
            </Flex>
          </VStack>
          {!isAllowed && (
            <Flex my={7} alignItems="center" w="full" justify="space-around">
              <Button isDisabled={+amount <= 0 || isApprovingMax} isLoading={isApproving} onClick={handleApprove}>Approve</Button>
              <Button isDisabled={+amount <= 0 || isApproving} isLoading={isApprovingMax} onClick={handleApproveMax}>Approve Max</Button>
            </Flex>
          )}
          <Button
            justifySelf="center"
            alignSelf="center"
            disabled={!isAllowed || +amount <= 0}
            isLoading={isStoring}
            onClick={handleDeposit}
            m="auto"
            minW={"10rem"}
            variant="primary"
          >
            Deposit {amount!}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

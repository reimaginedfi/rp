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
  VStack,
  Flex,
  Input,
  Container,
} from "@chakra-ui/react";
import { vaults } from "../../../contracts";
import { useNetwork } from "wagmi";
import { useVaultWithdraw } from "../../hooks/useVault";
import { formatUnits } from "ethers/lib/utils";

type ModalProps = {
  onClose?: () => void;
  isOpen?: boolean;
};

export default function WithdrawModal({ isOpen, onClose }: ModalProps) {
  const { colorMode } = useColorMode();
  const [amount, setAmount] = useState<string>("");
  const { chain } = useNetwork();
  const [contractConfig, setContractConfig] = useState<any>();

  const {
    hasPendingWithdrawal,
    user,
    unlockShares,
    claim,
    unlockingShares,
    withdrawable,
    claiming,
  } = useVaultWithdraw(contractConfig, amount === "" ? "0" : amount);

  useEffect(() => {
    vaults[chain!.id].map((contract) => {
      setContractConfig(contract);
      console.log("contract", contract);
    });
  }, [chain, vaults]);

  const handleUnlockShares = async () => {
    console.log("unlocking shares");
    await unlockShares();
  };

  const handleClaim = async () => {
    if (!withdrawable) {
      return;
    }
    await claim();
  };

  return (
    <Modal
      isCentered
      scrollBehavior="inside"
      size="xl"
      onClose={onClose!}
      isOpen={isOpen!}
    >
      <ModalOverlay onClick={onClose} />
      <ModalContent>
        <ModalHeader>
          <Heading variant="large" textAlign="center">
            WITHDRAW
          </Heading>
        </ModalHeader>
        <ModalCloseButton _focus={{ boxShadow: "none" }} />

        <ModalBody
          px="0.25rem"
          borderTop="solid 1px"
          borderColor={colorMode === "dark" ? "#232323" : "#F3F3F3"}
        >
          <Container>
            <VStack align="center" gap="1rem" mx={2} mt={3} mb={6}>
            <Heading variant="medium">Your Vault Tokens:</Heading>
              <Text fontWeight={600} fontSize={{ base: "1rem", md: "1.5rem" }}>
                {formatUnits(user.data?.vaultShares ?? 0)} VT
              </Text>
              <VStack align="center" gap={2} mx={2} mt={3} mb={6}>
              <Heading variant="medium">Amount to Unlock</Heading>
                <Flex
                  fontSize={{ base: "1rem", md: "2rem" }}
                  alignItems="center"
                  gap="1rem"
                >
                  <Input
                    fontWeight={600}
                    type="number"
                    min={0}
                    w={{ base: "5rem", sm: "10rem" }}
                    onChange={(e) => setAmount(e.target.value)}
                    value={amount}
                    bg="#373737"
                    border="none"
                  />
                  <Text
                    fontWeight={600}
                    fontSize={{ base: "1rem", md: "1.5rem" }}
                  >
                    VT{" "}(500 USDC)
                  </Text>
                </Flex>
              </VStack>
              <Text variant="large">
                Max {formatUnits(user.data?.vaultShares ?? 0)} VT
              </Text>
              {!hasPendingWithdrawal && (
                <Button
                  isLoading={unlockingShares}
                  onClick={handleUnlockShares}
                  mt={"4rem"}
                  variant="primary"
                >
                  Unlock {amount!}
                </Button>
              )}
              {withdrawable && (
                <Button
                  onClick={handleClaim}
                  isLoading={claiming}
                  isDisabled={!withdrawable || !hasPendingWithdrawal}
                  mt={"4rem"}
                  variant="primary"
                >
                  Withdraw
                </Button>
              )}
            </VStack>
            <Flex gap={10} alignItems="center">
            </Flex>
          </Container>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

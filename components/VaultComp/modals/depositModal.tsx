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
  InputGroup,
  InputRightElement,
  Button,
  Grid,
  Text,
  useColorMode,
  Flex,
  Stack,
  VStack,
  useToast,
} from "@chakra-ui/react";
//Wagmi
import { useNetwork } from "wagmi";

//Vaults
import { useVaultDeposit } from "../../hooks/useVault";
import { vaults } from "../../../contracts";
import { DangerToast, SuccessToast } from "../../Toasts";
import getErrorMessage from "../../utils/errors";

type ModalProps = {
  onClose?: () => void;
  isOpen?: boolean;
};

export default function DepositModal({ isOpen, onClose }: ModalProps) {
  const { colorMode } = useColorMode();
  const { chain } = useNetwork();

  const [contractConfig, setContractConfig] = useState<any>();
  const [isApproved, setIsApproved] = useState<boolean>();

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
    approveMaxError,
    storeAssetError,
    approveError,
    storeAssetSuccess,
    approveSuccess,
    approveMaxSuccess
  } = useVaultDeposit(contractConfig, amount === "" ? "0" : amount);

  const toast = useToast();

  useEffect(() => {
    if(approveMaxSuccess) {
      toast({
        status: "success",
        title: 'Approve Max Success',
        duration: 5000,
      });
    }
  }, [approveMaxSuccess, toast])

  useEffect(() => {
    if(approveSuccess) {
      toast({
        status: "success",
        title: 'Approve Success',
        duration: 5000,
      });
    }
  }, [approveSuccess, toast])

  useEffect(() => {
    if(storeAssetSuccess) {
      toast({
        status: "success",
        title: 'Asset Stored Successfully',
        duration: 5000,
      });
    }
  }, [storeAssetSuccess, toast])

  useEffect(() => {
    console.log("approveMaxError: ", approveMaxError);
    if (approveMaxError) {
      toast({
        variant: "danger",
        title: approveMaxError?.name,
        duration: 5000,
        render: () => (
          <DangerToast
            message={approveMaxError
              ?.toString()
              .substring(approveMaxError?.toString().indexOf(":"), -1)}
          />
        ),
      });
    }
  }, [approveMaxError, toast]);

  useEffect(() => {
    console.log("storeAssetError: ", storeAssetError);
    if (storeAssetError) {
      toast({
        variant: "danger",
        title: storeAssetError?.name,
        duration: 5000,
        render: () => (
          <DangerToast
            message={storeAssetError
              ?.toString()
              .substring(storeAssetError?.toString().indexOf(":"), -1)}
          />
        ),
      });
    }
  }, [storeAssetError, toast]);

  useEffect(() => {
    console.log("approveError: ", approveError);
    if (approveError) {
      toast({
        variant: "danger",
        title: approveError?.name,
        duration: 5000,
        render: () => (
          <DangerToast
            message={approveError
              ?.toString()
              .substring(approveError?.toString().indexOf(":"), -1)}
          />
        ),
      });
    }
  }, [approveError, toast]);

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
    if (!isAllowed) {
      return;
    }
    try {
      await storeAsset();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast({
        variant: "danger",
        duration: 5000,
        position: "bottom",
        render: () => (
          <DangerToast
            message={errorMessage}
          />
        ),
      });
    }
  };

  const handleApprove = async () => {
    try {
      await approve();
      setIsApproved(true);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast({
        variant: "danger",
        position: "bottom",
        duration: 5000,
        render: () => (
          <DangerToast
            message={errorMessage}
          />
        ),
      });
    }
  };

  const handleApproveMax = async () => {
    await approveMax();
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
          <VStack align="center" gap="1rem" mx={2} mt={3} mb={6}>
            <Heading variant="medium">Wallet Balance</Heading>
            <Text fontWeight={600} fontSize={{ base: "1rem", md: "1.5rem" }}>
              {balanceDisplay} USDC
            </Text>
            <VStack align="center" gap="1rem" mx={2} mt={3} mb={6}>
              <Heading variant="medium">Deposit Balance</Heading>
              <Flex
                fontSize={{ base: "1rem", md: "2rem" }}
                alignItems="center"
                gap="1rem"
              >
                <InputGroup w={{ base: "5rem", sm: "10rem" }}>
                  <Input
                    fontSize={{ base: "1rem", md: "1.5rem" }}
                    fontWeight={600}
                    type="number"
                    w="10rem"
                    onChange={(e) => setAmount(e.target.value)}
                    value={amount}
                    bg={colorMode === "dark" ? "#373737" : "#F3F3F3"}
                    border="none"
                  />
                  <InputRightElement>
                    <Button
                      h="1.75rem"
                      mr="0.25rem"
                      size="xs"
                      onClick={() => setAmount(balanceDisplay)}
                    >
                      MAX
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <Text
                  fontWeight={600}
                  fontSize={{ base: "1rem", md: "1.5rem" }}
                >
                  USDC
                </Text>
              </Flex>
            </VStack>
            {!isApproved && amount !== "0" && (
              <Flex my={7} gap={3} alignItems="center" w="full" flexDir='column'>
                <Button w='full' p={3} borderRadius='xl'
                  variant='ghost'
                  isDisabled={+amount <= 0 || isApprovingMax}
                  isLoading={isApproving}
                  onClick={handleApprove}
                >
                  Approve to use your USDC
                </Button>
                <Button w='full' p={3} borderRadius='xl'
                variant='secondary'
                  isDisabled={+amount <= 0 || isApproving}
                  isLoading={isApprovingMax}
                  onClick={handleApproveMax}
                >
                  Approve Max to use your USDC
                </Button>
              </Flex>
            )}
            <Button
              disabled={!isApproved || amount === "0" || isApproving || isApprovingMax}
              isLoading={isStoring}
              onClick={handleDeposit}
              minW={"10rem"}
              variant="primary"
            >
              Deposit
              <Text fontWeight="light" ml="0.25rem">
                {amount && `${amount} USDC`}
              </Text>
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

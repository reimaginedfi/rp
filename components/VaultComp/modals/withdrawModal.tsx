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
  InputRightElement,
  InputGroup,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
  Box,
} from "@chakra-ui/react";
import { vaults } from "../../../contracts";
import { useAccount, useContractWrite, useNetwork } from "wagmi";
import { useVaultWithdraw } from "../../hooks/useVault";
import { formatUnits } from "ethers/lib/utils";
import { DangerToast, SuccessToast } from "../../Toasts";
import { BigNumber } from "ethers";
import { truncate } from "../../utils/stringsAndNumbers";

type ModalProps = {
  onClose?: () => void;
  isOpen?: boolean;
};

export default function WithdrawModal({ isOpen, onClose }: ModalProps) {
  const { colorMode } = useColorMode();
  const [amount, setAmount] = useState<string>("");
  const { chain } = useNetwork();
  const [contractConfig, setContractConfig] = useState<any>();
  const { address } = useAccount();

  const {
    hasPendingWithdrawal,
    user,
    unlockShares,
    unlockingShares,
    unlockingError,
    withdrawable,
    claim,
    claiming,
    claimError,
    claimSuccess,
    unlockingSuccess,
    claimStatus,
    unlockingStatus,
    userHasPendingDeposit,
    userHasPendingRedeem,
  } = useVaultWithdraw(contractConfig, amount === "" ? "0" : amount);

  console.log(claimStatus, claimError);

  const toast = useToast();

  useEffect(() => {
    console.log("unlockingError: ", unlockingError?.message);
    if (unlockingError?.name === "Error" && unlockingStatus === "error") {
      toast({
        variant: "danger",
        title: unlockingError?.name,
        duration: 5000,
        render: () => (
          <DangerToast
            message={unlockingError?.message.substring(
              0,
              unlockingError?.message.indexOf(";")
            )}
          />
        ),
      });
    }
  }, [unlockingError, unlockingStatus, toast]);

  useEffect(() => {
    console.log("unlocking Success: ", unlockingStatus);
    if (unlockingStatus === "success") {
      toast({
        variant: "success",
        title: "Unlock Successful",
        duration: 5000,
        render: () => <SuccessToast message="Unlock Successful" />,
      });
    }
  }, [unlockingError, unlockingStatus, toast]);

  useEffect(() => {
    console.log("claimError: ", claimError?.message);
    if (claimError?.name === "Error" && claimStatus === "error") {
      toast({
        variant: "danger",
        title: claimError?.name,
        duration: 5000,
        render: () => (
          <DangerToast
            message={claimError?.message.substring(
              0,
              claimError?.message.indexOf(";")
            )}
          />
        ),
      });
    }
  }, [claimError, claimStatus, toast]);

  useEffect(() => {
    vaults[chain!.id].map((contract) => {
      setContractConfig(contract);
      console.log("contract", contract);
    });
  }, [chain, vaults]);

  const handleUnlockShares = async () => {
    console.log("unlocking shares");
    try {
      await unlockShares?.();
    } catch (error) {
      console.log("error while unlocking share: ", error);
    }
  };

  useEffect(() => {
    console.log("unlockingShares: ", unlockingShares);
  }, [unlockingShares]);

  const handleClaim = async () => {
    if (!withdrawable) {
      return;
    }
    await claim?.();
  };

  return (
    <Modal
      isCentered
      scrollBehavior="inside"
      onClose={onClose!}
      isOpen={isOpen!}
    >
      <ModalOverlay onClick={onClose} />
      <ModalContent>
        <ModalHeader>
          <Heading variant="large" textAlign="left">
            Withdraw to Vault
          </Heading>
          <ModalCloseButton mt={3} _focus={{ boxShadow: "none" }} />
        </ModalHeader>

        <ModalBody
          px="0.25rem"
          borderTop="solid 1px"
          borderColor={colorMode === "dark" ? "#232323" : "#F3F3F3"}
        >
          <Container>
            <Stack
              borderRadius="8px"
              border={
                user?.data && +amount > +formatUnits(user?.data?.vaultShares, 6)
                  ? "solid 1px red"
                  : (null as any)
              }
              align="center"
              mx={2}
              mt={3}
              p={2}
              mb={6}
            >
              <Box w='full'>
                <Flex
                  w="full"
                  justifyContent={"space-between"}
                  alignItems="center"
                >
                  <Text>Your Vault Tokens:</Text>
                  <Text
                    fontWeight={600}
                    fontSize={{ base: "1rem", md: "1.5rem" }}
                  >
                    {formatUnits(user.data?.vaultShares ?? 0, 6)} VT
                  </Text>
                </Flex>
                <Flex
                  w="full"
                  justify="space-between"
                  alignItems="center"
                  gap={2}
                  mx={2}
                  mt={3}
                  mb={3}
                >
                  <Text
                    fontWeight={600}
                    fontSize={{ base: "1rem", md: "1.5rem" }}
                  >
                    Vt
                  </Text>
                  <Flex
                    fontSize={{ base: "1rem", md: "2rem" }}
                    alignItems="center"
                    gap="1rem"
                  >
                    <NumberInput
                      fontWeight={600}
                      min={0}
                      value={amount}
                      onChange={setAmount}
                      placeholder={"0.0"}
                      step={1000}
                      flex={1}
                      allowMouseWheel
                      bg={colorMode === "dark" ? "#373737" : "#F3F3F3"}
                      borderRadius="1rem"
                      inputMode="numeric"
                      fontSize="1.5rem"
                    >
                      <NumberInputField
                        onChange={(e) => setAmount(e.target.value.toString())}
                        textAlign="right"
                        border="none"
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </Flex>
                </Flex>
                {user?.data &&
                  +amount > +formatUnits(user.data?.vaultShares, 6) && (
                    <Text fontSize="xs" color={"red"}>
                      Exceeds wallet balance
                    </Text>
                  )}
              </Box>

              <Flex
                justifyContent={"space-between"}
                w="full"
                alignContent="center"
              >
                <Text
                  variant="extralarge"
                  fontSize="sm"
                  mr={2}
                  alignSelf="center"
                >
                  Your Vault Tokens:{" "}
                  {formatUnits(user.data?.vaultShares ?? 0, 6)} VT
                </Text>

                <Button
                  onClick={() =>
                    setAmount(formatUnits(user.data?.vaultShares, 6))
                  }
                  variant={"tertiary"}
                  p={4}
                  fontSize="1rem"
                >
                  Max
                </Button>
              </Flex>
            </Stack>
            <Stack>
              {!hasPendingWithdrawal && (
                <Button
                  // disabled={!unlockShares}
                  isLoading={unlockingShares || unlockingStatus === "loading"}
                  onClick={handleUnlockShares}
                  variant="secondary"
                >
                  Unlock {amount!} VT
                </Button>
              )}
              {withdrawable && (
                <>
                  <Flex
                    mt={5}
                    w={"full"}
                    alignItems="center"
                    justify={"space-between"}
                  >
                    <Heading w="fit-content" variant="medium">
                      Amount to Withdraw
                    </Heading>
                    <Text
                      maxW={"50%"}
                      fontWeight={600}
                      fontSize={{ base: "1rem", md: "1.5rem" }}
                    >
                      {parseInt(formatUnits(withdrawable._hex, 16))}
                    </Text>
                  </Flex>
                  <Button
                    onClick={handleClaim}
                    isLoading={claiming}
                    isDisabled={!withdrawable}
                    mt={"4rem"}
                    variant="primary"
                  >
                    Withdraw
                  </Button>
                </>
              )}
            </Stack>
          </Container>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

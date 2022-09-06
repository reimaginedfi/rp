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
  Tooltip,
} from "@chakra-ui/react";
import { vaults } from "../../../contracts";
import { useAccount, useNetwork } from "wagmi";
import { useVaultWithdraw, useVaultMeta } from "../../hooks/useVault";
import { formatUnits } from "ethers/lib/utils";
import { DangerToast, SuccessToast } from "../../Toasts";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { commify } from "ethers/lib/utils";

type ModalProps = {
  onClose?: () => void;
  isOpen?: boolean;
};

export default function WithdrawModal({ isOpen, onClose }: ModalProps) {
  const { colorMode } = useColorMode();
  const [amount, setAmount] = useState<string>("");
  const [withdrawActive, setWithdrawActive] = useState<boolean>(false);
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

  const { epoch } = useVaultMeta(contractConfig);

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

  // console.log(parseInt(epoch.data!._hex), parseInt(user.data?.epochToRedeem))
  // console.log(parseInt(user?.data?.sharesToRedeem));

  useEffect(() => {
    if (parseInt(user.data?.epochToRedeem) === parseInt(epoch!.data?._hex)) {
      setWithdrawActive(true);
    }
  }, [user, epoch, withdrawable]);

  return (
    <Modal isOpen={isOpen!} onClose={onClose!} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Withdraw from Vault <ModalCloseButton />
        </ModalHeader>
        <ModalBody
          borderTop="solid 1px"
          borderColor={colorMode === "dark" ? "#232323" : "#F3F3F3"}
        >
          {!withdrawActive && (
            <Stack
              borderRadius="8px"
              border={
                user?.data && +amount > +formatUnits(user?.data?.vaultShares, 6)
                  ? "solid 1px red"
                  : (null as any)
              }
              px={2}
              align="center"
              w="full"
            >
              <Heading variant="large">Amount To Unlock</Heading>
              <Flex
                w="full"
                justify="space-between"
                alignItems="center"
                gap={2}
                mt={3}
                mb={3}
              >
                <Flex
                  w="full"
                  fontSize={{ base: "1rem", md: "2rem" }}
                  justifyItems={"space-between"}
                  gap="1rem"
                  mb={2}
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

                  <Button
                    onClick={() =>
                      setAmount(formatUnits(user.data?.sharesToRedeem ?? 0, 6))
                    }
                    variant={"tertiary"}
                    p={4}
                    fontSize="1rem"
                  >
                    Max
                  </Button>
                </Flex>
              </Flex>
              <VStack w="full" alignSelf="start">
                <Text
                  variant="extralarge"
                  fontSize="medium"
                  fontWeight={600}
                  mr={2}
                  alignSelf="start"
                >
                  Balance: {formatUnits(user.data?.vaultShares ?? 0, 6)} VT{" "}
                  <Tooltip
                    hasArrow
                    label="Total VT token balance currently locked in the vault."
                    bg={colorMode === "dark" ? "white" : "black"}
                  >
                    <InfoOutlineIcon w={3.5} h={3.5} />
                  </Tooltip>
                </Text>
                <Text
                  variant="extralarge"
                  fontSize="sm"
                  mr={2}
                  alignSelf="start"
                >
                  Withdrawable: {formatUnits(user.data?.sharesToRedeem ?? 0, 6)}{" "}
                  VT{" "}
                  <Tooltip
                    hasArrow
                    label="Amount locked in the vault that can be unlocked for withdrawals."
                    bg={colorMode === "dark" ? "white" : "black"}
                  >
                    <InfoOutlineIcon w={3.5} h={3.5} />
                  </Tooltip>
                </Text>
                <Text
                  variant="extralarge"
                  fontSize="sm"
                  mr={2}
                  alignSelf="start"
                >
                  EPOCH to withdraw: {parseInt(user.data?.epochToRedeem)}{" "}
                  <Tooltip
                    hasArrow
                    label="Can only unlock and withdraw in this epoch."
                    bg={colorMode === "dark" ? "white" : "black"}
                  >
                    <InfoOutlineIcon w={3.5} h={3.5} />
                  </Tooltip>
                </Text>
              </VStack>

              {user?.data && +amount > +formatUnits(user.data?.vaultShares, 6) && (
                <Text fontSize="xs" color={"red"} textAlign="start">
                  Exceeds your holdings
                </Text>
              )}
            </Stack>
          )}

          {!hasPendingWithdrawal && (
            <Button
              w="100%"
              disabled={
                !unlockShares || parseInt(user.data!.sharesToRedeem) === 0
              }
              isLoading={unlockingShares || unlockingStatus === "loading"}
              onClick={handleUnlockShares}
              variant="primary"
              my={2}
            >
              Unlock {commify(amount!)} VT
            </Button>
          )}

          <Stack spacing={2}>
            {withdrawable &&
              parseInt(withdrawable![0]) !== 0 &&
              withdrawActive && (
                <Stack spacing="0.5rem">
                  <Flex
                    mt={5}
                    w={"full"}
                    alignItems="center"
                    justify={"space-between"}
                  >
                    <Heading w="fit-content" variant="medium">
                      Withdrawable Amount
                    </Heading>
                    <Text fontSize={"lg"} fontWeight="bold" alignSelf="center">
                      {formatUnits(withdrawable![0]._hex, 6)} USDC
                    </Text>
                  </Flex>
                  <Flex
                    mt={5}
                    w={"full"}
                    alignItems="center"
                    justify={"space-between"}
                  >
                    <Text>Withdraw Fee</Text>
                    <Flex alignItems="center" gap={2}>
                      <Text>
                        {withdrawable &&
                          (parseInt(withdrawable![0]._hex) / 100) * 1}{" "}
                        USDC
                      </Text>
                      <Tooltip
                        hasArrow
                        label="REFI currently takes 1% management fee on all withdrawals."
                        bg={colorMode === "dark" ? "white" : "black"}
                      >
                        <InfoOutlineIcon w={3.5} h={3.5} />
                      </Tooltip>
                    </Flex>
                  </Flex>
                  <Flex alignItems="center" justify="space-between">
                    <Text>To withdraw</Text>
                    <Flex alignItems="center" gap={2}>
                      <Text>
                        {" "}
                        {withdrawable &&
                          (parseInt(withdrawable![0]) / 100) * 1}{" "}
                        USDC
                      </Text>
                      <Tooltip
                        hasArrow
                        label="Amount that goes into your wallet (what you withdraw minus the 1% fees)."
                        bg={colorMode === "dark" ? "white" : "black"}
                      >
                        <InfoOutlineIcon w={3.5} h={3.5} />
                      </Tooltip>
                    </Flex>
                  </Flex>
                  <Button
                    onClick={handleClaim}
                    isLoading={claiming}
                    isDisabled={!withdrawable}
                    mt={"4rem"}
                    variant="primary"
                  >
                    Withdraw {withdrawable && parseInt(withdrawable![0])}{" "}USDC
                  </Button>
                </Stack>
              )} 
            <Button variant={"ghost"} w={"full"} onClick={onClose}>
              Cancel
            </Button>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

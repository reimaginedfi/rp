import { useEffect, useState } from "react";

import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  Tooltip,
  useColorMode,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { commify } from "ethers/lib/utils";
import { formatUnits } from 'viem';
import {
  useNetwork,
  useWaitForTransaction,
  useContractRead,
  useAccount,
} from "wagmi";
import { vaults } from "../../../contracts";
import { useVaultMeta, useVaultWithdraw, useVaultUser } from "../../hooks/useVault";
import { DangerToast, SuccessToast } from "../../Toasts";
import getErrorMessage from "../../utils/errors";
import { truncate } from "../../utils/stringsAndNumbers";
import { ConnectButton } from "@rainbow-me/rainbowkit";

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
    unlockingStatus,
    unlockData,
    claimData,
  } = useVaultWithdraw(contractConfig, amount === "" ? "0" : amount);

  const {hasPendingDeposit, updatePendingDeposit} = useVaultUser(address!);

  const withdrawalFeeAmount: any = useContractRead({
    ...contractConfig,
    functionName: "getWithdrawalFee",
    watch: true,
    args: [withdrawable && withdrawable[0], address],
  });

  const withdrawalFee = useContractRead({
    ...contractConfig,
    functionName: "exitFeeBps",
    watch: true,
  });


  const [claimDataSuccess, setClaimDataSuccess] = useState<string>("");
  const [unlockDataSuccess, setUnlockDataSuccess] = useState<string>("");

  const { isLoading: claimDataLoading } = useWaitForTransaction({
    hash: typeof claimData?.hash === "string" ? claimData?.hash : undefined,
    enabled: typeof claimData?.hash === "string",
    onSuccess: (data) => {
      if (data.status === 'success') {
        setClaimDataSuccess("true");
      } else if (data.status === 'reverted') {
        setClaimDataSuccess("false");
      }
    },
  });

  const { isLoading: unlockDataLoading } = useWaitForTransaction({
    hash: typeof unlockData?.hash === "string" ? unlockData?.hash : undefined,
    enabled: typeof unlockData?.hash === "string",
    onSuccess: (data) => {
      if (data.status === 'success') {
        setUnlockDataSuccess("true");
      } else if (data.status === 'reverted') {
        setUnlockDataSuccess("false");
      }
    },
  });

  const { epoch } = useVaultMeta(contractConfig);

  const toast = useToast();

  useEffect(() => {
    // Unlock error
    if (unlockDataSuccess === "false") {
      toast({
        variant: "danger",
        title: unlockingError?.name,
        duration: 5000,
        render: () => <DangerToast message="Unlock unsuccessful, try again." />,
      });
    }
  }, [unlockDataSuccess]);

  useEffect(() => {
    // unlock success
    console.log("unlocking Success: ", unlockingStatus);
    if (unlockDataSuccess === "true") {
      toast({
        variant: "success",
        title: "Unlock successful",
        duration: 5000,
        render: () => <SuccessToast message="Unlock Successful" />,
      });
    }
  }, [unlockDataSuccess]);

  useEffect(() => {
    // Claim error
    console.log("claimError: ", claimError);
    if (claimDataSuccess === "false") {
      toast({
        variant: "danger",
        title: claimError?.name,
        duration: 5000,
        render: () => (
          <DangerToast message="Withdraw unsuccessful, try again." />
        ),
      });
      onClose;
    }
  }, [claimDataSuccess]);

  useEffect(() => {
    // Claim success
    if (claimDataSuccess === "true") {
      toast({
        variant: "success",
        title: "Withdraw successful",
        duration: 5000,
        render: () => <SuccessToast message="Withdraw Successful" />,
      });
    }
  }, [claimDataSuccess]);

  useEffect(() => {
    vaults.map((contract) => {
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
    try {
      await claim?.();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast({
        variant: "danger",
        duration: 5000,
        position: "bottom",
        render: () => <DangerToast message={errorMessage} />,
      });
    }
  };

  useEffect(() => {
    if (Number(user.data?.[4]) !== 0 && Number(user.data?.[4]) <= Number(epoch!.data)) {
      setWithdrawActive(true);
    }
  }, [user, epoch, withdrawable]);

  const hasUnlockedShares =
    Number(user?.data?.[3]) > 0 && !withdrawActive;

  const exceedsHoldings =
    user?.data && +amount > Number(user.data?.[2])

  const needToClaim =  Number(user.data?.[2]) === 0 && hasPendingDeposit.data
  
  return (
    <Modal isOpen={isOpen!} onClose={onClose!} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Withdraw from Vault <ModalCloseButton />
        </ModalHeader>
        {!address ? (
          <Stack
            className={`ConnectButton${
              colorMode === "light" ? "-light" : "-dark"
            }`}
            h="full"
            p="1rem"
            alignItems="center"
          >
            <Text mb="1rem" textAlign="center">
              Connect your wallet to withdraw
            </Text>
            <ConnectButton
              chainStatus={"none"}
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full",
              }}
            />
          </Stack>
        ) : needToClaim ? (
          <Stack alignContent="center">
            <Text mb="1rem" textAlign="center"> You have unclaimed vault tokens (VT) from your last deposit. You need to claim these VT tokens first. Then you can unlock (out of the vault AUM) and eventually withdraw (transfer the value in USDC to your wallet).</Text>
            <Button
            size={"sm"}
            colorScheme="orange"
            isLoading={updatePendingDeposit.isLoading}
            onClick={() => {
              updatePendingDeposit.write();
            }}
          >
            Claim Pending
          </Button>
          </Stack>
        ) : (
          <>
            <ModalBody
              borderTop="solid 1px"
              borderColor={colorMode === "dark" ? "#232323" : "#F3F3F3"}
            >
              {!withdrawActive && (
                <Stack
                  borderRadius="8px"
                  border={
                    user?.data &&
                    +amount > Number(user.data?.[2])
                      ? "solid 1px red"
                      : (null as any)
                  }
                  px={2}
                  align="center"
                  w="full"
                >
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
                      alignItems="center"
                      gap="0.5rem"
                      mb={2}
                    >
                      <Text variant="medium">Amount To Unlock</Text>
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
                  <Flex justify={"space-between"} w="full">
                    <VStack w="full" alignSelf="start">
                      <Text
                        variant="extralarge"
                        fontSize="medium"
                        mr={2}
                        alignSelf="start"
                      >
                        <b>VT Tokens:</b>{" "}
                        {formatUnits(user.data?.[2] ?? 0, 6)} VT{" "}
                        <Tooltip
                          hasArrow
                          label="Total VT token balance (locked and unlocked tokens)."
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
                        Unlocked Balance:{" "}
                        {formatUnits(user.data?.[3] ?? 0, 6)} VT{" "}
                        <Tooltip
                          hasArrow
                          label="Balance available for withdrawal at epoch below."
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
                        EPOCH to withdraw: {Number(user.data?.[4])}{" "}
                        <Tooltip
                          hasArrow
                          label="Can only withdraw at this epoch."
                          bg={colorMode === "dark" ? "white" : "black"}
                        >
                          <InfoOutlineIcon w={3.5} h={3.5} />
                        </Tooltip>
                      </Text>
                    </VStack>
                    <Button
                      onClick={() =>
                        setAmount(formatUnits(user.data?.[2] ?? 0, 6))
                      }
                      variant={"tertiary"}
                      p={4}
                      fontSize="1rem"
                    >
                      Max
                    </Button>
                  </Flex>

                  {exceedsHoldings && (
                    <Text fontSize="xs" color={"red"} textAlign="start">
                      Exceeds your holdings
                    </Text>
                  )}
                </Stack>
              )}

              {hasUnlockedShares && (
                <Alert status="warning" borderRadius={"md"} my={1} px={2}>
                  <AlertIcon boxSize={"1rem"}></AlertIcon>
                  <AlertDescription>
                    <Text fontSize={"xs"}>
                      You already have unlocked tokens but you need to wait for
                      next epoch to withdraw or unlock more.
                    </Text>
                  </AlertDescription>
                </Alert>
              )}

              {!hasPendingWithdrawal && (
                <Button
                  w="100%"
                  disabled={
                    Number(user.data?.[2]) === 0 || exceedsHoldings || hasUnlockedShares
                  }
                  isLoading={
                    unlockingShares ||
                    unlockingStatus === "loading" ||
                    unlockDataLoading
                  }
                  onClick={handleUnlockShares}
                  variant="primary"
                  my={2}
                >
                  Unlock {commify(amount!)} VT
                </Button>
              )}

              <Stack spacing={2}>
                {withdrawable &&
                  Number(withdrawable![0]) !== 0 &&
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
                        <Text
                          fontSize={"lg"}
                          fontWeight="bold"
                          alignSelf="center"
                        >
                          {commify(
                            truncate(formatUnits(withdrawable![0], 6), 2)
                          )}{" "}
                          USDC
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
                            {withdrawalFeeAmount.data
                              ? +formatUnits(withdrawalFeeAmount?.data!, 6)
                              : 0}{" "}
                            USDC
                          </Text>
                          <Tooltip
                            hasArrow
                            label={`REFI currently takes ${
                              withdrawalFeeAmount.data
                                // ? +formatUnits(withdrawalFee.data!, 6)
                                // : 0
                            }% management fee on all withdrawals.`}
                            bg={colorMode === "dark" ? "white" : "black"}
                          >
                            <InfoOutlineIcon w={3.5} h={3.5} />
                          </Tooltip>
                        </Flex>
                      </Flex>
                      <Flex alignItems="center" justify="space-between">
                        <Text>To wallet</Text>
                        <Flex alignItems="center" gap={2}>
                          <Text>
                            {" "}
                            {withdrawable &&
                              commify(
                                truncate(
                                  (
                                    +formatUnits(withdrawable![0], 6) -
                                    (withdrawalFeeAmount.data
                                      ? +formatUnits(
                                          withdrawalFeeAmount?.data!,
                                          6
                                        )
                                      : 0)
                                  ).toString(),
                                  2
                                )
                              )}{" "}
                            USDC
                          </Text>
                          <Tooltip
                            hasArrow
                            label={`Amount that goes into your wallet (what you withdraw minus the ${
                              withdrawalFeeAmount.data
                                // ? +formatUnits(withdrawalFee.data!, 6)
                                // : 0
                            }% fees).`}
                            bg={colorMode === "dark" ? "white" : "black"}
                          >
                            <InfoOutlineIcon w={3.5} h={3.5} />
                          </Tooltip>
                        </Flex>
                      </Flex>
                      <Button
                        onClick={handleClaim}
                        isLoading={claiming || claimDataLoading}
                        isDisabled={!withdrawable}
                        mt={"4rem"}
                        variant="primary"
                      >
                        Withdraw{" "}
                        {withdrawable &&
                          commify(
                            truncate(formatUnits(withdrawable![0], 6), 2)
                          )}{" "}
                        USDC
                      </Button>
                    </Stack>
                  )}
                <Button variant={"ghost"} w={"full"} onClick={onClose}>
                  Cancel
                </Button>
              </Stack>
            </ModalBody>{" "}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

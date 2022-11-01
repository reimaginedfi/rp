import {
  Button,
  Flex,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { commify, parseUnits } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import { vaultConfigs, vaults } from "../../../contracts";
import {
  useVaultDeposit,
  useVaultMeta,
  useVaultUser,
} from "../../hooks/useVault";
import { DangerToast, SuccessToast } from "../../Toasts";
import getErrorMessage from "../../utils/errors";
import { noSpecialCharacters, truncate } from "../../utils/stringsAndNumbers";

import { InfoOutlineIcon } from "@chakra-ui/icons";
import { TokenInput } from "../../TokenInput";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface DepositButtonProps {
  depositSuccess: string;
  setDepositSuccess: React.Dispatch<React.SetStateAction<string>>;
  approvalSuccess: string;
  setApprovalSuccess: React.Dispatch<React.SetStateAction<string>>;
}

export const DepositButton: React.FC<DepositButtonProps> = ({
  depositSuccess,
  setDepositSuccess,
  approvalSuccess,
  setApprovalSuccess,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [amount, setAmount] = useState<string>("0.0");
  const toast = useToast();
  const { chain } = useNetwork();
  const [contractConfig, setContractConfig] = useState<any>();
  const { epoch, asset } = useVaultMeta(contractConfig);

  //CONTRACT READ FOR DEPOSIT FUNCTIONS
  const {
    balanceDisplay,
    approve,
    isApproving,
    isApproved,
    storeAsset,
    isStoring,
    storeAssetError,
    approveError,
    approveStatus,
    storeAssetStatus,
    depositData,
    approveData,
  } = useVaultDeposit(contractConfig, amount === "" ? "0" : amount);

  // CHECKS DEPOSIT TXN UNTIL IT SUCCEEDS
  const { isLoading } = useWaitForTransaction({
    hash: typeof depositData?.hash === "string" ? depositData?.hash : "",
    enabled: typeof depositData?.hash === "string",
    // onSuccess never fails
    //https://github.com/wagmi-dev/wagmi/discussions/428
    onSuccess: (data) => {
      if (data.status === 1) {
        setDepositSuccess("true");
      } else if (data.status === 0) {
        setDepositSuccess("false");
      }
    },
  });

  // CHECKS APPROVE TXN UNTIL IT SUCCEEDS
  const { isLoading: isLoadingApprove } = useWaitForTransaction({
    hash: typeof approveData?.hash === "string" ? approveData?.hash : "",
    enabled: typeof approveData?.hash === "string",
    // onSuccess never fails
    //https://github.com/wagmi-dev/wagmi/discussions/428
    onSuccess: (data) => {
      if (data.status === 1) {
        setApprovalSuccess("true");
      } else {
        data.status === 0;
      }
      {
        setApprovalSuccess("false");
      }
    },
  });

  const { colorMode } = useColorMode();

  const { address } = useAccount();

  // GETS CONTRACT CONFIG FROM VAULTS
  useEffect(() => {
    vaults.map((contract) => {
      setContractConfig(contract);
    });
  }, [chain, vaults]);

  const { totalDeposited } = useVaultUser(contractConfig, address ?? "");

  useEffect(() => {
    console.log("storeAssetError: ", storeAssetError);
    if (storeAssetError && storeAssetStatus === "error") {
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
  }, [storeAssetError, storeAssetStatus, toast]);

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
  }, [approveError, approvalSuccess, toast]);

  useEffect(() => {
    if (!isLoading && depositSuccess === "false") {
      toast({
        variant: "danger",
        title: storeAssetError?.name,
        duration: 5000,
        render: () => (
          <DangerToast message="Transaction error. Please, try again." />
        ),
      });
    }
  }, [toast, storeAssetError, isLoading, depositSuccess]);

  useEffect(() => {
    if (!isApproving && approveStatus === "success") {
      toast({
        variant: "success",
        duration: 5000,
        position: "bottom",
        render: () => (
          <SuccessToast message={`You have approved ${amount} USDC`} />
        ),
      });
    }
  }, [approveStatus, isApproving]);

  // HANDLES DEPOSIT function on button click
  const handleDeposit = async () => {
    if (!isApproved) {
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
        render: () => <DangerToast message={errorMessage} />,
      });
    }
  };

  // APPROVE ERC20 TOKEN on button click
  const handleApprove = async () => {
    try {
      await approve();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast({
        variant: "danger",
        position: "bottom",
        duration: 5000,
        render: () => <DangerToast message={errorMessage} />,
      });
    }
  };

  useEffect(() => {
    if (!isLoading && depositSuccess === "true") {
      toast({
        variant: "success",
        duration: 5000,
        position: "bottom",
        render: () => (
          <SuccessToast
            message={`You have deposited ${amount} USDC`}
            link={depositData?.hash}
          />
        ),
      });

      onClose!();
    }
  }, [isLoading, depositSuccess]);

  //VAULT CONTRAG CONFIG
  const vaultConfig = vaultConfigs[0];

  //CAN DEPOSIT / DEPOSIT ALLOWED - checks whether user meets the criteria (has enough REFI tokens, has deposited 25K before)
  const canDeposit = useContractRead({
    ...vaultConfig,
    functionName: "canDeposit",
    args: [
      address,
      parseUnits(amount === "" ? "0" : noSpecialCharacters(amount), 6),
    ],
  });
  const depositAllowed = canDeposit.data?.toString() === "true";

  //MINIMUM DEPOSIT - fetches minimum deposit amount for users who have not deposited before
  const minimumDeposit = useContractRead({
    ...vaultConfig,
    functionName: "minimumStoredValueBeforeFees",
  });
  const meetsMinimum = +amount >= 25000 || depositAllowed;

  // const depositedBefore = totalDeposited >= +formatUnits(minimumDeposit?.data?._hex!, 6)

  const exceedsBalance = +amount > +balanceDisplay;
  const tokenInputErrorMessage =
    ((!meetsMinimum || (!depositAllowed && amount !== "")) &&
      `Minimum deposit is 25,000 USDC`) ||
    (+amount > +balanceDisplay && "Exceeds wallet balance") ||
    "";

  // TODO: get this value from config contract
  // ${
  //   minimumDeposit.data
  //     ? commify(
  //         ~~formatUnits(
  //           BigNumber.from(minimumDeposit!.data!._hex!).toNumber(),
  //           6
  //         )
  //       )
  //     : "25,000"
  // }

  return (
    <>
      <Button variant="primary" w={"full"} onClick={onOpen}>
        Deposit
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Deposit to Vault <ModalCloseButton />
          </ModalHeader>
          {!address ? (
            <Stack h="full" p="1rem" alignItems="center">
              <Text mb="1rem" textAlign="center">
                Connect your wallet to deposit
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
          ) : (
            <>
              <ModalBody
                borderTop="solid 1px"
                borderColor={colorMode === "dark" ? "#232323" : "#F3F3F3"}
              >
                <Stack spacing={3}>
                  <TokenInput
                    amount={amount}
                    setAmount={setAmount}
                    balanceDisplay={balanceDisplay}
                    errorMessage={tokenInputErrorMessage}
                    tokenAddress={asset.data?.toString() ?? ""}
                  />
                  <Grid templateColumns="repeat(1, 1fr)" gap="0.5rem">
                    <GridItem>
                      <Flex alignItems="center" justify="space-between">
                        <Text fontSize={"lg"} fontWeight="bold">
                          Total
                        </Text>

                        <Text
                          fontSize={"lg"}
                          fontWeight="bold"
                          alignSelf="center"
                        >
                          {commify(truncate(noSpecialCharacters(amount), 2))}{" "}
                          USDC
                        </Text>
                      </Flex>
                    </GridItem>
                    <GridItem>
                      <Flex alignItems="center" justify="space-between">
                        <Text fontSize="lg" alignSelf="center">
                          Fees
                        </Text>
                        <Flex alignItems="center" gap={2}>
                          <Text>
                            {commify(
                              truncate(
                                (
                                  (+noSpecialCharacters(amount) / 100) *
                                  2
                                ).toString(),
                                2
                              )
                            )}{" "}
                            USDC
                          </Text>
                          <Tooltip
                            hasArrow
                            label="REFI takes 2% of the amount you deposit to the vault as management fees."
                            bg={colorMode === "dark" ? "white" : "black"}
                          >
                            <InfoOutlineIcon w={3.5} h={3.5} />
                          </Tooltip>
                        </Flex>
                      </Flex>
                    </GridItem>
                    <GridItem>
                      <Flex alignItems="center" justify="space-between">
                        <Text fontSize="lg" alignSelf="center">
                          To deposit
                        </Text>
                        <Flex alignItems="center" gap={2}>
                          <Text>
                            {commify(
                              truncate(
                                (
                                  (+noSpecialCharacters(amount) / 100) *
                                  98
                                ).toString(),
                                2
                              )
                            )}{" "}
                            USDC
                          </Text>
                          <Tooltip
                            hasArrow
                            label="Amount that goes into the vault (what you deposit minus the 2% fees)."
                            bg={colorMode === "dark" ? "white" : "black"}
                          >
                            <InfoOutlineIcon w={3.5} h={3.5} />
                          </Tooltip>
                        </Flex>
                      </Flex>
                    </GridItem>
                  </Grid>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Stack w="full" textAlign={"left"}>
                  <Button
                    isDisabled={
                      amount === "" ||
                      !meetsMinimum ||
                      !depositAllowed ||
                      isApproving ||
                      canDeposit.isLoading ||
                      exceedsBalance
                    }
                    isLoading={
                      isApproving || isLoading || isLoadingApprove || isStoring
                    }
                    onClick={!isApproved ? handleApprove : handleDeposit}
                    w={"full"}
                    variant={isApproved ? "primary" : "secondary"}
                  >
                    {isApproved ? "Deposit" : "Approve"}
                  </Button>
                  {/* )} */}
                  {/* {amount === "" ||
              isApproving ||
              !isAllowed ||
              !depositAllowed ? null : (
                <Button
                  disabled={
                    amount === "" ||
                    isApproving ||
                    !isAllowed ||
                    !depositAllowed
                  }
                  isLoading={isStoring || isLoading}
                  onClick={handleDeposit}
                  minW={"10rem"}
                  variant="primary"
                >
                  Deposit
                  <Text fontWeight="light" ml="0.25rem">
                    {amount && `${commify(truncate(amount, 2))} USDC`}
                  </Text>
                </Button>
              )} */}
                  <Button variant={"ghost"} w={"full"} onClick={onClose}>
                    Cancel
                  </Button>
                </Stack>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

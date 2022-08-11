import {
  Alert,
  AlertIcon,
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
  useToast,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { commify, formatUnits, parseUnits } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import { vaultConfigs, vaults } from "../../../contracts";
import { useVaultDeposit, useVaultUser } from "../../hooks/useVault";
import { DangerToast, SuccessToast } from "../../Toasts";
import getErrorMessage from "../../utils/errors";

interface TokenInputProps {
  amount: string;
  setAmount: (amount: string) => void;
  balanceDisplay: string;
  meetsMinimum: boolean;
  depositAllowed: boolean;
  minimumDeposit: any;
}

const TokenInput: React.FC<TokenInputProps> = ({
  amount,
  setAmount,
  balanceDisplay,
  meetsMinimum,
  depositAllowed,
  minimumDeposit,
}) => {
  useEffect(() => {
    console.log({amount});
  }, [amount]);
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
          value={amount}
          // onChange={(e) => setAmount(e.target.value)}
          allowMouseWheel
        >
          <NumberInputField
            onChange={(e) => setAmount(e.target.value.toString())}
            textAlign="right"
          />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>
      <Flex justifyContent={"space-between"}>
        <Flex>
          <Text fontSize="sm" mr={2}>
            Balance: {balanceDisplay} USDC
          </Text>
          <Button
            onClick={() => setAmount(balanceDisplay)}
            size="sm"
            variant={"link"}
          >
            Max
          </Button>
        </Flex>
        <Text fontSize="sm" textAlign={"right"}>
          {balanceDisplay} USDC
        </Text>
      </Flex>
      <Progress size={"xs"} borderRadius="full" />
      {+amount > +balanceDisplay && (
        <Text fontSize="xs" color={"red"}>
          Exceeds wallet balance
        </Text>
      )}
      {!meetsMinimum || (!depositAllowed && amount !== "") ? (
        <Alert borderRadius={"1rem"} status="error">
          <AlertIcon />
          Minimum deposit is{" "}
          {minimumDeposit.data
            ? commify(
                ~~formatUnits(
                  BigNumber.from(minimumDeposit!.data!._hex!).toNumber(),
                  6
                )
              )
            : "25,000"}{" "}
          USDC
        </Alert>
      ) : null}
    </Stack>
  );
};

interface DepositButtonProps {
  depositSuccess: boolean;
  setDepositSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DepositButton: React.FC<DepositButtonProps> = ({
  depositSuccess,
  setDepositSuccess,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [amount, setAmount] = useState<string>("");
  const toast = useToast();
  const { chain } = useNetwork();
  const [contractConfig, setContractConfig] = useState<any>();

  //CONTRACT READ FOR DEPOSIT FUNCTIONS
  const {
    balanceDisplay,
    approve,
    isApproving,
    isAllowed,
    storeAsset,
    isStoring,
    storeAssetError,
    approveError,
    approveStatus,
    storeAssetStatus,
    depositData,
  } = useVaultDeposit(contractConfig, amount === "" ? "0" : amount);

  const { address } = useAccount();

  // GETS CONTRACT CONFIG FROM VAULTS
  useEffect(() => {
    vaults[chain!.id].map((contract) => {
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
    if (approveError && approveStatus === "error") {
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
  }, [approveError, approveStatus, toast]);

  useEffect(() => {
    if (approveStatus === "success") {
      toast({
        variant: "success",
        duration: 5000,
        position: "bottom",
        render: () => (
          <SuccessToast message={`You have approved ${amount} USDC`} />
        ),
      });
    }
  }, [approveStatus]);

  // HANDLES DEPOSIT function on button click
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

  // CHECKS DEPOSIT TXN UNTIL IT SUCCEEDS
  const { isLoading } = useWaitForTransaction({
    hash: typeof depositData?.hash === "string" ? depositData?.hash : "",
    enabled: typeof depositData?.hash === "string",
    // onSuccess never fails
    //https://github.com/wagmi-dev/wagmi/discussions/428
    onSuccess: (data) => {
      if (data.status === 1) {
        setDepositSuccess(true);
      }
    },
  });

  useEffect(() => {
    if (depositSuccess) {
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
  }, [depositSuccess]);

  //VAULT CONTRAG CONFIG
  const vaultConfig = vaultConfigs[chain!.id][0];

  //CAN DEPOSIT / DEPOSIT ALLOWED - checks whether user meets the criteria (has enough REFI tokens, has deposited 25K before)
  const canDeposit = useContractRead({
    ...vaultConfig,
    functionName: "canDeposit",
    args: [address, parseUnits(amount === "" ? "0" : amount, 6)],
  });
  const depositAllowed = canDeposit.data?.toString() === "true";

  //MINIMUM DEPOSIT - fetches minimum deposit amount for users who have not deposited before
  const minimumDeposit = useContractRead({
    ...vaultConfig,
    functionName: "minimumStoredValueBeforeFees",
  });
  const meetsMinimum =
    +amount >=
    (minimumDeposit.data!
      ? +formatUnits(BigNumber.from(minimumDeposit?.data?._hex!).toNumber(), 6)
      : 25000);

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
              <TokenInput
                amount={amount}
                setAmount={setAmount}
                balanceDisplay={balanceDisplay}
                depositAllowed={depositAllowed}
                meetsMinimum={meetsMinimum}
                minimumDeposit={minimumDeposit}
              />
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
                            {balanceDisplay} USDC
                          </Text>
                          <Button
                            onClick={() => setAmount(balanceDisplay)}
                            variant={"link"}
                            size="xs"
                          >
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
              <Button
                isDisabled={
                  +amount + totalDeposited < 25000 ||
                  isApproving ||
                  canDeposit.isLoading
                }
                isLoading={isApproving}
                onClick={handleApprove}
                w={"full"}
              >
                Approve
              </Button>
              <Button
                disabled={
                  amount === "" || isApproving || !isAllowed || !depositAllowed
                }
                isLoading={isStoring || isLoading}
                onClick={handleDeposit}
                minW={"10rem"}
                variant="primary"
              >
                Deposit
                <Text fontWeight="light" ml="0.25rem">
                  {amount && `${amount} USDC`}
                </Text>
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

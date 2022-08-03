import { useEffect, useState } from "react";

import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorMode,
  useToast,
  VStack,
} from "@chakra-ui/react";

//Wagmi
import {
  useAccount,
  useContractRead,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";

//Vaults
import { vaultConfigs, vaults } from "../../../contracts";
import { useVaultDeposit, useVaultUser } from "../../hooks/useVault";
import { DangerToast, SuccessToast } from "../../Toasts";
import getErrorMessage from "../../utils/errors";

//Tools
import { parseUnits, formatUnits, commify } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { truncate } from "../../utils/stringsAndNumbers";

type ModalProps = {
  onClose?: () => void;
  isOpen?: boolean;
  depositSuccess: boolean;
  setDepositSuccess: any;
};

export default function DepositModal({
  isOpen,
  onClose,
  depositSuccess,
  setDepositSuccess,
}: ModalProps) {
  const { colorMode } = useColorMode();
  const { chain } = useNetwork();
  const { address } = useAccount();

  const [contractConfig, setContractConfig] = useState<any>();
  const [amount, setAmount] = useState<string>("");

  const {
    balanceDisplay,
    approve,
    isApproving,
    isAllowed,
    storeAsset,
    isStoring,
    approveMax,
    isApprovingMax,
    approveMaxError,
    storeAssetError,
    approveError,
    approveStatus,
    approveMaxStatus,
    storeAssetStatus,
    depositData,
  } = useVaultDeposit(contractConfig, amount === "" ? "0" : amount);

  const { totalDeposited } = useVaultUser(contractConfig, address ?? "");

  const toast = useToast();

  useEffect(() => {
    console.log("approveMaxError: ", approveMaxError);
    if (approveMaxError && approveMaxStatus === "error") {
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
  }, [approveMaxError, approveMaxStatus, toast]);

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
    vaults[chain!.id].map((contract) => {
      setContractConfig(contract);
      console.log("contract", contract);
    });
  }, [chain, vaults]);

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

  const handleApproveMax = async () => {
    await approveMax();
  };

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
  const vaultConfig = vaultConfigs[chain!.id][0];
  const canDeposit = useContractRead({
    ...vaultConfig,
    functionName: "canDeposit",
    args: [address, parseUnits(amount === "" ? "0" : amount, 6)],
  });
  const userAllowed = canDeposit.data?.toString() === "true";

  const minimumDeposit = useContractRead({
    ...vaultConfig,
    functionName: "minimumStoredValueBeforeFees",
  });
  const meetsMinimum = +amount >= +formatUnits(BigNumber.from(minimumDeposit?.data!._hex).toNumber(), 6);

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
                    isInvalid={+amount > +balanceDisplay}
                    border="none"
                    _focus={{
                      border: "none",
                      boxShadow: +amount > +balanceDisplay && "brand",
                    }}
                    _active={{
                      border: "none",
                      boxShadow: +amount > +balanceDisplay && "brand",
                    }}
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
              {+amount > +balanceDisplay && (
                <Alert borderRadius={"1rem"} status="error">
                  <AlertIcon />
                  Amount exceeds your balance
                </Alert>
              )}
              {!meetsMinimum && amount !== "" ? (
                <Alert borderRadius={"1rem"} status="error">
                <AlertIcon />
                  Minimum deposit is {(commify(~~formatUnits(BigNumber.from(minimumDeposit?.data!._hex).toNumber(), 6)))} USDC
                </Alert>
              ) : null}
            </VStack>
            {amount !== "" && (
              <>
              {!isAllowed && <Flex
                my={7}
                gap={3}
                alignItems="center"
                w="full"
                flexDir="column"
              >
                <Button
                  w="full"
                  p={3}
                  borderRadius="xl"
                  variant="tertiary"
                  isDisabled={
                    +amount + totalDeposited < 25000 ||
                    isApproving ||
                    canDeposit.isLoading
                  }
                  isLoading={isApproving}
                  onClick={handleApprove}
                >
                  Allow REFI to use your USDC
                </Button>
                {/* <Button w='full' p={3} borderRadius='xl'
                variant='secondary'
                  isDisabled={+amount <= 0 || isApproving}
                  isLoading={isApprovingMax}
                  onClick={handleApproveMax}
                >
                  Allow REFI to use your MAX USDC
                </Button> */}
              </Flex>}
              </>
            )}
            <Button
              disabled={
                amount === "" || isApproving || isApprovingMax || !isAllowed || !userAllowed
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
            <Text
              textAlign={"center"}
              variant="small"
              color={colorMode === "dark" ? "#A0A0A0" : "#6F6F6F"}
            >
              <b>NOTE:</b> You will need to allow REFI to use your USDC before
              depositting.
            </Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

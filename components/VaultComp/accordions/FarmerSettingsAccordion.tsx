import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
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
  SkeletonText,
  Spacer,
  Stack,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { commify } from "ethers/lib/utils";
import { formatUnits, parseUnits } from 'viem';
import { truncate } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { useContractWrite } from "wagmi";
import { useVaultMeta } from "../../hooks/useVault";
import DepositForModal from "../modals/DepositForModal";
import { EndEpochModal } from "../modals/EndEpochModal";

export const FarmerSettingsAccordion = ({ contractConfig }: any) => {
  const { colorMode } = useColorMode();
  const meta = useVaultMeta(contractConfig);

  // console.log(meta);

  const aumCapModal = useDisclosure();
  const startVaultModal = useDisclosure();
  const aumCapAlert = useDisclosure();
  const cancelUpdateAumCapRef = useRef(null);

  const endEpoch = useDisclosure();

  const [aumCap, setAumCap] = useState("0");
  const { isLoading: isUpdatingAumCap, write: updateAumCap } = useContractWrite(
    {
      ...contractConfig,
      functionName: "updateAumCap",
      args: [parseUnits(aumCap ?? 0, meta.assetToken.data?.decimals!)],
      mode: "recklesslyUnprepared",
    }
  );

  const minVaultCap = useMemo(() => {
    return truncate(
      formatUnits(
       BigInt(Number(meta.aumCap.data ?? "0") - Number(meta.maxDeposit.data ?? "0")) ?? BigInt(0),
        meta.assetToken.data?.decimals!
      )
    );
  }, [meta.aumCap.data, meta.assetToken.data, meta.maxDeposit.data]);
  useEffect(() => {
    setAumCap(minVaultCap);
  }, [minVaultCap]);
  const aumCapString = formatUnits(meta.aumCap?.data ?? 0, 6).toString();

  const depositFor = useDisclosure();
  return (
    <>
      <Accordion
        borderRadius="1rem"
        mt="1rem"
        allowToggle
        border="solid 1px red"
      >
        <AccordionItem border="none">
          <AccordionButton
            borderRadius="1rem"
            justifyItems="space-between"
            justifyContent="space-between"
          >
            <Heading variant="medium">Farmer Settings</Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel
            borderRadius="1rem"
            bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"}
          >
            <Flex alignItems={"center"}>
              <Text variant="medium">Stored Fee</Text>
              <Spacer />
              {meta.storedFee.isLoading ? (
                <SkeletonText />
              ) : (
                <Text>
                  {truncate(
                    commify(
                      formatUnits(
                        meta.storedFee.data?.toString() ?? "0",
                        meta.assetToken.data?.decimals ?? 6
                      )
                    )
                  )}{" "}
                  {meta.assetToken.data?.symbol}
                </Text>
              )}
            </Flex>
            <Stack>
              <Button w="full" variant="secondary" disabled>
                Send Fee to Distributor
              </Button>

              <Button w="full" variant="secondary" disabled>
                Update Fee Settings
              </Button>
              <Button
                w="full"
                variant="secondary"
                onClick={depositFor.onToggle}
              >
                Deposit For
              </Button>
              <Button
                w="full"
                variant="secondary"
                onClick={aumCapModal.onToggle}
              >
                Update AUM Cap
              </Button>
              <Button
                w="full"
                variant="primary"
                onClick={() => {
                  endEpoch.onToggle();
                }}
              >
                End Epoch {meta.epoch.data && meta.epoch.data.toString()}
              </Button>
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      {endEpoch.isOpen && (
        <EndEpochModal disclosure={endEpoch} contractConfig={contractConfig} />
      )}
      {depositFor.isOpen && (
        <DepositForModal
          isOpen={depositFor.isOpen}
          onClose={depositFor.onClose}
          depositSuccess={false}
          setDepositSuccess={() => undefined}
        />
      )}
      <Modal
        isOpen={aumCapModal.isOpen}
        onClose={aumCapModal.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Aum Cap</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack w="full">
              <Flex alignItems={"center"}>
                <Text variant="medium">Current Vault Capacity</Text>
                <Spacer />
                <Text variant="medium">
                  {commify(
                    formatUnits(
                      BigInt(meta.aumCap.data?.toString() ?? "0"),
                      meta.assetToken.data?.decimals!
                    )
                  )}{" "}
                  USDC
                </Text>
              </Flex>
              <Flex alignItems={"center"}>
                <Text variant="medium">Minimum Vault Capacity</Text>
                <Spacer />
                <Text variant="medium">
                  {truncate(commify(minVaultCap))} USDC
                </Text>
              </Flex>
              <FormControl>
                <FormLabel>New Vault Capacity (USDC)</FormLabel>
                <NumberInput
                  m={0}
                  w="full"
                  onChange={(value) =>
                    value ? setAumCap(value.replace(/[^0-9\.]/g, "")) : 0
                  }
                  value={aumCap}
                  precision={2}
                  step={1}
                  min={+minVaultCap}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Stack w="full">
              <Button
                w="full"
                variant={"primary"}
                colorScheme="red"
                disabled={+aumCap == +aumCapString}
                onClick={() => {
                  aumCapAlert.onOpen();
                }}
                isLoading={isUpdatingAumCap}
              >
                Change AUM Cap
              </Button>
              <Button w="full" variant={"ghost"} onClick={aumCapModal.onClose}>
                Close
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={aumCapAlert.isOpen}
        leastDestructiveRef={cancelUpdateAumCapRef}
        onClose={aumCapAlert.onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Update Vault Capacity
            </AlertDialogHeader>

            <AlertDialogBody>
              <Stack textAlign={"center"}>
                <Text>
                  This action will{" "}
                  {+aumCap > +aumCapString ? "increase" : "decrease"} Vault
                  capacity from
                </Text>
                <HStack justifyContent={"space-around"}>
                  <Text>{commify(aumCapString)} USDC</Text>
                  <ArrowForwardIcon />
                  <Text fontWeight={"bold"}>{commify(aumCap)} USDC</Text>
                </HStack>
              </Stack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelUpdateAumCapRef} onClick={aumCapAlert.onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                variant={"primary"}
                isLoading={isUpdatingAumCap}
                onClick={() => {
                  updateAumCap?.();
                }}
                ml={3}
              >
                Update
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default FarmerSettingsAccordion;

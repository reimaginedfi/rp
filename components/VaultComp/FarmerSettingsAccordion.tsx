import { ArrowForwardIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Heading,
  AccordionIcon,
  AccordionPanel,
  Flex,
  Spacer,
  SkeletonText,
  useColorMode,
  Text,
  Link,
  Button,
  Stack,
  useDisclosure,
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
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  FormControl,
  FormLabel,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { commify, formatUnits, parseUnits } from "ethers/lib/utils";
import { truncate } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { useContractWrite } from "wagmi";
import { useVaultMeta } from "../hooks/useVault";

export const FarmerSettingsAccordion = ({ contractConfig }: any) => {
  const { colorMode } = useColorMode();
  const meta = useVaultMeta(contractConfig);

  const aumCapModal = useDisclosure();
  const aumCapAlert = useDisclosure();
  const cancelUpdateAumCapRef = useRef(null);

  const [aumCap, setAumCap] = useState("0");
  const { isLoading: isUpdatingAumCap, write: updateAumCap } = useContractWrite(
    {
      ...contractConfig,
      functionName: "updateAumCap",
      args: [parseUnits(aumCap, meta.assetToken.data?.decimals)],
    }
  );

  const minVaultCap = useMemo(() => {
    return truncate(
      formatUnits(
        BigNumber.from(meta.aumCap.data ?? "0")
          .sub(meta.maxDeposit.data ?? "0")
          .toString() ?? "0",
        meta.assetToken.data?.decimals
      )
    );
  }, [meta.aumCap.data, meta.assetToken.data, meta.maxDeposit.data]);
  useEffect(() => {
    setAumCap(minVaultCap);
  }, [minVaultCap]);
  const aumCapString = formatUnits(meta.aumCap?.data ?? 0, 6).toString();
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
              <Text variant="medium">Stored Fees</Text>
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
              <Button w="full" variant="secondary">
                Claim Fees
              </Button>

              <Button w="full" variant="secondary">
                Update Fee Settings
              </Button>
              <Button
                w="full"
                variant="secondary"
                onClick={aumCapModal.onToggle}
              >
                Update AUM Cap
              </Button>
              <Button w="full" variant="primary">
                End Epoch {meta.epoch.data && meta.epoch.data.toString()}
              </Button>
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
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
                      meta.aumCap.data?.toString() ?? "0",
                      meta.assetToken.data?.decimals
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
                  updateAumCap();
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

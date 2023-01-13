import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  SkeletonText,
  Flex,
  Heading,
  Spacer,
  Text,
  Link,
  useColorMode,
} from "@chakra-ui/react";

import { commify } from "ethers/lib/utils";
import { truncate } from "../../utils/stringsAndNumbers";

import { useContractRead } from "wagmi";
import { useVaultMeta } from "../../hooks/useVault";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { ContractConfig } from "../../../contracts";

type VaultProps = {
  currentAum: string;
  aumCap: string;
  contractConfig: ContractConfig;
};

export default function VaultDetailsAccordion({
  aumCap,
  contractConfig,
}: VaultProps) {
  const { colorMode } = useColorMode();

  const feeReceiver = useContractRead({
    ...contractConfig,
    functionName: "feeDistributor",
    watch: true,
  });

  const { assetToken, farmer } = useVaultMeta(contractConfig);

  return (
    <Accordion borderRadius="1rem" pt="1rem" allowToggle border="none">
      <AccordionItem border="none">
        <AccordionButton
          borderRadius="1rem"
          justifyItems="space-between"
          justifyContent="space-between"
        >
          <Heading variant="medium">Vault Details</Heading>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel
          borderRadius="1rem"
          bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"}
        >
          <Flex alignItems={"center"}>
            <Text variant="medium">Deposit Fee</Text>
            <Spacer />
            {feeReceiver.isLoading ? (
              <SkeletonText />
            ) : (
              <Text variant="medium">2%</Text>
            )}
          </Flex>
          <Flex alignItems={"center"}>
            <Text variant="medium">Withdraw Fee</Text>
            <Spacer />
            {feeReceiver.isLoading ? (
              <SkeletonText />
            ) : (
              <Text variant="medium">0%</Text>
            )}
          </Flex>
          <Flex alignItems={"center"}>
            <Text variant="medium">Performance Fee (of profits)</Text>
            <Spacer />
            {feeReceiver.isLoading ? (
              <SkeletonText />
            ) : (
              <Text variant="medium">20%</Text>
            )}
          </Flex>
          <Flex alignItems={"center"}>
            <Text variant="medium">Minimum Size</Text>
            <Spacer />
            {feeReceiver.isLoading ? (
              <SkeletonText />
            ) : (
              <Text variant="medium">25,000.00 USDC</Text>
            )}
          </Flex>
          <Flex alignItems={"center"}>
            <Text variant="medium">Vault Capacity</Text>
            <Spacer />
            {feeReceiver.isLoading ? (
              <SkeletonText />
            ) : (
              <Text variant="medium">
                {truncate(commify(aumCap.toString()), 1)} USDC
              </Text>
            )}
          </Flex>

          <Flex alignItems={"center"}>
            <Text variant="medium">Farmer Address</Text>
            <Spacer />
            {farmer.isLoading ? (
              <SkeletonText />
            ) : (
              <Link
                href={`https://etherscan.io/address/${farmer.data}`}
                isExternal
              >
                <Text variant="medium">
                  {`${farmer.data?.slice(0, 8)}...${farmer.data?.slice(-2)}`}{" "}
                  <ExternalLinkIcon mx="2px" />
                </Text>
              </Link>
            )}
          </Flex>
          <Flex alignItems={"center"}>
            <Text variant="medium">Fee Receiver</Text>
            <Spacer />
            {feeReceiver.isLoading ? (
              <SkeletonText />
            ) : (
              <Link
                href={`https://etherscan.io/address/${feeReceiver.data}`}
                isExternal
              >
                <Text variant="medium">
                  {`${feeReceiver.data?.slice(
                    0,
                    8
                  )}...${feeReceiver.data?.slice(-2)}`}{" "}
                  <ExternalLinkIcon mx="2px" />
                </Text>
              </Link>
            )}
          </Flex>
          <Flex alignItems={"center"}>
            <Text variant="medium">Asset Address</Text>
            <Spacer />
            {assetToken.isLoading ? (
              <SkeletonText />
            ) : (
              <Link
                href={`https://etherscan.io/address/${assetToken.data?.address}`}
                isExternal
              >
                <Text variant="medium">
                  {`${assetToken.data?.address.slice(
                    0,
                    8
                  )}...${assetToken.data?.address.slice(-2)}`}{" "}
                  <ExternalLinkIcon mx="2px" />
                </Text>
              </Link>
            )}
          </Flex>
          <Flex alignItems={"center"}>
            <Text variant="medium">Contract Address</Text>
            <Spacer />
            {farmer.isLoading ? (
              <SkeletonText />
            ) : (
              <Link
                href={`https://etherscan.io/address/${contractConfig.addressOrName}`}
                isExternal
              >
                <Text variant="medium">
                  {`${contractConfig.addressOrName.slice(
                    0,
                    8
                  )}...${contractConfig.addressOrName.slice(-2)}`}{" "}
                  <ExternalLinkIcon mx="2px" />
                </Text>
              </Link>
            )}
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

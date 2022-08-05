import {
  Badge,
  Flex,
  GridItem,
  Heading,
  Skeleton,
  Spinner,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { formatUnits, commify } from "ethers/lib/utils";
import {truncate} from "../utils/stringsAndNumbers";
import { useBlockNumber } from "wagmi";
import { useVaultState } from "../hooks/useVault";
import { useCompleteAum } from "../Vault/hooks/usePreviewAum";
import VaultProgressBar from "./VaultProgressBar";

export const VaultHeroLeft = () => {
  // VAULT META DATA - used to display vault info
  const { epoch, aum, aumCap, previewAum, rawGains, factor } = useCompleteAum();

  // VAULT CONTRACT - fetches current vault state
  const vaultState = useVaultState(BigNumber.from(epoch.data ?? 0).toNumber());

  // MANAGEMENT BLOCK - 
  const lastManagementBlock = BigNumber.from(
    vaultState.data?.lastManagementBlock ?? 0
  ).toNumber();

  // CURRENT CHAIN BLOCK - to calculate against management block
  const blockNumber = useBlockNumber({
    watch: true,
  });

  if (
    vaultState.isLoading ||
    blockNumber.isLoading ||
    epoch.isLoading ||
    aumCap.isLoading
  ) {
    return (
      <GridItem display={"grid"} placeContent="center">
        <Spinner />
      </GridItem>
    );
  }

  if (aumCap.data?.toString() === "0.0") {
    return (
      <GridItem>
        {" "}
        <Flex justify="center" align="center">
          <Heading
            variant="medium"
            textAlign="center"
            color="brand"
            lineHeight="1.5rem"
          >
            This Vault is being initialized
          </Heading>
        </Flex>
      </GridItem>
    );
  }

  if (lastManagementBlock > (blockNumber.data ?? 0)) {
    return (
      <GridItem justifyContent={"center"}>
        <Badge colorScheme="orange" variant={"outline"}>
          Validating
        </Badge>
        <Text mt={4}>Vault will reopen at block {lastManagementBlock}</Text>
        <Stack pt={4}>
          <VaultProgressBar
            color="orange"
            currentAum={(blockNumber.data ?? 0) - lastManagementBlock + 6000}
            aumCap={6000}
            remainingDeposits={undefined}
          />
          <Text>
            {lastManagementBlock - blockNumber.data!} blocks remaining
          </Text>
        </Stack>
      </GridItem>
    );
  }

  return (
    <GridItem justifySelf="center" textAlign="center">
      <Badge colorScheme="green" variant={"outline"}>
        Running
      </Badge>
      <Stat mt={"0.5rem"}>
        <Skeleton isLoaded={!previewAum.isValidating && !aum.isLoading}>
          <StatNumber>{((factor - 1) * 100).toFixed(2)}%</StatNumber>
        </Skeleton>
        <Skeleton isLoaded={!previewAum.isValidating && !aum.isLoading}>
          <StatHelpText>
            <StatArrow type={rawGains.isNegative() ? "decrease" : "increase"} />
            {truncate(commify(formatUnits(rawGains.abs().toString(), 6)), 2)} USDC
          </StatHelpText>
        </Skeleton>
      </Stat>
      <Text
        style={{
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          WebkitBackgroundClip: "text",
        }}
        bg="radial-gradient(136.45% 135.17% at 9.91% 100%, #FF3F46 0%, #FF749E 57.68%, #FFE3AB 100%)"
        fontSize="24px"
        fontWeight={700}
      >
        EPOCH {epoch.data?.toString()}
      </Text>
    </GridItem>
  );
};

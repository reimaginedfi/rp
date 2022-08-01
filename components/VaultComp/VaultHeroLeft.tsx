import {
  Badge,
  Flex,
  GridItem,
  Heading,
  Spinner,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  StatNumber,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useBlockNumber } from "wagmi";
import { useVaultMeta, useVaultState } from "../hooks/useVault";
import { useContractConfig } from "../Vault";
import VaultProgressBar from "./VaultProgressBar";

export const VaultHeroLeft = () => {
  const contractConfig = useContractConfig();
  const { assetToken, aum, epoch, aumCap, vaultName } =
    useVaultMeta(contractConfig);

  const vaultState = useVaultState(BigNumber.from(epoch.data ?? 0).toNumber());
  const lastManagementBlock = BigNumber.from(
    vaultState.data?.lastManagementBlock ?? 0
  ).toNumber();
  const blockNumber = useBlockNumber({
    watch: true,
  });

  const { colorMode } = useColorMode();

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
    <GridItem>
      <Badge colorScheme="green" variant={"outline"}>
        Running
      </Badge>

      <Stat mt={"1rem"}>
        <StatNumber>+0.00%</StatNumber>
        <StatHelpText>
          <StatArrow type="increase" />
          0.00 USDC
        </StatHelpText>
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

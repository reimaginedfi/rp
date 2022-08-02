import { Badge, Flex, Skeleton, Spacer, Text } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { commify, formatUnits } from "ethers/lib/utils";
import { truncate } from "../utils/stringsAndNumbers";
import { useReadVault, useWatchVault } from "../Vault/ContractContext";
import { useVaultAssetToken } from "../Vault/hooks/useVaultAsset";
import VaultProgressBar from "./VaultProgressBar";

// TODO: show pending deposits
const useVaultTruncated = () => {
  const aumResult = useWatchVault("aum");
  const aumCapResult = useWatchVault("aumCap");
  const epochResult = useWatchVault("epoch");
  const assetTokenResult = useVaultAssetToken();

  const vaultState = useReadVault("vaultStates", {
    args: [epochResult.data],
  });

  const isLoading =
    !aumResult.data ||
    !aumCapResult.data ||
    !assetTokenResult.data ||
    !vaultState.data ||
    !epochResult.data;

  const currentAum = isLoading
    ? 0
    : formatUnits(aumResult.data!, assetTokenResult.data?.decimals);

  const aumCap = isLoading
    ? 0
    : formatUnits(aumCapResult.data!, assetTokenResult.data?.decimals);
  const epoch = isLoading ? 0 : BigNumber.from(epochResult.data).toNumber();

  return {
    isLoading,
    currentAum,
    aumCap,
    epoch,
  };
};

export const VaultTruncated = () => {
  const { isLoading, currentAum, aumCap, epoch } = useVaultTruncated();
  if (isLoading) {
    return <Skeleton height={"1rem"} />;
  }
  return (
    <>
      <VaultProgressBar
        currentAum={+currentAum}
        aumCap={+aumCap}
        remainingDeposits={"0"}
      />
      <Flex alignItems={"center"}>
        <Badge colorScheme={"green"} variant="outline">
          Epoch {epoch}
        </Badge>
        <Spacer />
        <Text variant="medium">
          {truncate(commify(+currentAum), 2)}/{truncate(commify(aumCap), 2)}{" "}
          USDC
        </Text>
      </Flex>
    </>
  );
};

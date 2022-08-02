import { Flex, Heading, Skeleton, Text } from "@chakra-ui/react";

import { useVaultAssetToken } from "../Vault/hooks/useVaultAsset";
import { useVaultToken } from "../Vault/hooks/useVaultToken";

// component hooks
const useVaultTitle = () => {
  const vaultToken = useVaultToken();
  const asset = useVaultAssetToken();

  const isLoading = vaultToken.isLoading || asset.isLoading;

  const symbol = asset.data?.symbol;
  // join words, remove "token" if any
  // REFI Pro USDC Vault Token -> REFIProUSDCVault
  const vaultName = vaultToken.data?.name
    ?.split(" ")
    .filter((word: string) => word.toLowerCase() !== "token")
    .join(" ");

  return {
    symbol,
    vaultName,
    isLoading,
  };
};

export const VaultTitle = () => {
  const { vaultName, symbol, isLoading } = useVaultTitle();

  if (isLoading) {
    return (
      <Flex direction="row" alignItems="center">
        <Skeleton />
      </Flex>
    );
  }
  return (
    <Flex direction="row" alignItems="center">
      <Heading variant="large">{vaultName! || "Vault"}</Heading>
      <Text ml="0.5rem" variant="medium">
        ({symbol})
      </Text>
    </Flex>
  );
};

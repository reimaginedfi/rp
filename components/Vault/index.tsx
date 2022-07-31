import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useAccount, useContractRead } from "wagmi";

import { ContractConfig } from "../../contracts";
import { useVaultMeta } from "../hooks/useVault";
import VaultComp from "../VaultComp";

export const Vault = ({
  contractConfig,
}: {
  contractConfig: ContractConfig;
}) => {
  const { address } = useAccount();
  const { assetToken, aum, epoch, farmer, aumCap, vaultName } =
    useVaultMeta(contractConfig);
  const vaultState = useContractRead({
    ...contractConfig,
    functionName: "vaultStates",
    args: [BigNumber.from(epoch.data ?? 0)],
    watch: true,
  });

  const pendingDeposit = formatUnits(
    vaultState.data?.assetsToDeposit ?? 0,
    assetToken.data?.decimals
  );

  return (
    <>
      <VaultComp
        vaultName={vaultName.data
          ?.split(" ")
          .filter((word: string) => word.toLowerCase() !== "token")
          .join("")}
        asset={assetToken?.data?.symbol}
        currentAum={formatUnits(aum.data ?? 0, assetToken.data?.decimals ?? 0)}
        aumCap={formatUnits(aumCap.data ?? 0, assetToken.data?.decimals ?? 0)}
        epoch={epoch.data?.toString()}
        pendingDeposit={pendingDeposit}
        contractConfig={contractConfig}
      />
    </>
  );
};

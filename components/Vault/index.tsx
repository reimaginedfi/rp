import { useToast } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { commify, formatUnits } from "ethers/lib/utils";
import { useContractEvent, useContractRead } from "wagmi";

import { ContractConfig } from "../../contracts";
import { useVaultMeta } from "../hooks/useVault";
import { truncate } from "../utils/stringsAndNumbers";
import VaultComp from "../VaultComp";
import { Contract } from "./ContractContext";

export const Vault = ({
  contractConfig
}: {
  contractConfig: ContractConfig;
}) => {

  //VAULT META DATA - used to display vault info
  const { assetToken, aum, epoch, aumCap, vaultName } =
    useVaultMeta(contractConfig);

  //VAULT CONTRACT - fetches current vault state
  const vaultState = useContractRead({
    ...contractConfig,
    functionName: "vaultStates",
    args: [BigNumber.from(epoch.data ?? 0)],
    watch: true,
  });

  // FETCHES PENDING DEPOSIT AMOUNT
  const pendingDeposit = formatUnits(
    vaultState.data?.assetsToDeposit ?? 0,
    assetToken.data?.decimals
  );

  const toast = useToast();
  useContractEvent({
    ...contractConfig,
    eventName: "UserDeposit",
    listener: (event) => {
      console.log(event);
      toast({
        status: "success",
        title: "Someone just deposited",
        description: `Address ${event[0]} deposited ${commify(
          truncate(formatUnits(event[1], 6), 2)
        )} USDC`,
        duration: 9000,
        isClosable: true,
      });
    },
  });

  return (
    // <PortalContext.Provider value={portalRef}>
    <Contract.Provider value={contractConfig}>
      <VaultComp
        currentAum={formatUnits(aum.data ?? 0, assetToken.data?.decimals ?? 0)}
        aumCap={formatUnits(aumCap.data ?? 0, assetToken.data?.decimals ?? 0)}
        epoch={BigNumber.from(epoch.data ?? 0).toNumber() ?? 0}
        pendingDeposit={pendingDeposit}
        contractConfig={contractConfig}
      />
    </Contract.Provider>
  );
};

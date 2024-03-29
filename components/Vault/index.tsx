import { useToast } from "@chakra-ui/react";
import { commify } from "ethers/lib/utils";
import { formatUnits } from 'viem';
import { useContractEvent, useContractRead } from "wagmi";

import { ContractsMap } from "../../contracts";
import { useVaultMeta } from "../hooks/useVault";
import { truncate } from "../utils/stringsAndNumbers";
import VaultComp from "../VaultComp";
import { Contract } from "./ContractContext";

export const Vault = ({
  contractConfig
}: {
  contractConfig: ContractsMap;
}) => {

  //VAULT META DATA - used to display vault info
  const { assetToken, aum, epoch, aumCap, vaultName } =
    useVaultMeta(contractConfig);

  //VAULT CONTRACT - fetches current vault state
  const vaultState: any = useContractRead({
    ...contractConfig as any,
    functionName: "vaultStates",
    args: [(epoch.data ?? 0)],
    watch: true,
  });

  // FETCHES PENDING DEPOSIT AMOUNT
  const pendingDeposit = formatUnits(
    vaultState!.data?.[1] ?? BigInt(0),
    assetToken.data?.decimals!
  );

  const toast = useToast();
  useContractEvent({
    ...contractConfig as any,
    eventName: "UserDeposit",
    listener: (event) => {
      console.log(event);
      toast({
        status: "success",
        title: "Someone just deposited",
        description: `Address ${event[0]} deposited ${commify(
          truncate(formatUnits(event[1] as any, 6), 2)
        )} USDC`,
        duration: 9000,
        isClosable: true,
      });
    },
  });

  // console.log(pendingDeposit)
  // console.log(Number(epoch.data ?? 0) ?? 0)

  return (
    // <PortalContext.Provider value={portalRef}>
    <Contract.Provider value={contractConfig}>
      <VaultComp
        currentAum={formatUnits(aum!.data ?? 0, assetToken.data?.decimals ?? 0)}
        aumCap={formatUnits(aumCap!.data ?? 0, assetToken.data?.decimals ?? 0)}
        epoch={Number(epoch!.data ?? 0) ?? 0}
        pendingDeposit={pendingDeposit}
        contractConfig={contractConfig}
      />
    </Contract.Provider>
  );
};

import { useToast } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { commify, formatUnits } from "ethers/lib/utils";
import { createContext, useContext } from "react";
import { useContractEvent, useContractRead } from "wagmi";

import { ContractConfig } from "../../contracts";
import { useVaultMeta } from "../hooks/useVault";
import { truncate } from "../utils/stringsAndNumbers";
import VaultComp from "../VaultComp";

export const Contract = createContext(null as ContractConfig | null);

export const useContractConfig = () => {
  const contractConfig = useContext(Contract);
  if (!contractConfig) {
    throw new Error("No contract config provided");
  }
  return contractConfig;
};
// export const PortalContext = createContext(null as Ref<null>);

// can useContext(Contract) to get the contract config
export const Vault = ({
  contractConfig,
}: {
  contractConfig: ContractConfig;
}) => {
  const { assetToken, aum, epoch, aumCap, vaultName } =
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

  // join words, remove "token" if any
  // REFI Pro USDC Vault Token -> REFIProUSDCVault
  const name = vaultName.data
    ?.split(" ")
    .filter((word: string) => word.toLowerCase() !== "token")
    .join("");

  // const portalRef = useRef(null);
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
        vaultName={name}
        asset={assetToken?.data?.symbol}
        currentAum={formatUnits(aum.data ?? 0, assetToken.data?.decimals ?? 0)}
        aumCap={formatUnits(aumCap.data ?? 0, assetToken.data?.decimals ?? 0)}
        epoch={BigNumber.from(epoch.data ?? 0).toNumber() ?? 0}
        pendingDeposit={pendingDeposit}
        contractConfig={contractConfig}
      />
      {/* </PortalContext.Provider> */}
    </Contract.Provider>
  );
};

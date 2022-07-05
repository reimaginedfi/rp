import { useDisclosure } from "@chakra-ui/react";
import { formatUnits } from "ethers/lib/utils";
import {
  etherscanBlockExplorers,
  useAccount,
  useContractRead,
  useNetwork,
  useToken,
} from "wagmi";
import { ContractConfig } from "../../contracts";
import { AsciiText, NewLine } from "../AsciiText";
import { useVaultMeta, useVaultUser } from "../hooks/useVault";
import { InlineButton, InlineTag } from "../InlineButton";
import { VaultAdmin } from "./VaultAdmin";
import { VaultDeposit } from "./VaultDeposit";
import { VaultUnlock } from "./VaultUnlock";
import { VaultUserState } from "./VaultUserState";

export const Vault = ({
  contractConfig,
}: {
  contractConfig: ContractConfig;
}) => {
  // display
  const { onToggle, isOpen } = useDisclosure({
    defaultIsOpen: true,
  });

  const { onToggle: onToggleMeta, isOpen: isOpenMeta } = useDisclosure({
    defaultIsOpen: false,
  });

  // data
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { asset, assetToken, aum, epoch, farmer, aumCap, vaultName } =
    useVaultMeta(contractConfig);

  const isFarmer = address === farmer.data?.toString();

  return (
    <>
      <NewLine />
      <AsciiText>
        contract{" "}
        <InlineTag color="blue" background="unset">
          {vaultName.data
            ?.split(" ")
            .filter((word: string) => word.toLowerCase() !== "token")
            .join("")}
        </InlineTag>{" "}
        {"{"}{" "}
        <InlineButton opacity={0.25} as="button" onClick={onToggle}>
          [{isOpen ? "hide" : "show"}]
        </InlineButton>
      </AsciiText>
      {isOpen && (
        <>
          <AsciiText
            padStart={2}
            as="button"
            width={"fit-content"}
            onClick={onToggleMeta}
            opacity={0.5}
          >
            // ░░{" "}
            <InlineButton>
              [{isOpenMeta ? "hide " : "show "}contract details]
            </InlineButton>{" "}
            ░░
          </AsciiText>
          {isOpenMeta && (
            <>
              <AsciiText padStart={2}>
                asset: {assetToken?.data?.symbol}
              </AsciiText>

              <AsciiText padStart={2}>farmer: {farmer.data}</AsciiText>

              <AsciiText padStart={2}>
                AUM: {formatUnits(aum.data ?? 0)} {assetToken?.data?.symbol}
              </AsciiText>
              <AsciiText padStart={2}>
                cap: {formatUnits(aumCap.data ?? 0)} {assetToken?.data?.symbol}
              </AsciiText>

              <AsciiText padStart={2}>
                epoch: {epoch.data?.toString()}
              </AsciiText>
              <AsciiText padStart={2}>last epoch performance: n/a</AsciiText>
            </>
          )}
        </>
      )}
      {isOpen && (
        <VaultUserState
          contractConfig={contractConfig}
          symbol={assetToken.data?.symbol ?? ""}
        />
      )}
      {isOpen && (
        <VaultDeposit contractConfig={contractConfig} asset={assetToken.data} />
      )}
      {isOpen && <VaultUnlock contractConfig={contractConfig} />}
      {isOpen && isFarmer && <VaultAdmin contractConfig={contractConfig} />}
      {/* }
      {isOpen && <VaultDeposit vault={vault} />}
      {isOpen && <VaultUnlock vault={vault} />}
      {isOpen && isFarmer && <VaultAdmin vault={vault} />} */}

      <AsciiText>{"}"}</AsciiText>
    </>
  );
};

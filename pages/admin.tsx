import { useDisclosure } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import {
  etherscanBlockExplorers,
  useAccount,
  useContractRead,
  useNetwork,
  useToken,
} from "wagmi";
import { ContractConfig } from "../contracts";
import { AsciiText, NewLine } from "../components/AsciiText";
import { useVaultMeta, useVaultUser } from "../components/hooks/useVault";
import { InlineButton, InlineTag } from "../components/InlineButton";
import { VaultAdmin } from "../components/Vault/VaultAdmin";
import { VaultFeeSettings } from "../components/Vault/VaultFeeSettings";

export default function Vault({
  contractConfig,
}: {
  contractConfig: ContractConfig;
}) {
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

              {/* <AsciiText padStart={2}>farmer: {farmer.data}</AsciiText> */}

              <AsciiText padStart={2}>
                AUM:{" "}
                {formatUnits(aum.data ?? 0, assetToken.data?.decimals ?? 0)}(+
                {pendingDeposit}){"/"}
                {formatUnits(
                  aumCap.data ?? 0,
                  assetToken.data?.decimals ?? 0
                )}{" "}
                {assetToken?.data?.symbol}
              </AsciiText>

              <AsciiText padStart={2}>
                epoch: {epoch.data?.toString()}
              </AsciiText>

              <AsciiText padStart={2}>last epoch performance: n/a</AsciiText>
            </>
          )}
        </>
      )}
      {epoch.data?.toString() === "0" && (
        <AsciiText
          padStart={2}
          textColor={"red.900"}
          background={"red.200"}
          opacity={0.5}
        >
          // vault is not yet initialized
        </AsciiText>
      )}

      {isOpen && isFarmer && <VaultAdmin contractConfig={contractConfig} />}

      {isOpen && isFarmer && (
        <VaultFeeSettings contractConfig={contractConfig} />
      )}

      <AsciiText>{"}"}</AsciiText>
    </>
  );
};
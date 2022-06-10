import { useDisclosure } from "@chakra-ui/react";
import { useAccount, useContractRead, useNetwork, useToken } from "wagmi";
import { getVault, StableVaultType } from "../../contracts";
import { AsciiText, NewLine } from "../AsciiText";
import { InlineButton, InlineTag } from "../InlineButton";
import { VaultAdmin } from "./VaultAdmin";
import { VaultDeposit } from "./VaultDeposit";
import { VaultState } from "./VaultState";
import { VaultUnlock } from "./VaultUnlock";
import { VaultUserState } from "./VaultUserState";

export const Vault = ({
  name = "StableVault",
  vault,
  chainName,
}: {
  name?: string;
  vault: StableVaultType;
  chainName: string;
}) => {
  // display
  const { onToggle, isOpen } = useDisclosure({
    defaultIsOpen: true,
  });

  // data
  const { activeChain } = useNetwork();
  const { data: account } = useAccount();
  const { data: farmerAddress } = useContractRead(vault, "farmer");

  const isNotAvailableThisChain = activeChain?.name.toLowerCase() !== chainName;
  const isFarmer = account?.address === farmerAddress?.toString();

  if (isNotAvailableThisChain) {
    return null;
  }
  return (
    <>
      <NewLine />
      <AsciiText>
        contract{" "}
        <InlineTag color="blue" background="unset">
          {name}
        </InlineTag>{" "}
        {"{"}{" "}
        <InlineButton opacity={0.25} as="button" onClick={onToggle}>
          [{isOpen ? "hide" : "show"}]
        </InlineButton>
      </AsciiText>
      {isOpen && <VaultState vault={vault} />}
      {isOpen && <VaultUserState vault={vault} />}
      {isOpen && <VaultDeposit vault={vault} />}
      {isOpen && <VaultUnlock vault={vault} />}
      {isOpen && isFarmer && <VaultAdmin vault={vault} />}

      <AsciiText>{"}"}</AsciiText>

      <NewLine />
      <AsciiText opacity={0.5}>
        contract ETHVault {"{}"} (coming soon)
      </AsciiText>
    </>
  );
};

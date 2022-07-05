import { useAccount, useNetwork } from "wagmi";
import { vaults } from "../contracts";
import { AsciiConnectButton } from "./AsciiConnectButton";
import { AsciiText, NewLine } from "./AsciiText";
import { Vault } from "./Vault";

const WalletNotConnectedComponent = () => {
  return (
    <>
      <NewLine />
      <AsciiText>// connect wallet to see vaults</AsciiText>
    </>
  );
};

const VaultList = () => {
  const { chain } = useNetwork();

  if (chain && chain?.id in vaults) {
    return (
      <>
        {vaults[chain.id].map((contractConfig) => (
          <Vault
            key={contractConfig.addressOrName}
            contractConfig={contractConfig}
          />
        ))}
      </>
    );
  }
  return (
    <>
      <AsciiText opacity={0.5}>//</AsciiText>
      <AsciiText opacity={0.5}>// No vaults found in this chain</AsciiText>
    </>
  );
};

export const PageContent = () => {
  const { isConnected } = useAccount();

  return (
    <>
      <AsciiConnectButton />
      <NewLine />
      <AsciiText opacity={0.5}>// ███████ Vaults ██████████████</AsciiText>
      {isConnected ? <VaultList /> : <WalletNotConnectedComponent />}
    </>
  );
};

export default PageContent;

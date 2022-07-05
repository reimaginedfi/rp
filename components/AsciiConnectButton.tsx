import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useFeeData } from "wagmi";
import { AsciiText } from "./AsciiText";
import { InlineButton } from "./InlineButton";

export const AsciiConnectButton = () => {
  const { data: fees } = useFeeData({ watch: true });
  return (
    <>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          if (!mounted || !account || !chain) {
            return (
              <AsciiText
                as="button"
                onClick={() => openConnectModal()}
                width={"fit-content"}
              >
                // <InlineButton color={"blue"}>[connect wallet]</InlineButton>
              </AsciiText>
            );
          }
          if (chain.unsupported) {
            return (
              <AsciiText
                as="button"
                onClick={() => openChainModal()}
                width={"fit-content"}
              >
                // unsupported chain.{" "}
                <InlineButton color={"blue"}>[switch]</InlineButton>
              </AsciiText>
            );
          }
          return (
            <>
              <AsciiText
                width={"fit-content"}
                onClick={() => {
                  openAccountModal();
                }}
                as="button"
              >
                // connected to:{" "}
                <InlineButton color={"blue"}>
                  [
                  {`${account.address.slice(0, 4)}...${account.address.slice(
                    -4
                  )}`}
                  ]
                </InlineButton>
              </AsciiText>
              <AsciiText>// balance: {account.displayBalance}</AsciiText>
              <AsciiText
                width={"fit-content"}
                as="button"
                onClick={() => {
                  openChainModal();
                }}
              >
                // chain:{" "}
                <InlineButton color={"blue"}>[{chain.name}]</InlineButton>
              </AsciiText>
              <AsciiText width={"fit-content"}>
                {`// gas: ${
                  fees &&
                  formatUnits(BigNumber.from(fees.formatted.gasPrice), "gwei")
                }`}{" "}
                gwei
              </AsciiText>
            </>
          );
        }}
      </ConnectButton.Custom>
    </>
  );
};

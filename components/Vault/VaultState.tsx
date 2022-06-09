import { useDisclosure } from "@chakra-ui/react";
import { FetchTokenResult } from "@wagmi/core";
import { BigNumber } from "ethers";
import { useContractRead, useToken } from "wagmi";
import { StableVaultType } from "../../contracts";
import { AsciiText } from "../AsciiText";
import { InlineButton } from "../InlineButton";

export const VaultState = ({ vault }: { vault: StableVaultType }) => {
  // display
  const { onToggle, isOpen } = useDisclosure();
  // data
  const { data: assetAddress } = useContractRead(vault, "asset");
  const { data: assetToken } = useToken({
    address: assetAddress?.toString(),
  });
  const { data: aumB } = useContractRead(vault, "aum");
  const aum = BigNumber.isBigNumber(aumB)
    ? BigNumber.from(aumB).toString()
    : "0";
  const { data: epochB } = useContractRead(vault, "epoch");
  const epoch = BigNumber.isBigNumber(epochB)
    ? BigNumber.from(epochB).toString()
    : "0";
  return (
    <>
      <AsciiText
        padStart={2}
        as="button"
        width={"fit-content"}
        onClick={onToggle}
        opacity={0.5}
      >
        //{" "}
        <InlineButton>
          [{isOpen ? "hide " : "show "}contract details]
        </InlineButton>
      </AsciiText>
      {isOpen && (
        <>
          <AsciiText padStart={2}>asset: {assetToken?.symbol}</AsciiText>
          <AsciiText padStart={2}>cap: infinite</AsciiText>
          <AsciiText padStart={2}>
            aum: {aum} {assetToken?.symbol}
          </AsciiText>
          <AsciiText padStart={2}>epoch: {epoch}</AsciiText>
          <AsciiText padStart={2}>last epoch performance: +0%</AsciiText>
        </>
      )}
    </>
  );
};

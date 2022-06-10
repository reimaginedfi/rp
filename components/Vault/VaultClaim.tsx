import { formatUnits } from "ethers/lib/utils";
import { useAccount, useContractRead, useContractWrite, useToken } from "wagmi";
import { StableVaultType } from "../../contracts";
import { AsciiText } from "../AsciiText";
import { InlineButton } from "../InlineButton";

export const VaultClaim = ({ vault }: { vault: StableVaultType }) => {
  const { data: account } = useAccount();
  const { data: assetAddress } = useContractRead(vault, "asset");
  const { data: assetToken } = useToken({
    address: assetAddress?.toString(),
  });

  const { data: withdrawableB } = useContractRead(vault, "previewClaim", {
    args: [account?.address],
  });

  const { write: claim } = useContractWrite(vault, "claimAsset");
  return (
    <>
      <AsciiText padStart={2}>
        withdrawable balance: {formatUnits(withdrawableB ?? 0)}{" "}
        {assetToken?.symbol} (before fees)
      </AsciiText>
      <AsciiText padStart={2}>
        // <InlineButton onClick={() => claim()}>[Withdraw]</InlineButton>
      </AsciiText>
    </>
  );
};

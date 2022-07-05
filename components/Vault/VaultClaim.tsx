import { formatUnits } from "ethers/lib/utils";
import { useAccount, useContractRead, useContractWrite, useToken } from "wagmi";
import { ContractConfig } from "../../contracts";
import { AsciiText } from "../AsciiText";
import { useVaultMeta } from "../hooks/useVault";
import { InlineButton } from "../InlineButton";

export const VaultClaim = ({
  contractConfig,
}: {
  contractConfig: ContractConfig;
}) => {
  const { address } = useAccount();
  const { assetToken } = useVaultMeta(contractConfig);

  const withdrawable = useContractRead({
    ...contractConfig,
    functionName: "previewClaim",
    args: [address],
  });

  const { write: claim } = useContractWrite({
    ...contractConfig,
    functionName: "claimAsset",
  });
  return (
    <>
      <AsciiText padStart={2}>
        withdrawable balance: {formatUnits(withdrawable.data ?? 0)}{" "}
        {assetToken.data?.symbol} (before fees)
      </AsciiText>
      <AsciiText padStart={2}>
        // <InlineButton onClick={() => claim()}>[Withdraw]</InlineButton>
      </AsciiText>
    </>
  );
};

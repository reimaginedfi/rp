import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useAccount, useContractRead, useToken } from "wagmi";
import { ContractConfig } from "../../contracts";
import { AsciiText, NewLine } from "../AsciiText";
import { useVaultMeta, useVaultUser } from "../hooks/useVault";

export const VaultUserState = ({
  contractConfig,
  symbol,
}: {
  contractConfig: ContractConfig;
  symbol: string;
}) => {
  // data
  const { address } = useAccount();
  const { assetToken } = useVaultMeta(contractConfig);
  const { user, sharesValue, hasPendingDeposit } = useVaultUser(
    contractConfig,
    address ?? ""
  );

  return (
    <>
      <AsciiText padStart={1} />
      <AsciiText padStart={2} opacity={0.5}>
        // ░░ your stats ░░░░░░░░░░░░░░░
      </AsciiText>
      <AsciiText padStart={2}>
        stored value:{" "}
        {formatUnits(sharesValue.data ?? 0, assetToken.data?.decimals ?? 0)}{" "}
        {symbol}
      </AsciiText>
      <AsciiText padStart={2}>
        has pending deposit: {hasPendingDeposit.data ? "true" : "false"}
      </AsciiText>

      <AsciiText padStart={2}>
        total deposited:{" "}
        {formatUnits(
          BigNumber.from(user.data?.[0] ?? 0).add(sharesValue.data ?? 0),
          assetToken.data?.decimals ?? 0
        )}{" "}
        {symbol}
      </AsciiText>
      <AsciiText padStart={2} opacity={0.5}>
        // total withdrawn: 0.0 {symbol}
      </AsciiText>
    </>
  );
};

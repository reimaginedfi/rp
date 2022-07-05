import { formatUnits } from "ethers/lib/utils";
import { useAccount, useContractRead, useToken } from "wagmi";
import { ContractConfig } from "../../contracts";
import { AsciiText, NewLine } from "../AsciiText";
import { useVaultUser } from "../hooks/useVault";

export const VaultUserState = ({
  contractConfig,
  symbol,
}: {
  contractConfig: ContractConfig;
  symbol: string;
}) => {
  // data
  const { address } = useAccount();
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
        stored value: {formatUnits(sharesValue.data ?? 0)} {symbol}
      </AsciiText>
      <AsciiText padStart={2}>
        has pending deposit: {hasPendingDeposit.data ? "true" : "false"}
      </AsciiText>
      <AsciiText padStart={2}>pending deposit: 0.0 {symbol}</AsciiText>

      <AsciiText padStart={2} opacity={0.5}>
        // total deposited:{" "}
        {formatUnits((user.data?.[0] ?? 0) + (sharesValue.data ?? 0))} {symbol}
      </AsciiText>
      <AsciiText padStart={2} opacity={0.5}>
        // total withdrawn: 0.0 {symbol}
      </AsciiText>
    </>
  );
};

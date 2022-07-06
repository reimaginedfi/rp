import {
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useState } from "react";
import { ContractConfig } from "../../contracts";
import { AsciiNumberInput } from "../AsciiNumberInput";
import { AsciiText, NewLine } from "../AsciiText";
import { InlineButton, InlineTag } from "../InlineButton";

export const VaultFeeSettings = ({
  contractConfig,
}: {
  contractConfig: ContractConfig;
}) => {
  const [isFeeEnabled, setIsFeeEnabled] = useState<boolean>(false);
  const [entryFee, setEntryFee] = useState("100");
  const [exitFee, setExitFee] = useState("100");
  const [managementFee, setManagementFee] = useState("2000");

  return (
    <>
      <NewLine />
      <AsciiText padStart={2} opacity={0.5}>
        // fee management (in BPS)
      </AsciiText>
      <HStack spacing={0} m={0} p={0}>
        <AsciiText padStart={2}>charge fee:{"\u00a0".repeat(5)}</AsciiText>
        <AsciiText
          as="button"
          textColor={"blue"}
          onClick={() => setIsFeeEnabled(!isFeeEnabled)}
        >
          [{isFeeEnabled ? "x" : " "}]
        </AsciiText>
      </HStack>

      <AsciiNumberInput
        label={`entry fee:${"\u00a0".repeat(6)}`}
        onChange={(value) =>
          value ? setEntryFee(value.replace(/[^0-9\.]/g, "")) : 0
        }
        value={`${entryFee}`}
        precision={0}
        step={1}
        max={10000}
        min={0}
      />
      <AsciiNumberInput
        label={`exit fee:${"\u00a0".repeat(7)}`}
        onChange={(value) =>
          value ? setExitFee(value.replace(/[^0-9\.]/g, "")) : 0
        }
        value={`${exitFee}`}
        precision={0}
        step={1}
        max={10000}
        min={0}
      />
      <AsciiNumberInput
        label={`management fee:${"\u00a0"}`}
        onChange={(value) =>
          value ? setManagementFee(value.replace(/[^0-9\.]/g, "")) : 0
        }
        value={`${managementFee}`}
        precision={0}
        step={1}
        max={10000}
        min={0}
      />

      <AsciiText
        onClick={() => console.log({ entryFee, exitFee, managementFee })}
        padStart={2}
        color={"gray"}
        opacity={0.5}
      >
        // <InlineButton>[Update fee]</InlineButton>
      </AsciiText>
    </>
  );
};

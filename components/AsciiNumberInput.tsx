import {
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  UseCounterProps,
} from "@chakra-ui/react";
import { AsciiText } from "./AsciiText";

export const AsciiNumberInput = ({
  label,
  value,
  onChange,
  precision,
  max,
  min,
  step,
}: {
  label?: string;
  value: string;
  onChange: UseCounterProps["onChange"];
  precision?: number;
  step?: number;
  max?: number;
  min?: number;
}) => {
  return (
    <HStack spacing={0} m={0} p={0}>
      <AsciiText padStart={2}>{label}</AsciiText>
      <NumberInput
        m={0}
        size={"xs"}
        maxW="sm"
        onChange={onChange}
        value={value}
        precision={precision}
        step={step}
        max={max}
        min={min}
        lineHeight={"16px"}
        allowMouseWheel
      >
        <NumberInputField
          border={"none"}
          fontSize={"unset"}
          background={"blackAlpha.50"}
          p={0}
          display="inline"
          lineHeight={"16px"}
          height={"16px"}
        />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </HStack>
  );
};

import { CappedTextProps, CappedText } from "@gvrs/chakra-capsize";
import { Text } from "@chakra-ui/react";

export const AsciiText = ({
  padStart = 0,
  ...props
}: CappedTextProps & { padStart?: number }) => {
  return (
    <Text {...props} lineHeight={1}>
      {`\u00a0`.repeat(padStart)}
      {props.children}
    </Text>
  );
};

export const NewLine = () => {
  return <AsciiText padStart={1} />;
};

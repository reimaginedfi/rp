import { CappedTextProps, CappedText } from "@gvrs/chakra-capsize";

export const AsciiText = ({
  padStart = 0,
  ...props
}: CappedTextProps & { padStart?: number }) => {
  return (
    <CappedText {...props}>
      {`\u00a0`.repeat(padStart)}
      {props.children}
    </CappedText>
  );
};

export const NewLine = () => {
  return <AsciiText padStart={1} />;
};

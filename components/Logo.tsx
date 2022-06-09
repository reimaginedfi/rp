import { CappedText } from "@gvrs/chakra-capsize";

const logoString = `
// ██████  ███████ ███████ ██     ██████  ██████   ██████  
// ██   ██ ██      ██      ██     ██   ██ ██   ██ ██    ██ 
// ██████  █████   █████   ██     ██████  ██████  ██    ██ 
// ██   ██ ██      ██      ██     ██      ██   ██ ██    ██ 
// ██   ██ ███████ ██      ██     ██      ██   ██  ██████  
 
`.slice(1); // remove first newline

export const Logo = () => {
  return (
    <CappedText as="pre" lineHeight={1}>
      {logoString}
    </CappedText>
  );
};

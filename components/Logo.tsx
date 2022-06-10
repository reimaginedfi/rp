import { CappedText } from "@gvrs/chakra-capsize";

import { Text } from "@chakra-ui/react";
const logoString = `
// ██████  ███████ ███████ ██     ██████  ██████   ██████   beta
// ██   ██ ██      ██      ██     ██   ██ ██   ██ ██    ██ 
// ██████  █████   █████   ██     ██████  ██████  ██    ██ 
// ██   ██ ██      ██      ██     ██      ██   ██ ██    ██ 
// ██   ██ ███████ ██      ██     ██      ██   ██  ██████  
 
`.slice(1); // remove first newline

export const Logo = () => {
  return (
    <Text as="pre" lineHeight={1} overflow="hidden" fontFamily={"body"}>
      {logoString}
    </Text>
  );
};

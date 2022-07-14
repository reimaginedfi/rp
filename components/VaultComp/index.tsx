import { 
  Accordion, 
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box, 
  Text, 
  useColorMode 
} from "@chakra-ui/react";

type VaultProps = {
  vaultName: string,
  asset: string | undefined,
  currentAum: string,
  aumCap: string,
  epoch: string | undefined
}

const VaultComp = ({
  vaultName,
  asset,
  currentAum,
  aumCap,
  epoch
}: VaultProps) => {
  const { colorMode } = useColorMode();
  console.log(vaultName)

  return (
    <Accordion allowToggle>
          <AccordionItem border="1px solid #232323" borderRadius="0.5rem">
            <AccordionButton 
            _focus={{ borderSize: "0px", borderX: "none", borderTop: "none", borderBottom: "1px solid #232323" }}
            
            >
            {vaultName! || "Vault"}
            </AccordionButton>
            <AccordionPanel >
            </AccordionPanel>
          </AccordionItem>
      </Accordion>
  );
};

export default VaultComp;

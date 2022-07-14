import { 
  Accordion, 
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Progress,
  Button,
  Text, 
  Heading,
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
            _focus={{ borderSize: "0px", borderX: "none", borderTop: "none", borderBottom: "1px solid #232323" }}>
            <Flex w="full" justify="space-between" alignItems="center">
              <Flex direction="row" alignItems="center"><Heading variant="large">{vaultName! || "Vault"}</Heading><Text ml="0.5rem" variant="medium">({asset})</Text></Flex>
              <AccordionIcon/>
            </Flex>
            </AccordionButton>
            <AccordionPanel>

            <Flex justifySelf="center" w="full" px="1rem">
            <Button variant="primary">Deposit</Button>
            <Button variant="ghost">Withdraw</Button>
            </Flex>


            <Flex justify="space-between">
              <Text variant="large">AUM</Text>
              <Text variant="large">{currentAum} / {aumCap}</Text>
            </Flex>

            <Progress 
                borderRadius="1rem"
                value={parseInt(currentAum)} 
                max={parseInt(aumCap)} 
                size='md' 
                colorScheme='red' />

            </AccordionPanel>
          </AccordionItem>
      </Accordion>
  );
};

export default VaultComp;

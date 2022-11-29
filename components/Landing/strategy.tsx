
import {Flex, Text, Image, useColorMode} from "@chakra-ui/react";

export default function Strategy() {

    const { colorMode } = useColorMode();

    return (
        <Flex direction="column" py="2rem">
            <Flex alignItems="center" py="2rem">
            <Image px="1rem" src={colorMode === "dark" ? "/icons/strategy-dark.svg" : "/icons/strategy-light.svg"} h="1.5rem" />
            <Text variant="normal">Strategy & Performance</Text>
            </Flex>
            <Flex pl="3rem" pr="5rem" direction="column">
            <Text  my="0.5rem" variant="normal"> We believe in transparency all the way. Not only are all our trades & positions visible on the blockchain, but you can see our historical performance here:</Text>
            <Text my="0.5rem" variant="normal">Active Management is key in the space. We can front-run the space because {"we’re "}plugged into {"what’s"} going on in crypto. {"Here’s"} an example of us shorting UST:</Text>
            </Flex>
    
        </Flex>
    )
}
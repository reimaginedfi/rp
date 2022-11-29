import {Flex, Text, Image, useColorMode} from "@chakra-ui/react";

export default function Research() {
    const { colorMode } = useColorMode();

    return (
        <Flex>
            <Flex direction="column" py="2rem">
                <Flex alignItems="center" py="2rem">
                <Image px="1rem" src={colorMode === "dark" ? "/icons/research-dark.svg" : "/icons/research-light.svg"} h="1.5rem" />
                <Text variant="normal">Research & Media</Text>
                </Flex>
            </Flex>
        </Flex>
    )
}
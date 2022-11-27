
import {Flex, Text, Image} from "@chakra-ui/react";

export default function Strategy() {

    return (
        <Flex direction="column" py="2rem">
            <Flex alignItems="center" py="2rem">
            <Image px="1rem" src="/icons/strategy-light.svg" h="1.5rem" />
            <Text variant="normal">Strategy & Performance</Text>
            </Flex>
            <Text pl="3rem" pr="5rem" my="0.5rem" variant="normal"> We believe in transparency all the way. Not only are all our trades & positions visible on the blockchain, but you can see our historical performance here:</Text>
            <Text pl="3rem" pr="5rem" my="0.5rem" variant="normal">Active Management is key in the space. We can front-run the space because {"we’re "}plugged into {"what’s"} going on in crypto. {"Here’s"} an example of us shorting UST:</Text>
        </Flex>
    )
}
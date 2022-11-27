import {Button, Flex, Text, Image, useColorMode} from "@chakra-ui/react";

import Hero from "./hero";
import Values from "./values";
import Strategy from "./strategy";

const Landing = () => {
    return (
        <Flex direction="column"         px="4rem"        >
            <Hero />
            <Values />
            <Strategy />
            {/* <Research /> */}
            {/* <Team />  */}
        </Flex>
        );
}

export default Landing;
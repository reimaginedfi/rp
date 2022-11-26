import {Button, Flex, Text, Image, useColorMode} from "@chakra-ui/react";

import Hero from "./hero";
import Values from "./values";

const Landing = () => {
    return (
        <Flex direction="column"         px="4rem"        >
            <Hero />
            <Values />
            {/* <Strategy />
            <Research />
            <Team /> */}
        </Flex>
        );
}

export default Landing;
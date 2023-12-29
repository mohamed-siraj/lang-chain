import { ReactNode } from "react";

import { Flex , Container} from "@chakra-ui/react";

interface PropTypes {
    children: ReactNode;
}

const PortalLayout = ({ children }: PropTypes) => {
    return (
        // <Container maxW={'3xl'}>
            <Flex
                direction="column"
                align="center"  // Center items horizontally
                justify="center"  // Center items vertically
                minH="100vh"  // Set minimum height to 100% of viewport height
                minW="100vw"
                px={{ base: 4, md: 8, lg: 16 }}  // Responsive padding
                
                >
                <div>{children}</div>
            </Flex>
        // </Container>
    );
};

export default PortalLayout;

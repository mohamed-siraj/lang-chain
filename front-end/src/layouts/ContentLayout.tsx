import React from "react";

// import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Box, Flex } from "@chakra-ui/react";

// import { FooterActions, FooterActionsProps } from "@components/FooterActions";
import { Text } from "../components/Text";

interface PropTypes {
    title?: React.ReactNode;
    description?: React.ReactNode;
    //footerActionsProps?: FooterActionsProps;
    containerWidth?: (string | number | null)[] | string | number;
    children: React.ReactNode;
}

const ContentLayout = ({
    title,
    description,
   // footerActionsProps,
    containerWidth,
    children
}: PropTypes) => {
    let hasBackButton = false;
    // if (footerActionsProps) {
    //     if (
    //         footerActionsProps.hasBackButton === undefined ||
    //         footerActionsProps.hasBackButton
    //     )
    //         hasBackButton = true;
    // }

    return (
        <Flex direction="column" gap={5} px={[3, null, 20]}>
            <Flex
                direction="column"
                align="center"
                pt={12}
                pb={15}
                w={containerWidth ?? ["95%", null, "70%", "60%", "40%"]}
                m="auto"
            >
                <Flex direction="column" gap={10} w="full">
                    {title && (
                        <Flex align="start" justify="center" gap={2}>
                            {hasBackButton && (
                                <Box
                                    mr="auto"
                                    cursor="pointer"
                                    display={["inline-block", "none"]}
                                  //  onClick={footerActionsProps?.onGoBack}
                                >
                                    {/* <FontAwesomeIcon
                                        icon={faChevronLeft}
                                        color="var(--euka-colors-gray-900)"
                                        fontSize={20}
                                    /> */}
                                </Box>
                            )}
                            <Flex direction="column" gap={4}>
                                <Text
                                    m="auto"
                                    textAlign="center"
                                    type="heading"
                                >
                                    {title}
                                </Text>
                                {description && <Text>{description}</Text>}
                            </Flex>
                        </Flex>
                    )}
                    {children}
                </Flex>
            </Flex>
            {/* {footerActionsProps && <FooterActions {...footerActionsProps} />} */}
        </Flex>
    );
};

export default ContentLayout;

import { Flex, Container, Box, Center, Button, Divider } from '@chakra-ui/react';
import { Text } from '../../../components/Text';
import LoginBackgroundSVG from "../../../assets/backgrounds/login_background.svg";

import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { useLocation } from "react-router-dom";

const LoginContainer = () => {
    const backgroundStyle = {
        backgroundImage: `url(${LoginBackgroundSVG})`,
        backgroundRepeat: "no-repeat",
    };

    const location = useLocation();

    return (
        <Flex color='white'>
            <Flex w={{ base: '100%', lg: '65%' }} h="100vh" display={{ base: "none", xl: "flex" }} style={backgroundStyle}>
                <Container maxW='3xl' centerContent py={{ base: 20 }}>
                    <Flex w="100%" textAlign="left" direction="column" gap={4}>
                        <Text type="display">
                            The central hub for Language and Learning Models with plethora of features
                        </Text>

                        <Text type="subHeading">
                            Diverse Capabilities
                        </Text>

                        <Text type="body-regular" textAlign="left" lineHeight="22px" pr="45%">
                            Access state-of-the-art natural language processing models for tasks like translation, sentiment analysis, question-answering, chatbots, and more.
                        </Text>

                        <Text type="subHeading">
                            Seamless Integration
                        </Text>

                        <Text type="body-regular" textAlign="left" lineHeight="22px" pr="45%">
                            Designed with a developer-friendly REST API, our platform ensures easy integration into your existing software stack.
                        </Text>

                        <Text type="subHeading">
                            Industry-Leading Expertise
                        </Text>

                        <Text type="body-regular" textAlign="left" lineHeight="22px" pr="45%">
                            Benefit from the expertise and innovation of renowned providers, OpenAI and Hugging Face. Stay at the forefront of AI advancements by leveraging their groundbreaking models through LLM Core Service
                        </Text>
                    </Flex>
                </Container>
            </Flex>
            <Flex w={{ base: '100%', lg: '35%' }} h="100vh" direction="column">
               
                    {location.pathname === '/signin' ? (
                        <SignInForm />
                    ) : (
                        <SignUpForm />
                    )}
             

            </Flex>
        </Flex>
    )
}

export default LoginContainer
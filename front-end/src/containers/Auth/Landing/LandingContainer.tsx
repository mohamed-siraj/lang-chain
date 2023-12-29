import {
  Box,
  Container,
  Button,
  Flex, 
  Link
} from '@chakra-ui/react';

import { Text } from '../../../components/Text';

export default function LandingContainer() {
  return (
    <Container centerContent>
      <Flex
        direction="column" 
        align="center" 
        justify="center" 
        textAlign="center"
        py={{ base: 20, md: 36 }}
        px={{ base: 3, md: 5 }}
        gap={4}
      >
        <Text type="display">
          Unlock the Future of Language Processing with LangX!
        </Text>
        <Text type="body-regular" textAlign="center" lineHeight="22px">
          Embark on a journey of innovation and efficiency by integrating our cutting-edge REST API into your projects. We collaborate with industry giants like OpenAI and Hugging Face to deliver a comprehensive suite of powerful language models and AI capabilities
        </Text>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={3}
          align="center"
          justify="center"
        >
          <Link href="/signin">
              <Button variant="secondary">Login</Button>
          </Link>
          
          <Link href="/signup">
            <Button variant="primary">Get Started</Button>
          </Link>
        </Flex>
      </Flex>
    </Container>
  );
}

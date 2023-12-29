import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface ChatTileProps {
  title: string;
  subtitle: string;
}

const ChatTile: React.FC<ChatTileProps> = ({ title, subtitle }) => {
  return (
    <Box
      bg="white"
      color="black"
      w="100%"
      h="66px"
      p={4}
      borderRadius={6}
      border="1px"
      padding="12px"
      gap="4px"
      borderColor="#E6E6E6"
    >
      <Text fontFamily="IBM Plex Sans" noOfLines={1}>
        {title}
      </Text>
      <Text fontFamily="IBM Plex Sans" color="#595959" noOfLines={1}>
        {subtitle}
      </Text>
    </Box>
  );
};

export default ChatTile;

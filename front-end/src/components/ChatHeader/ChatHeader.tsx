import React from 'react';
import { Box, Flex, Text as ChakraText, Center, Tag, IconButton } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';

interface ChatHeaderProps {
  title: string;
  tag: string;
  onEditClick: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title, tag, onEditClick }) => {
  return (
    <Box bg="white" w="100%" py="8px" px="20px" color="black" borderRadius="10px" border="1px solid var(--text-normal-hover, #E6E6E6)">
      <Flex justify="space-between">
        <Flex align="center" justify="center">
          <ChakraText fontFamily="Red Hat Display" fontSize="23px">
            {title}
          </ChakraText>
        </Flex>

        <Flex align="center" justify="center">
          <Center>
            <Tag>{tag}</Tag>
            <IconButton aria-label="Edit" icon={<EditIcon />} backgroundColor="white" onClick={onEditClick} />
          </Center>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ChatHeader;

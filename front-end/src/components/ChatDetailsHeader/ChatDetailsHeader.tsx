import React from 'react';
import { Box, Flex, Text as ChakraText, Center, Tag, IconButton } from '@chakra-ui/react';
import ShareIcon from '../../assets/icons/ShareIcon';
import DeleteAltIcon from '../../assets/icons/DeleteAltIcon';
import EditIcon from '../../assets/icons/EditIcon';
import useAppContext from '../../context/useAppContext';

interface ChatDetailsHeaderProps {
  title: string;
  tag: string;
  onEditClick: () => void;
}

const ChatDetailsHeader: React.FC<ChatDetailsHeaderProps> = ({ title, tag, onEditClick }) => {
  const { openModal, closeModal } = useAppContext();

  return (
    <Box bg="white" w="100%" py="8px" px="20px" color="black" borderRadius="10px" border="1px solid var(--text-normal-hover, #E6E6E6)">
      <Flex justify="space-between">
        <Flex align="center" justify="center">
          <ChakraText fontFamily="Red Hat Display" fontSize="23px" noOfLines={1}>
            {title}
          </ChakraText>
        </Flex>

        <Flex align="center" justify="center">
          <Center>
            <IconButton aria-label="ShareIcon" icon={<ShareIcon />} backgroundColor="white" onClick={() => openModal()} />
            <IconButton aria-label="Edit" icon={<EditIcon />} backgroundColor="white" onClick={onEditClick} />
            <IconButton aria-label="DeleteAltIcon" icon={<DeleteAltIcon />} backgroundColor="white" onClick={onEditClick} />
          </Center>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ChatDetailsHeader;

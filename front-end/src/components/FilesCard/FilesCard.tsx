import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import EditIcon from '../../assets/icons/EditIcon';
import DeleteAltIcon from '../../assets/icons/DeleteAltIcon';
import EyeIcon from '../../assets/icons/EyeIcon';

interface FilesCardCardProps {
  title: string;
  description: string;
  onButtonClick1: () => void;
  callback: () => void;
  onDelete: (title: string) => void;
}

const FilesCardCard: React.FC<FilesCardCardProps> = ({
  title,
  callback,
  description,
  onButtonClick1,
  onDelete,
}) => {

  const onRemoveSheet = (title: string) => {
    callback();
    onDelete(title);
  }


  return (
    <Box
      bg="white"
      color="black"
      w="100%"
      h="43px"
      borderRadius={6}
      border="1px"
      pl="12px"
      gap="4px"
      borderColor="#E6E6E6"
    >
      <Flex  justifyContent="space-between" align="center"  boxSizing="content-box">
          <Text fontFamily="IBM Plex Sans" noOfLines={1} color="#1A1A1A" lineHeight="120%" fontSize="16px" fontWeight="500px">
            {title}
          </Text>
          <IconButton aria-label='Delete Icon' icon={<DeleteAltIcon />}  onClick={() => onRemoveSheet(title)} p={0}/>
      </Flex>
    </Box>
  );
};

export default FilesCardCard;

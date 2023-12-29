import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import EditIcon from '../../assets/icons/EditIcon';
import DeleteIcon from '../../assets/icons/DeleteIcon';
import EyeIcon from '../../assets/icons/EyeIcon';

interface ConnectionStringCardProps {
  database: any;
  onButtonClick1: () => void;
  onButtonClick2: () => void;
}

const ConnectionStringCard: React.FC<ConnectionStringCardProps> = ({
  database,
  onButtonClick1,
  onButtonClick2,
}) => {
  const { database_name, connection_string, id } = database
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
      <Flex  justifyContent="space-between"  boxSizing="content-box">
        <Flex direction="column">
          <Text fontFamily="IBM Plex Sans" noOfLines={1}>
            {database_name}
          </Text>
          <Text fontFamily="IBM Plex Sans" color="#595959" noOfLines={1}>
            Connection String:{connection_string}
          </Text>
        </Flex>
        <Flex gap={2}>
          <IconButton backgroundColor="var(--text-normal-hover, #E6E6E6)"  isRound={true} icon={<EyeIcon />} aria-label={''}/>
          <IconButton backgroundColor="var(--danger-light, #FFE1E1)"  isRound={true} icon={<DeleteIcon />} aria-label={''}/>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ConnectionStringCard;

import { Flex, Spacer, Box } from '@chakra-ui/react'
import YouAvatarIcon from '../../assets/icons/YouAvatar'
import EditIcon from '../../assets/icons/EditIcon'

interface QuestionProps {
    question: any;
    onEditClick?: () => void; // Optional prop for edit click callback
}

const Question: React.FC<QuestionProps> = ({question}) => {

  return (
    <Flex direction="column" w="100%">
        <Flex>
            <Flex pl='4' pb="2" align="center" gap={3} fontFamily="IBM Plex Sans" color="#1A1A1A" fontSize="16px" fontWeight="500px">
                <YouAvatarIcon />
                You
            </Flex>
            <Spacer />
            <Flex pl='4' pb="2" align="center" cursor="pointer">
                <EditIcon />
            </Flex>
        </Flex>
        <Flex fontFamily="IBM Plex Sans" fontSize="19px" lineHeight="120%">
            {question.text}
        </Flex>
    </Flex>
  )
}

export default Question
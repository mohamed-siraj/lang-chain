import { Flex, Spacer, Tag, Text } from '@chakra-ui/react'
import LangXAvatarIcon from '../../assets/icons/LangXAvatar'
import ThumbsUpIcon from '../../assets/icons/ThumbsUp'
import ThumbsDownIcon from '../../assets/icons/ThumbsDown'
import showdown from 'showdown';
import { useEffect, useState } from 'react';

interface AnswerProps {
    answer: any;
    onEditClick?: () => void; // Optional prop for edit click callback
}

const Answer: React.FC<AnswerProps> = ({ answer }) => {

    const [html, setHtml] = useState<string>('');
    
    useEffect(() => {
        // Initialize showdown converter
        const converter = new showdown.Converter();
    
        // Convert Markdown to HTML
        const htmlOutput = converter.makeHtml(answer.text);
    
        // Update the state with the HTML
        setHtml(htmlOutput);
      }, [answer]);
    
  return (
    <Flex direction="column" w="100%">
        <Flex>
            <Flex pl='4' pb="2" align="center" gap={3}>
                <LangXAvatarIcon />
                LangX
            </Flex>
            <Spacer />
        </Flex>
        <Flex fontFamily="IBM Plex Sans" fontSize="19px">
            <div dangerouslySetInnerHTML={{ __html: html }} style={{ maxWidth: "600px" }}/>
        </Flex>
        <Flex>
            <Text color="#737373" fontSize="13px" fontFamily="IBM Plex Sans" fontWeight="400" lineHeight="120%" pt="14px">
                Hallucination Warning
            </Text>
        </Flex>
        <Flex pt="14px">
            <Flex w={{ base: "100%" }} pb="2" align="center" color="#737373" fontFamily="IBM Plex Sans" fontSize="13px" gap={3}>
                Was this response helpful?

                <ThumbsUpIcon />
                <ThumbsDownIcon />
            </Flex>
            <Spacer />
            <Tag bg="#E6E6E6" maxW="400px" h="24px" fontWeight={400} fontFamily="IBM Plex Sans" fontSize="13px" color="#0D1021">
                {answer.model}
            </Tag>
        </Flex>
    </Flex>
  )
}

export default Answer
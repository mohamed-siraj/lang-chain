import { SettingsIcon } from '@chakra-ui/icons'
import { Card, CardBody, Flex, RadioGroup, Stack, Tabs, TabList, Tab, TabPanels, TabPanel, Radio, Spacer, CardFooter, Button, Text as ChakraText, useDisclosure } from '@chakra-ui/react'
import React, { ChangeEvent } from 'react'
import ManageSources from '../ManageSources.tsx/ManageSources'
import RadioButton from '../RadioButton/RadioButton'
import { useAppSelector } from '../../app/hooks'
import AIModel from '../AIModel/AIModel'
import SourceType from '../SourceType/SourceType'
import useAppContext from '../../context/useAppContext'
import ShareChat from '../ShareChat/ShareChat'

const Settings = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [value, setValue] = React.useState('1')
    const [isSelected, setIsSelected] = React.useState('1');
    const { openModal, closeModal } = useAppContext();

    const options = [
      { label: 'GPT 3.5 Turbo', value: '1' },
      { label: 'GPT 3.5 Turbo', value: '2' },
      { label: 'GPT 3.5 Turbo', value: '3' },
      { label: 'GPT 3.5 Turbo', value: '4' },
      // Add more options as needed
    ];
  
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      console.log('Radio button changed!', event.target.value, isSelected, value);
      setIsSelected(event.target.value)
    };
    
  return (
    <Card w="100%" shadow={0} bg="gray.200">
    <CardBody>
      <Flex direction="column">
        <ChakraText
          fontFamily="Red Hat Display"
          fontSize="16px"
        >
          Request Settings
        </ChakraText>
        <AIModel />

        <ChakraText
          fontFamily="IBM Plex Sans"
          fontSize="13px"
          color="#1A1A1A"
          lineHeight="120%"
          mt="15px"
          mb="10px"
        >
          Type
        </ChakraText>

        <SourceType />
      </Flex>
    </CardBody>
    <CardFooter>
      <Button variant="outline" w="100%" mt="10px" lineHeight={2} onClick={onOpen} background="var(--text-normal-hover, #E6E6E6)" leftIcon={<SettingsIcon />}> Manage Sources </Button>
      <ManageSources isOpen={isOpen} onClose={onClose} />
      <ShareChat isOpen={isOpen} onClose={closeModal}/>
    </CardFooter>
  </Card>
  )
}

export default Settings

function dispatch(arg0: any) {
    throw new Error('Function not implemented.')
}

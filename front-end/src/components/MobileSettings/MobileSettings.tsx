import { ChatIcon } from '@chakra-ui/icons'
import { Drawer, Text as ChakraText, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Input, DrawerFooter, Button, Flex, Radio, RadioGroup, Stack, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import ManageSources from '../ManageSources.tsx/ManageSources'
import AIModel from '../AIModel/AIModel'
import SourceType from '../SourceType/SourceType'

interface MobileSettingsProps {
  isOpen: boolean,
  onToggle: () => void
}

const MobileSettings = ({ isOpen, onToggle }: MobileSettingsProps) => {
  const [value, setValue] = React.useState('1')

  const { isOpen: isOpenModal, onOpen, onClose } = useDisclosure()

  return (
    <Drawer
      isOpen={isOpen}
      placement='right'
      onClose={onToggle}
    >
      <DrawerOverlay display={{ base: "flex", md: "none " }} />
      <DrawerContent bgColor="white" display={{ base: "flex", md: "none " }}>
        <DrawerCloseButton />
        <DrawerHeader></DrawerHeader>

        <DrawerBody>
          <Flex pl="33px" pt="46px" direction="column">

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

        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" w="100%" mt="10px" lineHeight={2} leftIcon={<ChatIcon />} onClick={() => onOpen()}> Manage Sources </Button>
          <ManageSources isOpen={isOpenModal} onClose={onClose} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default MobileSettings
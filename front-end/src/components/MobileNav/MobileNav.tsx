import ChatIcon from '../../assets/icons/ChatIcon'
import { Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Input, DrawerFooter, Button, Flex } from '@chakra-ui/react'
import ChatTile from '../ChatTile/ChatTile'

interface MobileNavProps {
  isOpen: boolean,
  onToggle: () => void
}

const MobileNav = ({ isOpen, onToggle }: MobileNavProps) => {
  return (
    <Drawer
      isOpen={isOpen}
      placement='left'
      onClose={onToggle}
    >
      <DrawerOverlay display={{ base: "flex", md: "none " }} />
      <DrawerContent bgColor="white" display={{ base: "flex", md: "none " }}>
        <DrawerCloseButton />
        <DrawerHeader>

        </DrawerHeader>

        <DrawerBody>
          <Flex direction="column" w="100%" gap={3}>
            <ChatTile title="dasdada" subtitle='asdadasdadadad' />
            <ChatTile title="dasdada" subtitle='asdadasdadadad' />
          </Flex>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="primary" w="100%" mt="10px" lineHeight={2} leftIcon={<ChatIcon />}> New Chat </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default MobileNav
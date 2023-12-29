'use client'

import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Avatar,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
} from '@chakra-ui/react'
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons'

import ChatIcon from '../../assets/icons/ChatIcon'
import MobileNav from '../MobileNav/MobileNav'
import MobileSettings from '../MobileSettings/MobileSettings'

export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure()
  const { isOpen: isSettingsOpen, onToggle: onSettingsToggle } = useDisclosure()

  return (
    <Box>
      <Flex
        bg={useColorModeValue('#F6F6F6', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={11}
        borderStyle={'solid'}
        borderColor="#FFECB1"
        align={'center'}>
        <Flex
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'left', md: 'start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'left', sm:'left', md: 'left' })}
            fontFamily='Red Hat Display'
            fontWeight="800"
            color='gray.900'>
            LangX
          </Text>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={1}>
         <Box onClick={onSettingsToggle} bg='white' boxShadow="0px 2px 4px 0px rgba(0, 0, 0, 0.05)" color='black' borderRadius="80px" w="182px" h="48px" p="4px 4px 4px 24px" gap="12" display="flex">
            <Flex display="flex" direction="column" justify="end" textAlign="right" ml="20px">
                <Text fontFamily='IBM Plex Sans' fontWeight={500} noOfLines={1}> Jacob test </Text>
                <Text fontSize={10} fontWeight={100} fontFamily='IBM Plex Sans'>  Personal Account </Text>
            </Flex>
            <Flex position='absolute' right={0} pr={5}>
                <Avatar name='Tharindu Senadheera' src='https://bit.ly/tioluwani-kolawole' w="40px" h="40px" bgColor="#CCCCCC"/>
            </Flex>
         </Box>
        </Stack>
      </Flex>

     
      <MobileNav isOpen={isOpen} onToggle={onToggle}/>
      <MobileSettings isOpen={isSettingsOpen} onToggle={onSettingsToggle}/>
    </Box>
  )
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200')
  const linkHoverColor = useColorModeValue('gray.800', 'white')
  const popoverContentBgColor = useColorModeValue('white', 'gray.800')

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Box
                as="a"
                p={2}
                href={navItem.href ?? '#'}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}>
                {navItem.label}
              </Box>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}>
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  )
}

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Box
      as="a"
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'pink.400' }}
            fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}>
          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  )
}

interface NavItem {
  label: string
  subLabel?: string
  children?: Array<NavItem>
  href?: string
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Home',
    href: '#',
  },
  {
    label: 'About',
    href: '#',
  },
  {
    label: 'Contact',
    href: '#',
  },
]
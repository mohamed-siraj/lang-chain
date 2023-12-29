import { Box, Button, Flex, Text as ChakraText, Center, Card, CardBody, CardFooter, CardHeader, Radio, RadioGroup, Stack, useDisclosure, Tab, TabList, TabPanel, TabPanels, Tabs, Spacer } from "@chakra-ui/react";
import { ChangeEvent, lazy, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { login } from "../features/auth/authSlice";
import ToastNotify from "../components/ToastNotify";
import Navbar from "../components/NavBar/NavBar";
import Sidebar from "../components/SideBar/SideBar";
import ChatTilesContainer from "../containers/Chat/ChatTilesContainer/ChatTilesContainer";
import React from "react";
import SettingsIcon from "../assets/icons/SettingsIcon";
import ChatInput from "../components/ChatInput/ChatInput";
import ChatHeader from "../components/ChatHeader/ChatHeader";
import RadioButton from "../components/RadioButton/RadioButton";
import ManageSources from "../components/ManageSources.tsx/ManageSources";
import Answer from "../components/ChatResponse/Answer";
import Question from "../components/ChatResponse/Question";
import { fetchAll } from "../features/todo/todo.service";
import AIModel from "../components/AIModel/AIModel";
import { useParams } from 'react-router-dom';

const Home = () => {
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isAuth } = useAppSelector((state) => state.auth);
  const [value, setValue] = React.useState('1')
  const [isSelected, setIsSelected] = React.useState('1');

  useEffect(() => {
    // Get the current URL search parameters
    const queryParams = new URLSearchParams(window.location.search);

    // Access specific query parameters
    const accessToken = queryParams.get('access');
    const refreshToken = queryParams.get('refresh');
    const userEmail = queryParams.get('email');

    if (accessToken !== null) {
      localStorage.setItem('@accessToken', accessToken);
    }
    if (refreshToken !== null) {
      localStorage.setItem('@refreshToken', refreshToken);
    }
    if (userEmail !== null) {
      localStorage.setItem('@userEmail', userEmail);
    }


    // You can use the extracted values in your component state or perform other actions.
  }, []); // The empty dependency array ensures the effect runs once after the initial render.
 
  return (
    <div>
      <Flex direction="column" height="100vh">
        <Navbar />
        <Flex flex="1" overflow="hidden">
          <Sidebar>
            <ChatTilesContainer />
          </Sidebar>
          <Flex flex="1" p={{base: 0, lg: "4"}}>
            <Box flex="1" bg="white" px="20px" pt="8px">
              <Card borderWidth={0} shadow={0} h="100%">
                <CardHeader>
                  <ChatHeader title="New Chat" tag="GPT 3.5" onEditClick={() => (console.log("test"))} />
                </CardHeader>
                <CardBody>


                  <Flex direction="column" gap="26px">
    
                  </Flex>

                  <Center h="100%">
                    Ask something from your assistant
                  </Center>


                </CardBody>
                <CardFooter>
                  <ChatInput onSendMessage={(message: string) => (console.log(message))} />
                </CardFooter>
              </Card>
            </Box>
          </Flex>

          <Sidebar w="272px">
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

                  <Tabs variant='unstyled'>
                    <TabList h="24px" w="100%">
                      <Tab _selected={{ color: 'white', bg: '#1A1A1A' }} bg="#FFFFFF" w="119px" borderRadius="6px" fontFamily="IBM Plex Sans" fontSize="13px">Chat</Tab>
                      <Tab _selected={{ color: 'white', bg: '#1A1A1A' }} bg="#FFFFFF" w="119px" borderRadius="6px" fontFamily="IBM Plex Sans" fontSize="13px">Sources</Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel>
                      </TabPanel>
                      <TabPanel w="100%" px={0}>
                        <RadioGroup onChange={setValue} value={value}>
                          <Stack direction='column' gap={0}>
                            <Flex align="center" background="var(--text-normal-hover, #E6E6E6)" borderRadius="10px 10px 0px 0px" h="36px">
                              <Radio value='1' px="10px" mr="2" colorScheme="gray"  >
                                <ChakraText fontFamily="IBM Plex Sans" fontSize="13px">Newsweek (Webpage)</ChakraText>
                              </Radio>
                              <Spacer />
                              {/* <IconButton aria-label='Edit' icon={<InfoIcon />} background="var(--text-normal-hover, #E6E6E6)" /> */}
                            </Flex>
                            <Flex align="center" background="var(--text-normal-hover, #FFF)" borderRadius="0px 0px 0px 0px" h="36px">
                              <Radio value='2' colorScheme="gray" px="10px" mr="2">
                                <ChakraText fontFamily="IBM Plex Sans" fontSize="13px">Biography (PDF)</ChakraText>
                              </Radio>
                              <Spacer />
                            </Flex>
                            <Flex align="center" background="var(--text-normal-hover, #FFF)" borderRadius="0px 0px 0px 0px" h="36px">
                              <Radio value='3' colorScheme="gray" px="10px" py="2px" mr="2">
                                <ChakraText fontFamily="IBM Plex Sans" fontSize="13px">db-contents (SQL)</ChakraText>
                              </Radio>
                              <Spacer />
                            </Flex>
                            <Flex align="center" background="var(--text-normal-hover, #FFF)" borderRadius="0px 0px 10px 10px" h="36px">
                              <Radio value='4' colorScheme="gray" px="10px" py="2px" mr="2">
                                <ChakraText fontFamily="IBM Plex Sans" fontSize="13px">document (XLSX)</ChakraText>
                              </Radio>
                              <Spacer />
                            </Flex>
                          </Stack>
                        </RadioGroup>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>

                </Flex>
              </CardBody>
              <CardFooter>
                <Button variant="outline" w="100%" mt="10px" lineHeight={2} onClick={onOpen} background="var(--text-normal-hover, #E6E6E6)" leftIcon={<SettingsIcon />}> Manage Sources </Button>
                <ManageSources isOpen={isOpen} onClose={onClose} />
              </CardFooter>
            </Card>
          </Sidebar>
        </Flex>
      </Flex>
    </div>
  );
};

export default Home;

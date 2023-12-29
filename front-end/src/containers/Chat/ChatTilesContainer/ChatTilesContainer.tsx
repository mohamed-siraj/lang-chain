import { Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Link } from '@chakra-ui/react'
import ChatTile from '../../../components/ChatTile/ChatTile'
import ChatIcon from '../../../assets/icons/ChatIcon'
import { useNavigate } from 'react-router-dom';
import { create, fetchAll } from '../../../features/sessions/sessions.service';
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect } from 'react';

const ChatTilesContainer = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { sessions } = useAppSelector((state) => state.sessions);

  const generateRandomString = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  };

  const navigateToChat = () => {
    const payload = {
      url: "/sessions",
      data: {
        name: `NewChat ${generateRandomString(10)}`
      },
    };

    dispatch(create(payload))
      .then((res: any) => {
        navigate(`/chat/${res.payload._id}`)
      })
      .catch((err) => {
      });
  };

  const featchSessions = () => {
    const payload = {
      url: "/sessions",
      data: {},
    };

    dispatch(fetchAll(payload))
      .then((res: any) => { })
      .catch((err) => { });
  };

  useEffect(() => {
    featchSessions();
  }, []);

  const navigateToChatDetails = (id: string) => {
    navigate(`/chat/${id}`)
  }

  return (

    <Card w="100%" h="100vh" shadow={0} bg="gray.200" display="flex" flexDirection="column">
      <CardBody flex="8" overflowY="auto">
        <Flex direction="column" w="100%" gap={3}>
          {sessions.map((session) => (
            <Box key={session._id} onClick={() => navigateToChatDetails(session._id)} cursor="pointer">
              <ChatTile title={session.name} subtitle={"need a subtitle"} />
            </Box>
          ))}
        </Flex>
      </CardBody>
      <CardFooter flex="2">
        <Button variant="primary" w="100%" mt="10px" lineHeight={2} leftIcon={<ChatIcon />} onClick={navigateToChat}>
          New Chat
        </Button>
      </CardFooter>
    </Card>

  )
}

export default ChatTilesContainer

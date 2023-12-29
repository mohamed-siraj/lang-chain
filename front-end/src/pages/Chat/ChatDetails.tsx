import { Card, CardBody, CardFooter, CardHeader, Flex } from '@chakra-ui/react'
import Question from '../../components/ChatResponse/Question'
import Answer from '../../components/ChatResponse/Answer'
import ChatHeader from '../../components/ChatHeader/ChatHeader'
import ChatInput from '../../components/ChatInput/ChatInput'
import ChatDetailsHeader from '../../components/ChatDetailsHeader/ChatDetailsHeader'
import { useNavigate, useParams } from 'react-router-dom';
import { fetchMessesgesBySession, fetchSessionById } from '../../features/sessions/sessions.service';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect, useRef } from 'react';
import useAppContext from '../../context/useAppContext'

const ChatDetails = () => {
    const dispatch = useAppDispatch();
    const { id } = useParams<{ id: string }>();
    const { msgBySession, session } = useAppSelector((state) => state.sessions);

    const featchSessions = () => {
        const payload = {
            url: `/sessions/${id}/messages`,
            data: {},
        };

        dispatch(fetchMessesgesBySession(payload))
            .then((res: any) => { })
            .catch((err) => { });
    };

    const featchSessionById = () => {
        const payload = {
            url: `/sessions/${id}`,
            data: {},
        };

        dispatch(fetchSessionById(payload))
            .then((res: any) => { })
            .catch((err) => { });
    };

    useEffect(() => {
        featchSessions();
        featchSessionById();
    }, [id]);

    return (
        <Card borderWidth={0} shadow={0} h="100%">
            <CardHeader>
                <ChatDetailsHeader title={session.name} tag="GPT 3.5" onEditClick={() => (console.log("test"))} />
            </CardHeader>
            <CardBody  overflowY="auto" maxHeight="70vh">

                <Flex direction="column" gap="26px">
                    {msgBySession.map((msg: any) => {
                        if(msg.role === "Human") {
                            return  <Question question={msg} />
                        }

                        if(msg.role === "Ai") {
                            return  <Answer answer={msg} />
                        }
                    })}
                </Flex>

            </CardBody>
            <CardFooter>
                <ChatInput onSendMessage={(message: string) => (console.log(message))} />
            </CardFooter>
        </Card>
    )
}

export default ChatDetails
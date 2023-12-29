import { Card, CardBody, CardFooter, CardHeader, Center } from '@chakra-ui/react'
import ChatHeader from '../../components/ChatHeader/ChatHeader'
import ChatInput from '../../components/ChatInput/ChatInput'

const NewChat = () => {
    return (
        <Card borderWidth={0} shadow={0} h="100%">
            <CardHeader>
                <ChatHeader title="New Chat" tag="GPT 3.5" onEditClick={() => (console.log("test"))} />
            </CardHeader>
            <CardBody>
                
                <Center h="100%">
                    Ask something from your assistant
                </Center>

            </CardBody>
            <CardFooter>
                <ChatInput onSendMessage={(message: string) => (console.log(message))} />
            </CardFooter>
        </Card>
    )
}

export default NewChat
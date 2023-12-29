import React, { ChangeEvent, useEffect, useState } from 'react';
import { InputGroup, Input, InputRightElement, IconButton } from '@chakra-ui/react';
import SendIcon from "../../assets/icons/SendIcon";
import { create, createSessionMessage, fetchMessesgesBySession } from '../../features/sessions/sessions.service';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate, useParams } from 'react-router-dom';
import useAppContext from '../../context/useAppContext';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState<string>('');
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentModel, settingSelected, settings, agentTyoeSelected, currentAgentToolkitSelected } = useAppContext();
  
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    const isNew = queryParams.get('new');
    const msg = queryParams.get('msg');

    if(isNew == 'true') {
      getChatRequestData(msg);
    }

  }, [])

  const getChatRequestData = async (prompt: any) => {
    let requestTemplate = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('@refreshToken')}`
      },
      body: JSON.stringify({})
    };

    let endpoint;

    endpoint = import.meta.env.VITE_API_BASE_URL + `/llm/chat/${id}/streaming`;

    if(settingSelected == settings.agent) {
      const body = JSON.stringify({
        text: prompt,
        role: "Human",
        model: currentModel,
        tools: [currentAgentToolkitSelected[0]?.name],
        agent_toolkit: currentAgentToolkitSelected[0]?.agent_toolkit,
        agent_type: agentTyoeSelected
      })
      requestTemplate.body = body
      endpoint = import.meta.env.VITE_API_BASE_URL +`/llm/agent/${id}/streaming`
    } 
    else if(settingSelected == settings.chat) {
      const body = JSON.stringify({
        text: prompt,
        role: "Human",
        model:currentModel,
      })
      requestTemplate.body = body
      endpoint = import.meta.env.VITE_API_BASE_URL +`/llm/chat/${id}/streaming`
    }

    return await dispatch(createSessionMessage({ url: endpoint, data: requestTemplate }))
      .then((res: any) => {
        featchSessions();
      })
      .catch((err) => { });;
  };
  
  const featchSessions = () => {
    const payload = {
      url: `/sessions/${id}/messages`,
      data: {},
    };

    dispatch(fetchMessesgesBySession(payload))
      .then((res: any) => { })
      .catch((err) => { });
  };

  const onClickMessage = () => {
    getChatRequestData(message);
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

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
        navigate(`/chat/${res.payload._id}?new=true&msg=${message}`)
      })
      .catch((err) => {
      });
  };


  const handleSendMessage = () => {

    if (id === undefined) {
      navigateToChat()
    }

    if (message.trim() !== '') {
      onClickMessage();
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <InputGroup>
      <Input
        type="text"
        placeholder="Type your message here"
        fontFamily="IBM Plex Sans"
        fontSize="16px"
        value={message}
        onChange={handleChange}
      />
      <InputRightElement p="4px">
        <IconButton
          aria-label="Send Message"
          icon={<SendIcon />}
          onClick={handleSendMessage}
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default ChatInput;

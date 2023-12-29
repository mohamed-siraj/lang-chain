// AppProvider.tsx
import React, { useState, ReactNode } from 'react';
import AppContext, { AppContextProps } from './AppContextTypes';
import { useDisclosure } from '@chakra-ui/react';

interface AppProviderProps {
  children: ReactNode;
}

const settings = {
  chat: 'chat',
  retrival: 'retrival',
  agent: 'agent'
};

const toolkitTypes = {
  general: 'general',
  sql_database: 'sql_database',
  excel_sheet: 'excel_sheet',
};

const tools = [
  "calculator",
  "python_repl",
  "get_link"
]


const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [count, setCount] = useState<number>(0);
  const [currentModel, setCurrentModel] =  useState<string>("gpt-3.5-turbo");
  const [settingSelected, setSettingSelected] = useState(settings.chat);
  const [agentToolkitSelected, setAgentToolkitSelected] = useState("general");
  const [currentAgentToolkitSelected, setCurrentAgentToolkitSelected] = useState<any>();
  const [agentTyoeSelected, setAgentTyoeSelected] = useState("OPENAI_FUNCTIONS");
  const [pdfFiles, setPdfFiles] = useState<any[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const increment = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const decrement = () => {
    setCount((prevCount) => prevCount - 1);
  };

  const openModal = () => {
    onOpen()
  };

  const closeModal = () => {
    onClose()
  };

  

  const contextValue: AppContextProps = {
    count,
    increment,
    decrement,
    currentModel, 
    setCurrentModel,
    settingSelected,
    setSettingSelected,
    agentToolkitSelected, 
    setAgentToolkitSelected,
    agentTyoeSelected, 
    setAgentTyoeSelected,
    settings,
    toolkitTypes,
    setCurrentAgentToolkitSelected,
    currentAgentToolkitSelected,
    tools,
    pdfFiles,
    setPdfFiles,
    isOpen,
    openModal,
    closeModal,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export default AppProvider;

import { Dispatch, SetStateAction, createContext } from 'react';


interface AgentToolkit {
  name: string;
  agent_toolkit: string;
}
export interface AppContextProps {
  count: number;
  increment: () => void;
  decrement: () => void;
  currentModel: string, 
  setCurrentModel: Dispatch<SetStateAction<string>>;
  settingSelected: string;
  setSettingSelected: Dispatch<SetStateAction<string>>;
  agentToolkitSelected: string,
  setAgentToolkitSelected: Dispatch<SetStateAction<string>>;
  agentTyoeSelected: string,
  setAgentTyoeSelected:Dispatch<SetStateAction<string>>;
  setCurrentAgentToolkitSelected: Dispatch<SetStateAction<AgentToolkit[]>>;
  currentAgentToolkitSelected: AgentToolkit[];
  settings : {
    chat: string,
    retrival: string,
    agent: string
  };
  toolkitTypes : {
    general: string,
    sql_database: string,
    excel_sheet: string
  };
  tools: string[];
  pdfFiles: any[],
  setPdfFiles:Dispatch<SetStateAction<any[]>>;
  isOpen: boolean,
  openModal: () => void,
  closeModal: () => void,
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export default AppContext;

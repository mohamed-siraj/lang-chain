import { Tabs, TabList, Tab, TabPanels, TabPanel, RadioGroup, Stack, Flex, Radio, Spacer, Text as ChakraText } from '@chakra-ui/react'
import React from 'react'
import { useAppSelector } from '../../app/hooks';
import useAppContext from '../../context/useAppContext';

const SourceType = () => {
    const [value, setValue] = React.useState<any>()

    const { settingSelected, setSettingSelected, settings, setCurrentAgentToolkitSelected } = useAppContext();

    const { databases } = useAppSelector((state) => state.database);
    const { sheets } = useAppSelector((state) => state.sheets);
    
    console.log(value, "value", settingSelected);
    
    const getType = (original_sheet_name: string) => {
        const extension = original_sheet_name.split('.').pop();
        return extension === 'db' ? 'databases' : extension;
    };
    
    const commonArray = databases.map(item => {
        return {
            name: item.database_name,
            type: 'database',
            agent_toolkit: "sql_database",
            ...item 
        };
    }).concat(sheets.map(item => {
        return {
            name: item.original_sheet_name,
            type: getType(item.original_sheet_name),
            agent_toolkit: "excel_sheet",
            ...item
        };
    }));

    const onChangeSources = (name: any) => {
        const selectedSource = commonArray.filter(item => item.name === name);
        setCurrentAgentToolkitSelected(selectedSource);
        setValue(name)
    }

    const onTabChange = (index: number) => {
        if(index === 0) {
            setSettingSelected(settings.chat)
        } else {
            setSettingSelected(settings.agent)
        }
    }

    return (
        <Tabs variant='unstyled' onChange={onTabChange}>
            <TabList h="24px" w="100%">
                <Tab _selected={{ color: 'white', bg: '#1A1A1A' }} bg="#FFFFFF" w="119px" borderRadius="6px" fontFamily="IBM Plex Sans" fontSize="13px">Chat</Tab>
                <Tab _selected={{ color: 'white', bg: '#1A1A1A' }} bg="#FFFFFF" w="119px" borderRadius="6px" fontFamily="IBM Plex Sans" fontSize="13px">Sources</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                </TabPanel>
                <TabPanel w="100%" px={0}>
                    <RadioGroup onChange={(e: any) => onChangeSources(e)} value={value}>
                        <Stack direction='column' gap={0}>
                        {commonArray.map((item, index) => (
                            <Flex
                                align="center"
                                background={item.name === value ? "var(--text-normal-hover, #E6E6E6)" : "var(--text-normal-hover, #FFF)"}
                                borderRadius={index === 0 ? "10px 10px 0px 0px" : index === commonArray.length - 1 ? "0px 0px 10px 10px" : "0px 0px 0px 0px"}
                                h="36px"
                                key={item.name}
                            >
                                <Radio value={item.name} px="10px" mr="2" colorScheme="gray">
                                    <ChakraText fontFamily="IBM Plex Sans" fontSize="13px">
                                        {item.name} ({item.type})
                                    </ChakraText>
                                </Radio>
                                <Spacer />
                            </Flex>
                        ))}
                        </Stack>
                    </RadioGroup>
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default SourceType
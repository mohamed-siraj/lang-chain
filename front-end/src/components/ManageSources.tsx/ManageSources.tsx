import { Text as ChakraText, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Tabs, TabList, Tab, TabPanels, TabPanel, Flex, FormControl, FormLabel, Input, Button, Divider, AbsoluteCenter, ModalFooter, Box } from '@chakra-ui/react';
import React, { FC, useEffect } from 'react';
import ConnectionStringCard from '../ConnectionStringCard/ConnectionStringCard';
import FileUpload from '../FileUpload/FileUpload';
import FilesCardCard from '../FilesCard/FilesCard';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchAll } from '../../features/database/database.service';
import { fetchAll as fetchAllSheets, remove } from '../../features/sheets/sheets.service';
import AddDatabase from '../AddDatabase/AddDatabase';
import AddFiles from '../AddFiles/AddFiles';
import useAppContext from '../../context/useAppContext';
interface ManageSourcesModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  const ManageSources: FC<ManageSourcesModalProps> = ({
    isOpen,
    onClose
  }) => {

  const { databases } = useAppSelector((state) => state.database);
  const { sheets } = useAppSelector((state) => state.sheets);
  const { pdfFiles } = useAppContext();
  const dispatch = useAppDispatch();
  // Sample data
  const connectionStrings = [
    {
      title: 'Connection 1',
      description: 'This is the description for Connection 1.',
    },
    {
      title: 'Connection 2',
      description: 'This is the description for Connection 2.',
    },
  ];

  // Example click handlers
  const handleViewClick = () => {
    console.log('View clicked');
    // Implement logic for viewing connection string
  };

  const handleDeleteSheet = (title: string) => {
    console.log('Delete clicked', title);
    
    const payload = {
      url: `/sheets/${title}`,
      data: {},
    };

    dispatch(remove(payload))
    .then(() => {
      //setIsLoading(false);
    })
    .catch(() => {
      //setIsLoading(false);
    });
    // Implement logic for deleting connection string
  };

  useEffect(() => {
    fetchAllData();
    fetchAllSheetsData();
  }, []);
  
  const fetchAllData = () => {
    const payload = {
      url: "/databases",
      data: {},
    };

    dispatch(fetchAll(payload))
      .then(() => {
        //setIsLoading(false);
      })
      .catch(() => {
        //setIsLoading(false);
      });
  };

  const fetchAllSheetsData = () => {
    const payload = {
      url: "/sheets",
      data: {},
    };

    dispatch(fetchAllSheets(payload))
      .then(() => {
        //setIsLoading(false);
      })
      .catch(() => {
        //setIsLoading(false);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", lg: "xl" }} scrollBehavior="inside">
    <ModalOverlay />
    <ModalContent bg="white" maxW={{ base:"auto" , lg:"68rem" }} h="48rem" overscrollBehavior={"inside"}>
      <ModalHeader>Manage Sources </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Tabs variant='unstyled'>
          <TabList h="38px" w="100%">
            <Tab _selected={{ color: 'white', bg: '#1A1A1A' }} bg="#FFFFFF" border="1px solid var(--text-normal-hover, #E6E6E6)" w="119px" borderRadius="6px" fontFamily="IBM Plex Sans" fontSize="16px">Database</Tab>
            <Tab _selected={{ color: 'white', bg: '#1A1A1A' }} bg="#FFFFFF" border="1px solid var(--text-normal-hover, #E6E6E6)" w="119px" borderRadius="6px" fontFamily="IBM Plex Sans" fontSize="16px">Files</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <ChakraText
                fontFamily="Red Hat Display"
                fontSize="28px"
              >
                Databases
              </ChakraText>

              <Flex
                direction={{ base: 'column', md: 'row' }}
                justify={{ base: 'start', lg: 'start' }}
                px={0}
                py={4}
                gap={4}
              >
                {/* Left side content */}
                <Flex direction="column" w={{ base:"100%" }} gap={2}>
                {databases.map((connection, index) => (
                    <ConnectionStringCard
                      key={index}
                      database={connection}
                      onButtonClick1={handleViewClick}
                      onButtonClick2={() => {}}
                    />
                  ))}
                </Flex>
                
                {/* Right side content */}
                <Flex  align={{ base: 'start', lg: 'start' }}  w="100%" direction="column" ml={{base: "0px", lg: "32px"}}>
                  <AddDatabase />
                </Flex>
              </Flex>
            </TabPanel>
            <TabPanel px={0}>
            <ChakraText
                fontFamily="Red Hat Display"
                fontSize="28px"
              >
                Files
              </ChakraText>
              <Flex
                direction={{ base: 'column', md: 'row' }}
                justify={{ base: 'start', lg: 'start' }}
                px={0}
                py={4}
                gap={4}
              >
                {/* Left side content */}
                <Flex direction="column" w={{ base:"100%" }} gap={2}>
                  {sheets.map((sheet, index) => (
                    <FilesCardCard
                      key={index}
                      title={sheet.original_sheet_name}
                      description={sheet.sheet_name}
                      onButtonClick1={handleViewClick}
                      onDelete={handleDeleteSheet}
                      callback={fetchAllSheetsData}
                    />
                  ))}

                  {pdfFiles.map((pdf, index) => (
                    <FilesCardCard
                      key={index}
                      title={pdf.name}
                      description={pdf.name}
                      onButtonClick1={handleViewClick}
                      onDelete={handleDeleteSheet}
                      callback={fetchAllSheetsData}
                    />
                  ))}

                </Flex>
                
                {/* Right side content */}
                <Flex  align={{ base: 'start', lg: 'start' }}  w="100%" direction="column" ml={{base: "0px", lg: "32px"}}>
                  <AddFiles />
                </Flex>
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalBody>

      <ModalFooter>
      </ModalFooter>
    </ModalContent>
  </Modal>
  )
}

export default ManageSources
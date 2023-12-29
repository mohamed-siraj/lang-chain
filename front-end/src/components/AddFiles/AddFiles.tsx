import React, { useState } from 'react';
import { Text as ChakraText, Flex, FormControl, FormLabel, Input, Button, AbsoluteCenter, Box, Divider } from '@chakra-ui/react';
import FileUpload from '../FileUpload/FileUpload';
import { useAppDispatch } from "../../app/hooks";
import { create } from '../../features/sheets/sheets.service';
import { createObjFromLink, createPdfLink } from '../../features/indexes/indexes.service';
import useAppContext from '../../context/useAppContext';

const AddFiles = () => {
    const dispatch = useAppDispatch();
    
    const { setPdfFiles } = useAppContext();
    const [isUploading, setIsUploading] = useState(false);
    const [fileData, setFileData] = useState<{
        excel_sheet: File | undefined | null;
        pdf_files: File[];
    }>({
        excel_sheet: null,
        pdf_files: [],
    });

    const [url, setUrl] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUrl(value);
    };

    const handleFileUpload = (files: File[] | undefined) => {
        if (files && files.length > 0) {
            const pdfFiles = files.filter((file) => file.name.endsWith('.pdf'));
            const excelSheet = files.find((file) => !file.name.endsWith('.pdf'));
            setFileData((prevData) => ({
                ...prevData,
                excel_sheet: excelSheet || null,
                pdf_files: pdfFiles,
            }));
        } else {
            setFileData((prevData) => ({
                ...prevData,
                excel_sheet: null,
                pdf_files: [],
            }));
        }
    };

    const saveFiles = () => {
        setIsUploading(true);
        if (fileData.excel_sheet) {
            uploadExcelFile();
        }
        if (fileData.pdf_files && fileData.pdf_files.length > 0) {
            uploadPdfFiles();
        } else {
            setIsUploading(false);
        }
    };

    const uploadExcelFile = () => {
        if (!fileData.excel_sheet) {
            setIsUploading(false);
            return;
        }

        const formData = new FormData();
        formData.append('excel_sheet', fileData.excel_sheet);

        const payload = {
            url: "/sheets",
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        dispatch(create(payload))
            .then(() => {
                setIsUploading(false);
                setFileData((prevData) => ({
                    ...prevData,
                    excel_sheet: null,
                }));
            })
            .catch((err) => {
                // Handle the error
            });
    };

    const uploadPdfFiles = async () => {
        try {
            if (fileData.pdf_files.length === 0) {
                setIsUploading(false);
                return;
            }
    
            const formData = new FormData();
            formData.append('pdf_files', fileData.pdf_files[0]);
    
            const token = localStorage.getItem("@accessToken") || localStorage.getItem("@refreshToken");
    
            // Upload PDF files
            const uploadResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/indexes/multifile/`, {
                method: 'POST',
                body: formData,
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (!uploadResponse.ok) {
                throw new Error(`HTTP error! Status: ${uploadResponse.status}`);
            }
    
            // Handle success of the upload
            const uploadData = await uploadResponse.json();
            setIsUploading(false);
            setFileData((prevData) => ({
                ...prevData,
                pdf_files: [],
            }));
    
            // Fetch data after upload
            const fetchDataResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/indexes/`, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (!fetchDataResponse.ok) {
                throw new Error(`HTTP error! Status: ${fetchDataResponse.status}`);
            }
    
            const fetchData = await fetchDataResponse.json();
            setPdfFiles(fetchData)
            console.log(fetchData, "fetchData");
        } catch (error) {
            // Handle errors
            console.error('Error:', error);
            setIsUploading(false);
        }
    };

    const createObjectFromUrl = () => {
        const payload = {
            url: "/indexes/Langchain/read_url",
            data: {
                url: url,
            },
        };

        dispatch(createObjFromLink(payload))
            .then(() => {
                setIsUploading(false);
                setUrl("");
            })
            .catch((err) => {
                // Handle the error
            });
    };

    return (
        <>
            <ChakraText
                fontFamily="Red Hat Display"
                fontSize="23px"
            >
                Upload File
            </ChakraText>
            <FormLabel htmlFor='files' fontSize={{ base: '13', lg: '13' }} color="#595959">
                Supports .PDF and other files
            </FormLabel>
            <Flex direction="column" gap={4} color="gray.900" boxSize={{ base: "100%", lg: "100%" }}>
                <FormControl>
                    <FileUpload handleFileUpload={handleFileUpload} isUploading={isUploading} fileData={fileData} />
                </FormControl>
                <Button variant="primary" w="100%" mt="10px" lineHeight={2} onClick={saveFiles}> Upload </Button>
            </Flex>

            <Box position='relative' padding='10' w="100%">
                <Divider />
                <AbsoluteCenter bg='white' px='4'>
                    OR
                </AbsoluteCenter>
            </Box>

            <ChakraText
                fontFamily="Red Hat Display"
                fontSize="23px"
            >
                Add a Webpage URL
            </ChakraText>
            <FormControl pt="12px">
                <FormLabel htmlFor='url' fontSize={{ base: '14', lg: '16' }}>URL</FormLabel>
                <Input
                    id='url'
                    name='url'
                    type='text'
                    placeholder='https://en.wikipedia.org/earth'
                    color="#CCC"
                    fontFamily="IBM Plex Sans"
                    value={url}
                    onChange={handleInputChange} />
                <Button variant="primary" w="100%" mt="10px" lineHeight={2} onClick={createObjectFromUrl}> Add </Button>
            </FormControl>
        </>
    );
};

export default AddFiles;

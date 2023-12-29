import React, { useRef, ChangeEvent } from 'react';
import { Box, Text, Input, VStack, Flex } from '@chakra-ui/react';
import FileIcon from '../../assets/icons/FileIcon';

type UploadProps = {
  handleFileUpload: (files: File[] | undefined) => void;
  isUploading: boolean;
  fileData: {
    excel_sheet: File | undefined | null;
    pdf_files: File[];
  };
};

const FileUpload: React.FC<UploadProps> = ({ handleFileUpload, isUploading = false, fileData }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles: File[] | undefined = event.target.files
      ? Array.from(event.target.files)
      : undefined;
    handleFileUpload(selectedFiles);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <VStack
      display="flex"
      width="100%"
      height="90px"
      padding="10px"
      justifyContent="center"
      alignItems="center"
      gap="10px"
      flexShrink={0}
      borderRadius="10px"
      border="1px dashed var(--text-dark, #BFBFBF)"
    >
      <Input
        type="file"
        ref={fileInputRef}
        display="none"
        onChange={handleFileChange}
        disabled={isUploading}
        multiple  // Allow multiple file selection
      />
      <Flex
        as="label"
        htmlFor="fileInput"
        onClick={openFileDialog}
        cursor="pointer"
      >
        <FileIcon />
        <Text
          color="var(--main-text, #1A1A1A)"
          textAlign="center"
          fontFamily="IBM Plex Sans"
          fontSize="19px"
          fontStyle="normal"
          fontWeight={600}
          lineHeight="120%"
        >
          {isUploading
            ? 'Uploading...'
            : fileData.pdf_files.length === 0 &&
              (fileData.excel_sheet?.name == null ||
                fileData.excel_sheet?.name === undefined)
            ? 'Choose File to Upload'
            : fileData.pdf_files.length > 0
            ? `${fileData.pdf_files.length} PDF files selected`
            : fileData.excel_sheet?.name}
        </Text>
      </Flex>
    </VStack>
  );
};

export default FileUpload;

import React, { useState } from 'react';
import { Text as ChakraText, Flex, FormControl, FormLabel, Input, Button, Select } from '@chakra-ui/react';
import FileUpload from '../FileUpload/FileUpload';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { create } from '../../features/database/database.service';

const AddDatabase = () => {
  const dispatch = useAppDispatch();

  const [form_data, setFormData] = useState({
    database_name: '',
    database_type: '',
    connection_string: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const saveDatabase = () => {
    const payload = {
      url: "/databases",
      data: {
        database_name: form_data.database_name,
        connection_string: form_data.connection_string,
      },
    };

    dispatch(create(payload))
      .then(() => {
        setFormData({
            database_name: '',
            database_type: '',
            connection_string: '',
        })
      })
      .catch((err) => {
      });
  };

  return (
    <>
      <ChakraText fontFamily="Red Hat Display" fontSize="23px" pb="24px">
        Add Database
      </ChakraText>
      <Flex direction="column" gap={4} color="gray.900" boxSize={{ base: '100%', lg: '100%' }}>
        <FormControl>
          <FormLabel htmlFor="database_name" fontSize={{ base: '14', lg: '16' }}>
            Database name
          </FormLabel>
          <Input
            id="database_name"
            name="database_name"
            type="text"
            placeholder="Enter your username"
            value={form_data.database_name}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="database_type" fontSize={{ base: '14', lg: '16' }}>
            Database Type
          </FormLabel>
          <Select
            placeholder="Select option"
            name="database_type"
            value={form_data.database_type}
            onChange={handleInputChange}
          >
            <option value="SQL">SQL</option>
            <option value="BigQuery">BigQuery</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="connection_string" fontSize={{ base: '14', lg: '16' }}>
            Connection String
          </FormLabel>
          <Input
            id="connection_string"
            name="connection_string"
            type="text"
            placeholder="Enter Connection String"
            value={form_data.connection_string}
            onChange={handleInputChange}
          />
        </FormControl>
        {form_data.database_type === 'BigQuery' && (
          <FormControl>
            <FormLabel htmlFor="uploadFile" fontSize={{ base: '14', lg: '16' }}>
              Upload Certificate File
            </FormLabel>
            <FormLabel htmlFor="uploadFile" fontSize={{ base: '13', lg: '13' }} color="#595959">
              Supports .PEM files
            </FormLabel>
            {/* <FileUpload /> */}
          </FormControl>
        )}
        <Button variant="primary" w="100%" mt="10px" lineHeight={2} onClick={saveDatabase}>
          Add database
        </Button>
      </Flex>
    </>
  );
};

export default AddDatabase;

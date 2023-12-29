import React, { ChangeEvent } from 'react';
import { Flex, Radio, Spacer, IconButton, Text as ChakraText } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

interface RadioButtonProps {
  label: string;
  value: string;
  isFirst: boolean;
  isLast: boolean;
  onEditClick: () => void;
  handleChange:(event: ChangeEvent<HTMLInputElement>) => void;
  isSelected: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({ label, value, isFirst, isLast, onEditClick, handleChange, isSelected }) => {

//   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
//     console.log('Radio button changed!', event.target.value, isSelected, value);
//     setIsSelected(event.target.value)
//   };

  return (
    <Flex
      align="center"
      background={isSelected === value ? "var(--text-normal-hover, #E6E6E6)" : "white" }
      borderRadius={
        isFirst ? '10px 10px 0px 0px' : isLast ? '0px 0px 10px 10px' : '0px 0px 0px 0px'
      }
    >
      <Radio value={value} px="10px" mr="2" colorScheme="gray" onChange={handleChange} checked={isSelected === value ? true: false}>
        {label && (
          <ChakraText fontFamily="IBM Plex Sans" fontSize="13px">
            {label}
          </ChakraText>
        )}
      </Radio>
      <Spacer />
      <IconButton
        aria-label="Edit"
        icon={<InfoIcon />}
        background={isSelected === value ? "var(--text-normal-hover, #E6E6E6)"  : "white"}
        onClick={onEditClick}
      />
    </Flex>
  );
};

export default RadioButton;

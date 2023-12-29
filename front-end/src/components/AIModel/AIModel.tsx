import { Flex, RadioGroup, Stack, Text as ChakraText } from '@chakra-ui/react'
import React, { ChangeEvent, useEffect } from 'react'
import RadioButton from '../RadioButton/RadioButton'
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchAll } from '../../features/models/models.service';
import useAppContext from '../../context/useAppContext';

const AIModel = () => {
    const dispatch = useAppDispatch();
    const [value, setValue] = React.useState('1')
    const { currentModel, setCurrentModel, setSettingSelected, settingSelected, settings } = useAppContext();
    const { models } = useAppSelector((state) => state.models);
    const [isSelected, setIsSelected] = React.useState(currentModel);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setIsSelected(event.target.value)
        setCurrentModel(event.target.value)
    };

    console.log(currentModel, "currentModel", models);
    

    useEffect(() => {
        fetchAllData();
      }, []);
      
      const fetchAllData = () => {
        const payload = {
          url: "/models",
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

    return (
        <Flex direction="column">
            <ChakraText
                fontFamily="IBM Plex Sans"
                fontSize="13px"
                color="#1A1A1A"
                lineHeight="120%"
                mt="15px"
                mb="10px"
            >
                Model
            </ChakraText>

            <RadioGroup onChange={setValue} value={value}>
                <Stack direction="column" gap={0}>
                    {models.map((option, index) => (
                        <RadioButton
                            key={option.name}
                            label={option.name}
                            value={option.name}
                            isFirst={index === 0}
                            isLast={index === models.length - 1}
                            onEditClick={() => console.log(`Edit button clicked for option ${option.name}`)}
                            handleChange={handleChange}
                            isSelected={currentModel}
                        />
                    ))}
                </Stack>
            </RadioGroup>
        </Flex>
    )
}

export default AIModel
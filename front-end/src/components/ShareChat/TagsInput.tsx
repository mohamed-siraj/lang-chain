import { useState } from 'react';
import { Input, Tag, TagLabel, TagCloseButton, Flex, Box, Text } from '@chakra-ui/react';

interface TagsInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

const TagsInput: React.FC<TagsInputProps> = ({ tags, onAddTag, onRemoveTag }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isEmailValid = (email: string): boolean => {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null); // Reset error when input changes
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const trimmedValue = inputValue.trim();

      if (trimmedValue === '') {
        setError('Please enter a valid email.'); // Show error for empty input
        return;
      }

      if (!isEmailValid(trimmedValue)) {
        setError('Please enter a valid email.'); // Show error for invalid email format
        return;
      }

      onAddTag(trimmedValue);
      setInputValue('');
    }
  };

  const handleTagRemove = (tag: string) => {
    onRemoveTag(tag);
  };

  return (
    <div>
      <Flex flexWrap="wrap">
        {tags.map((tag) => (
          <Tag key={tag} size="md" variant="subtle" colorScheme="teal">
            <TagLabel>{tag}</TagLabel>
            <TagCloseButton onClick={() => handleTagRemove(tag)} />
          </Tag>
        ))}
      </Flex>
      <Flex>
        <Input
          placeholder="Enter emails..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
      </Flex>
      {error && <Text color="red.500">{error}</Text>}
    </div>
  );
};

export default TagsInput;

import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button
} from '@chakra-ui/react';
import TagsInput from './TagsInput';

interface ShareChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareChat: React.FC<ShareChatProps> = ({ isOpen, onClose }) => {

  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = (tag: string) => {
    setTags([...tags, tag]);
  };

  const handleRemoveTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
           <TagsInput tags={tags} onAddTag={handleAddTag} onRemoveTag={handleRemoveTag} />
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary">Login</Button>
          <Button variant='ghost'>Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ShareChat;

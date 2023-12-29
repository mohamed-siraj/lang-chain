import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

interface SidebarProps {
  children: ReactNode;
  w?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ children, w = "360px" }) => {
  return (
    <Box w={w} bg="gray.200" p="4" display={{ base: 'none', lg: 'flex' }}>
      {children}
    </Box>
  );
};

export default Sidebar;

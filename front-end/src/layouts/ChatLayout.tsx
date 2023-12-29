import { Box, Flex } from "@chakra-ui/react";
import Navbar from "../components/NavBar/NavBar";
import Sidebar from "../components/SideBar/SideBar";
import ChatTilesContainer from "../containers/Chat/ChatTilesContainer/ChatTilesContainer";
import { Outlet } from "react-router-dom";
import Settings from "../components/Settings/Settings";

const ChatLayout = () => {
  return (
    <div>
      <Flex direction="column" height="100vh">
        <Navbar />
        <Flex flex="1" overflow="hidden">

          <Sidebar>
            <ChatTilesContainer />
          </Sidebar>

          <Flex flex="1" p={{base: 0, lg: "4"}}>
            <Box flex="1" bg="white" px="20px" pt="8px">
                
                <Outlet />

            </Box>
          </Flex>

          <Sidebar w="272px">
            <Settings />
          </Sidebar>
        </Flex>
      </Flex>
    </div>
  );
};

export default ChatLayout;
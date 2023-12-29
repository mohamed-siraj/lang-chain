import { Outlet, useLocation } from "react-router-dom";
import { Flex, Center } from "@chakra-ui/react";
import LandingBackgroundSVG from "../assets/backgrounds/landing_background.svg";
import LoginBackgroundSVG from "../assets/backgrounds/login_background.svg";

const PublicLayout = () => {

    const location = useLocation();
    const backgroundSVG = location.pathname === '/' ? LandingBackgroundSVG : LoginBackgroundSVG;

    const backgroundStyle = {
        backgroundImage: `url(${backgroundSVG})`,
        backgroundSize: location.pathname === '/' ? "cover" : "", 
        backgroundRepeat: "no-repeat",
      };

    return (
        <Flex direction="column" style={backgroundStyle}>
            <Outlet />
        </Flex>
    );
};

export default PublicLayout;

import { TextProps, Text as ChakraText } from "@chakra-ui/react";

interface PropTypes extends TextProps {
    type?: "display" | "subDisplay" | "heading" | "subHeading" | "body-regular-lg" | "body-semibold-lg" | "body-regular" | "body-medium" | "body-regular-sm" | "body-medium-sm";
    children?: React.ReactNode;
}

const Text = ({ type = "body-regular", children, ...textProps }: PropTypes) => {
    const tp = { ...textProps };
    tp.color = tp.color ?? "gray.800";
    switch (type) {
        case "display":
            tp.fontFamily = "Red Hat Display, sans-serif";
            tp.fontSize = tp.fontSize ?? [32];
            tp.fontWeight = 900;
            tp.lineHeight = tp.lineHeight ?? ["35px", "48px"];

            break;
        case "subHeading":
            tp.fontFamily = "Red Hat Display, sans-serif";
            tp.fontWeight = "bold";
            tp.lineHeight = tp.lineHeight ?? ["24px", "30px"];
            tp.fontSize = tp.fontSize ?? [14, 16];
            break;
        case "body-regular":
            tp.fontFamily = tp.fontFamily ?? "IBM Plex Sans, sans-serif";
            tp.lineHeight = tp.lineHeight ?? "15.6px";
            tp.fontSize = tp.fontSize ?? [13, 16];
    }

    return <ChakraText {...tp}>{children}</ChakraText>;
};

export default Text;

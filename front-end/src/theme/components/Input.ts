import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const primary = defineStyle({
  fontFamily: "IBM Plex Sans, sans-serif",
  fontWeight: "400",
  borderRadius: "10px",
  border: "1px",
  borderColor: "var(--langX-colors-text-normalHover)",
  gap: "1px",
  px: "17px",
  py: "24px",
});

const Input = defineStyleConfig({
  baseStyle: {
    primary: primary,
  },
});

export default Input;

import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const secondary = defineStyle({
  width:"200px",
  background: `var(--langX-colors-text-normalHover)`,
  color: "black",
  _hover: {
    background: 'var(--langX-colors-text-normalActive)',
  },
  _disabled: {
    background: 'gray.300',
    color: 'gray.500',
    cursor: 'not-allowed',
  },
})

const primary = defineStyle({
  width:"200px",
  background: `var(--langX-colors-main-accent)`,
  color: "white",
  _hover: {
    background: 'var(--langX-colors-text-darkHover)',
  },
  _disabled: {
    background: 'gray.300',
    color: 'gray.500',
    cursor: 'not-allowed',
  },
})

const Button = defineStyleConfig({
  variants: { secondary, primary },
})

export default Button;
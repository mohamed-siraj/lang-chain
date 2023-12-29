import { extendTheme } from "@chakra-ui/react";
import type { GlobalStyleProps } from "@chakra-ui/theme-tools";

import Button from "./components/Button";
import Input from "./components/Input";
// import FormLabel from "./components/FormLabel";
// import Input from "./components/Input";
// import Skeleton from "./components/Skeleton";

const theme = extendTheme({
    /**
     * Only use global styles to access breakpoints and provide media query rules
     */
    styles: {
        global: (props: GlobalStyleProps) => ({
            [`@media screen and (max-width: ${props.theme.breakpoints.sm})`]: {
                ".react-datepicker": {
                    width: "100%"
                }
            }
        })
    },
    fonts: {
        body: "Red Hat Display, sans-serif",
        heading: "Georgia, serif",
        mono: "Menlo, monospace",
    },
    fontSizes: {
        xs: "0.75rem",
        sm: "0.875rem",
        md: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
        "7xl": "4.5rem",
        "8xl": "6rem",
        "9xl": "8rem",
    },
    fontWeights: {
        hairline: 100,
        thin: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
    },
    lineHeights: {
        normal: "normal",
        none: 1,
        shorter: 1.25,
        short: 1.375,
        base: 1.5,
        tall: 1.625,
        taller: "2",
        "3": ".75rem",
        "4": "1rem",
        "5": "1.25rem",
        "6": "1.5rem",
        "7": "1.75rem",
        "8": "2rem",
        "9": "2.25rem",
        "10": "2.5rem",
    },
    letterSpacings: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
    },
    colors: {
        white: {
            500: "#ffffff"
        },
        border: {
            light: "#D7D7D7"
        },
        danger: {
            light: "#FFE1E1",
            normal: "#FF6464"
        },
        background: {
            light: "#F6F6F6",
            white: "#FFFFFF"
        },
        other: {
            success: "#B5FFB4",
            failier: "#B5FFB4"
        },
        main: {
            accent: "#1A1A1A",
            text:  "#1A1A1A",
            background: "#FFFFFF",
            beige: "#FFECB1"
        },
        text: {
            light: "#ffffff",
            lightHover: "#ffffff",
            lightActive: "#ffffff",
            normal: "#ffffff",
            normalHover: "#e6e6e6",
            normalActive: "#cccccc",
            dark: "#bfbfbf",
            darkHover: "#999999",
            darkActive: "#737373",
            darker: "#595959"
        },
        gray: {
            50: "#fafafa",
            100: "#f7fafc",
            200: "#edf2f7",
            300: "#e2e8f0",
            400: "#cbd5e0",
            500: "#a0aec0",
            600: "#718096",
            700: "#4a5568",
            800: "#2d3748",
            900: "#1a202c"
        }
    },
    config: {
        cssVarPrefix: "langX"
    },
    components: { Button, Input }
});

export default theme;

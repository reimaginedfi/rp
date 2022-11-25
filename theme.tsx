import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { mode, createBreakpoints } from "@chakra-ui/theme-tools";

const breakpoints = createBreakpoints({
  sm: "380px",
  md: "720px",
  lg: "968px",
  xl: "1200px",
  "2xl": "1536px",
});

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

export const customTheme = {
  config,
  breakpoints,
  styles: {
    global: {
      html: {
        scrollBehavior: "smooth",
        fontDisplay: "swap",
      },
      body: {
        minHeight: "100vh",
      },
      svg: {
        display: "inline",
        verticalAlign: "bottom",
      },
    },
  },
  fonts: {
    heading: "PT Mono",
    body: "PT Mono",
  },
  colors: {
    transparent: "transparent",
    black: "#272727",
    black2: "#0A0607",
    white: "#FEFEFE",
    gray: "#B6B6B6"
  },
  components: {
    Heading: {
      variants: {
        giant: {
          fontFamily: "PT Mono",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "2.5rem",
          lineHeight: "2.25rem",
        },
        big: {
          fontFamily: "PT Mono",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "2rem",
          lineHeight: "2rem",
        },
        large: {
          fontFamily: "PT Mono",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "1.5rem",
          lineHeight: "1.75rem",
        },
        normal: {
          fontFamily: "PT Mono",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "1.325rem",
          lineHeight: "1.5rem",
        },
        small: {
          fontFamily: "PT Mono",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "1rem",
          lineHeight: "1.25rem",
        },
        micro: {
          fontFamily: "PT Mono",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "0.75rem",
          lineHeight: "1rem",
        },
      },
    },
    Text: {
      variants: {
        large: (props: any) => ({
          fontFamily: "PT Mono",
          fontWeight: "400",
          fontStyle: "normal",
          fontSize: "1.5rem",
          lineHeight: "1.5rem",
          color: mode("black", "white")(props),
        }),
        normal: (props: any) => ({
          fontFamily: "PT Mono",
          fontWeight: "400",
          fontStyle: "normal",
          fontSize: "1.25rem",
          lineHeight: "2rem",
          color: mode("black", "white")(props),
        }),
        link: (props: any) => ({
          fontFamily: "PT Mono",
          p: "8px",
          textDecoration: "underline",
          _hover:{
            bg: "none",
            cursor: "pointer",
            textColor: mode("#7E7E7E", "#858585")(props),
            textDecoration: "none"
          }
        }),
        small: (props: any) => ({
          fontFamily: "PT Mono",
          fontWeight: "400",
          fontStyle: "normal",
          fontSize: "1rem",
          lineHeight: "1.25rem",
          color: mode("black", "white")(props),
        }),
        label: (props: any) => ({
          fontFamily: "PT Mono",
          fontWeight: "400",
          fontStyle: "normal",
          color: mode("#858585", "#7E7E7E")(props),
          fontSize: "0.75rem",
          lineHeight: "1rem",
        }),
      },
    },
    Button: {
      variants: {
        primary: {
          bg: "none",
          borderRadius: "0px",
          p: "16px",
          color: "white",
          fontFamily: "PT Mono",
          _hover: {
            textDecoration: "none !important",
          },
          _focus: {
            boxShadow: "none",
          },
        },
      },
    },
    Modal: {
      baseStyle: (props: any) => ({
        dialog: {
          border: "solid 1px",
          borderRadius: "16px",
          borderColor: mode("#F3F3F3", "#232323")(props),
          bg: mode("#FCFCFC", "#161616")(props),
          w: { base: "85vw", md: "50vw" },
        },
      }),
    },
   },
};

const theme = extendTheme(customTheme);

export default theme;

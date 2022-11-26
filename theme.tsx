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
    lighttext: "#272727",
    darkbg: "#0A0607",
    darktext: "#B6B6B6",
    lightbg: "#FEFEFE",
  },
  components: {
    Heading: {
      variants: {
        giant: (props: any) => ({
          fontFamily: "PT Mono",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "2.5rem",
          lineHeight: "2.25rem",
          color: mode("lighttext", "darktext")(props)
        }),
        big: (props: any) => ({
          fontFamily: "PT Mono",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "2rem",
          lineHeight: "2rem",
          color: mode("lighttext", "darktext")(props)
        }),
        large: (props: any) => ({
          fontFamily: "PT Mono",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "1.5rem",
          lineHeight: "1.75rem",
          color: mode("lighttext", "darktext")(props)
        }),
        normal: (props: any) => ({
          fontFamily: "PT Mono",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "1.325rem",
          lineHeight: "1.5rem",
          color: mode("lighttext", "darktext")(props)
        }),
        small: (props: any) => ({
          fontFamily: "PT Mono",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "1rem",
          lineHeight: "1.25rem",
          color: mode("lighttext", "darktext")(props)
        }),
        micro: (props: any) => ({
          fontFamily: "PT Mono",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "0.75rem",
          lineHeight: "1rem",
          color: mode("lighttext", "darktext")(props)
        }),
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
          color: mode("lighttext", "darktext")(props)
        }),
        normal: (props: any) => ({
          fontFamily: "PT Mono",
          fontWeight: "400",
          fontStyle: "normal",
          fontSize: "1.25rem",
          lineHeight: "2rem",
          color: mode("lighttext", "darktext")(props)
        }),
        link: (props: any) => ({
          fontFamily: "PT Mono",
          p: "8px",
          textDecoration: "underline",
          color: mode("lighttext", "darktext")(props),
          _hover:{
            bg: "none",
            cursor: "pointer",
            textDecoration: "none"
          }
        }),
        small: (props: any) => ({
          fontFamily: "PT Mono",
          fontWeight: "400",
          fontStyle: "normal",
          fontSize: "1rem",
          lineHeight: "1.25rem",
          color: mode("lighttext", "darktext")(props)
        }),
        label: (props: any) => ({
          fontFamily: "PT Mono",
          fontWeight: "400",
          fontStyle: "normal",
          color: mode("lighttext", "darktext")(props),
          fontSize: "0.75rem",
          lineHeight: "1rem",
        }),
      },
    },
    Button: {
      variants: {
        primary: (props: any) => ({
          bg: mode("lightbg", "darkbg")(props),
          borderRadius: "0px",
          p: "0.75rem",
          color: mode("lighttext", "darktext")(props),
          fontFamily: "PT Mono",
          textDecoration: "underline",
          border:"1px solid",
          borderColor: mode("lighttext", "darktext")(props),
          _hover: {
            textDecoration: "none !important",
          },
          _focus: {
            boxShadow: "none",
          },
           _before: { position: "absolute", background: "inherit", content: '""', zIndex: "1", width: "80px", right: "calc(50% - 50px)", height: "calc(100% + 4px)", top: "10px" },
           _after: { position: "absolute", background: "inherit", content: '""', zIndex: "1", height: "35px", left: "-50px", width: "calc(100% + 40px)", top: "calc(50% - 27px)"          },
        }),
        connect: (props: any) => ({
          bg: "none",
          borderRadius: "0px",
          textDecoration:"underline",
          _hover:  {textDecoration: "none"},
          color: mode("lighttext", "darktext")(props),
        })
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

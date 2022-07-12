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
    heading: "Clash Display, Clash Display Variable",
    body: "InterVariable",
  },
  colors: {
    transparent: "transparent",
    black: "#161616",
    white: "#FCFCFC",
    brand: "#FF3636",
    secondary: "#9935ff",
    tertiary: "#3639ff",
    pink: "#F9589C",
    blew: "#58c6f9",
    gray: {
      100: "#d9d5d0",
      200: "#D7E0DD",
    },
  },
  components: {
    Heading: {
      variants: {
        giant: {
          fontFamily: "Clash Display",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "3.5rem",
          lineHeight: "3rem",
        },
        big: {
          fontFamily: "Clash Display",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "2.5rem",
          lineHeight: "2.5rem",
        },
        extralarge: {
          fontFamily: "Clash Display",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: ["2rem", "3rem", "3.5rem"],
          lineHeight: ["2rem", "3rem", "3.5rem"],
        },
        normal: {
          fontFamily: "Clash Display",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "1rem",
          lineHeight: "1rem",
        },
        large: {
          fontFamily: "Inter",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "1.5rem",
          lineHeight: "1.5re",
        },
        medium: {
          fontFamily: "Inter",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "1rem",
          lineHeight: "1rem",
        },
        small: {
          fontFamily: "Inter",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "0.875rem",
          lineHeight: "0.875rem",
        },
        micro: {
          fontFamily: "Inter",
          fontWeight: "700",
          fontStyle: "normal",
          fontSize: "0.75rem",
          lineHeight: "0.75rem",
        },
      },
    },
    Text: {
      variants: {
        large: {
          fontFamily: "Inter",
          fontWeight: "400",
          fontStyle: "normal",
          fontSize: "1rem",
          lineHeight: "1.5rem",
        },
        medium: {
          fontFamily: "Inter",
          fontWeight: "400",
          fontStyle: "normal",
          fontSize: "0.875rem",
          lineHeight: "1.5rem",
        },
        small: {
          fontFamily: "Inter",
          fontWeight: "400",
          fontStyle: "normal",
          fontSize: "0.75rem",
          lineHeight: "1.25rem",
        },
        label: (props: any) => ({
          fontFamily: "Inter",
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
          bg: "linear-gradient(180deg, #F3484F 0%, #C51E25 100%)",
          borderRadius: "8px",
          p: "16px",
          color: "white",
          fontFamily: "Inter",
          _hover: {
            bg: "linear-gradient(180deg, #F04A50 0%, #9F151B 100%)",
            textDecoration: "none !important",
          },
          _focus: {
            boxShadow: "none",
            bg: "linear-gradient(180deg, #D7484D 0%, #980E13 100%)",
          },
        },
        secondary: (props: any) => ({
          bg: mode(
            "linear-gradient(180deg, #F8F8F8 0%, #E8E8E8 100%)",
            "linear-gradient(180deg, #2C2C2C 0%, #1C1C1C 100%)"
          )(props),
          borderRadius: "8px",
          p: "16px",
          color: mode("black", "white")(props),
          fontFamily: "Inter",
          _hover: {
            bg: mode(
              "linear-gradient(180deg, #EDEDED 0%, #D6D6D6 100%)",
              "linear-gradient(180deg, #3B3B3B 0%, #1F1F1F 100%)"
            )(props),
            textDecoration: "none !important",
          },
          _focus: {
            boxShadow: "none",
            bg: mode(
              "linear-gradient(180deg, #EAEAEA 0%, #C8C8C8 100%)",
              "linear-gradient(180deg, #474747 0%, #242424 100%)"
            )(props),
          },
        }),
        tertiary: (props: any) => ({
          bg: mode("#FFEFEF", "#3C181A")(props),
          borderRadius: "8px",
          border: "1px solid",
          borderColor: mode("#FDD8D8", "#541B1F")(props),
          p: "16px",
          color: mode("black", "white")(props),
          fontFamily: "Inter",
          _hover: {
            bg: mode("#FFE5E5", "#481A1D")(props),
            textDecoration: "none",
          },
          _focus: { boxShadow: "none", bg: mode("#FDD8D8", "#541B1F")(props) },
        }),
        ghost: (props: any) => ({
          bg: mode("#F3F3F3", "#232323")(props),
          borderRadius: "8px",
          p: "16px",
          color: mode("black", "white")(props),
          fontFamily: "Inter",
          _hover: {
            bg: mode("#EDEDED", "#282828")(props),
            textDecoration: "none !important",
          },
          _focus: { boxShadow: "none", bg: mode("#E8E8E8", "#2E2E2E")(props) },
        }),
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
    Alert: {
      variants: {
        primaryBrown: {
          title: {
            color: "#EDEDED",
          },
          description: {
            color: "#EDEDED",
          },
          status: {},
          container: {
            bg: "#391A03",
            borderRadius: "8px",
            width: "343px",
            height: "48px",
            p: "16px",
            fontSize: "14px",
            lineHeight: "16px",
            fontFamily: "Inter",
          },
        },
        primaryGray: {
          title: {
            color: "#EDEDED",
          },
          description: {
            color: "#EDEDED",
          },
          container: {
            bg: "#232323",
            width: "21.375 rem",
            borderRadius: "8px",
            p: "16px",
            fontSize: "0.875rem",
            lineHeight: "1rem",
            fontFamily: "Inter",
          },
        },
        primaryGreen: {
          title: {
            color: "#3CB179",
          },
          description: {
            color: "#3CB179",
          },
          container: {
            bg: "#0F291E",
            width: "21.375 rem",
            borderRadius: "8px",
            p: "16px",
            fontSize: "0.875rem",
            lineHeight: "1rem",
            fontFamily: "Inter",
          },
        },
        primaryRed: {
          title: {
            color: "#F2555A",
          },
          description: {
            color: "#F2555A",
          },
          container: {
            bg: "#3C181A",
            width: "21.375 rem",
            borderRadius: "8px",
            p: "16px",
            fontSize: "0.875rem",
            lineHeight: "1rem",
            fontFamily: "Inter",
          },
        },
        orange: {
          title: {
            color: "#FEFCFB",
          },
          description: {
            color: "#FEFCFB",
          },
          container: {
            bg: "#F76808",
            width: "21.375 rem",
            borderRadius: "8px",
            p: "16px",
            fontSize: "0.875rem",
            lineHeight: "1rem",
            fontFamily: "Inter",
          },
        },
        secondaryGray: {
          title: {
            color: "#171717",
          },
          description: {
            color: "#171717",
          },
          container: {
            bg: "#E8E8E8",
            width: "21.375 rem",
            borderRadius: "8px",
            p: "16px",
            fontSize: "0.875rem",
            lineHeight: "1rem",
            fontFamily: "Inter",
          },
          icon: {
            color: "#171717",
          },
        },
        secondaryGreen: {
          title: {
            color: "#FBFEFC",
          },
          description: {
            color: "#FBFEFC",
          },
          container: {
            bg: "#30A46C",
            borderRadius: "8px",
            width: "21.375 rem",
            p: "16px",
            fontSize: "0.875rem",
            lineHeight: "1rem",
            fontFamily: "Inter",
          },
        },
        secondaryRed: {
          title: {
            color: "#FFFCFC",
          },
          description: {
            color: "#FFFCFC",
          },
          container: {
            bg: "#E5484D",
            borderRadius: "8px",
            width: "21.375 rem",
            p: "16px",
            fontSize: "0.875rem",
            lineHeight: "1rem",
            fontFamily: "Inter",
          },
        },
      },
    },
  },
};

const theme = extendTheme(customTheme);

export default theme;

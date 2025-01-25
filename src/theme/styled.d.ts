import "styled-components/native";

declare module "styled-components/native" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      tertiary: string;
      background: string;
      backgroundInput: string;
      backgroundGradient: [string, string];
    };
  }
}

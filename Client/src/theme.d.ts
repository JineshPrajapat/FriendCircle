import '@mui/material/styles';

// Extend the MUI `Theme` interface to include our custom properties
declare module '@mui/material/styles' {
  interface Theme {
    gradient: {
      primary: string;
      secondary: string;
    };
  }
  interface ThemeOptions {
    gradient?: {
      primary?: string;
      secondary?: string;
    };
  }
}
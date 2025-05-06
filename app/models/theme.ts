export interface Theme {
  id: string;
  restaurantId: string;
  name: string;
  isActive: boolean;
  colors: ThemeColors;
  typography: ThemeTypography;
  components: ThemeComponents;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
}

export interface ThemeTypography {
  fontFamily: {
    primary: string;
    secondary?: string;
  };
  fontSizes: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  fontWeights: {
    light: number;
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeights: {
    tight: string;
    normal: string;
    relaxed: string;
  };
}

export interface ThemeComponents {
  buttons: {
    borderRadius: string;
    padding: string;
    primaryBg: string;
    primaryText: string;
    secondaryBg: string;
    secondaryText: string;
  };
  cards: {
    borderRadius: string;
    boxShadow: string;
    padding: string;
  };
  inputs: {
    borderRadius: string;
    borderColor: string;
    focusBorderColor: string;
    padding: string;
  };
  menu: {
    categorySpacing: string;
    itemSpacing: string;
  };
}

export interface ThemePreview {
  id: string;
  name: string;
  isActive: boolean;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
} 
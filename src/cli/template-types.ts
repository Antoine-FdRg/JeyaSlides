import { BackgroundValue } from "../language-server/generated/ast";

export type TextStyleDefaults = {
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  align?: string;
  transformations?: ('bold' | 'italic' | 'underline')[];
};

export type TemplateTransition = {
  type: string;
  duration?: 'fast' | 'default' | 'slow';
};

export type TemplateContext = {
  titleElements?: any[];
  bodyElements?: any[];
  backgroundColor?: BackgroundValue;
  transition?: TemplateTransition;
  textDefaults?: {
    title?: TextStyleDefaults;
    subtitle?: TextStyleDefaults;
    text?: TextStyleDefaults;
  };
};

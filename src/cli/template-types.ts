export type TextStyleDefaults = {
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  align?: string;
  transformations?: ('bold' | 'italic' | 'underline')[];
};

export type TemplateContext = {
  titleElements?: any[];
  bodyElements?: any[];
  backgroundColor?: string;
  textDefaults?: {
    title?: TextStyleDefaults;
    subtitle?: TextStyleDefaults;
    text?: TextStyleDefaults;
  };
};

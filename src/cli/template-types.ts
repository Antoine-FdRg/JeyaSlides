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
    h1?: TextStyleDefaults;
    h2?: TextStyleDefaults;
    p?: TextStyleDefaults;
  };
};

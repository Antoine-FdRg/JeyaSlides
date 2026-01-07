import { Template } from '../language-server/generated/ast';
import { TemplateContext } from './template-types';

export function extractTextDefaults(template: Template) {
  const styles = template.defaults?.textStyles?.entries ?? [];
  const result: any = {};

  for (const entry of styles) {
    result[entry.key] = {
      fontFamily: entry.font?.name,
      fontSize: entry.font?.size,
      color: entry.font?.color,
      align: entry.align,
      transformations: entry.transformations
    };
  }

  return result;
}

export function resolveTextStyles(
  paragraphType: 'title' | 'subtitle' | 'text',
  elementStyle: any,
  template?: TemplateContext
): String[] {
  const styles: string[] = [];

  const key =
    paragraphType === 'title' ? 'h1' :
    paragraphType === 'subtitle' ? 'h2' : 'p';

  const defaults = template?.textDefaults?.[key];

  if (defaults?.fontFamily) styles.push(`font-family:${defaults.fontFamily};`);
  if (defaults?.fontSize) styles.push(`font-size:${defaults.fontSize}px;`);
  if (defaults?.color) styles.push(`color:${defaults.color};`);

  if (defaults?.transformations) {
    for (const t of defaults.transformations) {
      if (t === 'bold') styles.push('font-weight:bold;');
      if (t === 'italic') styles.push('font-style:italic;');
      if (t === 'underline') styles.push('text-decoration:underline;');
    }
  }

  if (elementStyle?.font) {
    if (elementStyle.font.name) styles.push(`font-family:${elementStyle.font.name};`);
    if (elementStyle.font.size) styles.push(`font-size:${elementStyle.font.size}px;`);
    if (elementStyle.font.color) styles.push(`color:${elementStyle.font.color};`);
  }

  return styles;
}

import fs from 'fs';
import { CompositeGeneratorNode, toString } from 'langium';
import path from 'path';
import {
  Element,
  Model,
  Presentation,
  Slide,
  Group,
  isGroup,
  Text,
  isText,
  isCode,
  Equation,
  isEquation,
  Paragraph,
  isParagraph,
  isList,
} from '../language-server/generated/ast';
import { extractDestinationAndName } from './cli-util';

const DEFAULT_ELEMENT_STYLES = ['width: fit-content;', 'padding: 5px;'];
const DEFAULT_TEXT_STYLE = 'margin: 0;';

export function generateRevealJsFile(model: Model, filePath: string, destination: string | undefined): string {
  const data = extractDestinationAndName(filePath, destination);
  const generatedFilePath = `${path.join(data.destination, data.name)}.html`;

  const fileNode = new CompositeGeneratorNode();
  generateRevealJs(model, fileNode);

  if (!fs.existsSync(data.destination)) {
    fs.mkdirSync(data.destination, { recursive: true });
  }
  fs.writeFileSync(generatedFilePath, toString(fileNode));
  return generatedFilePath;
}

function generateRevealJs(model: Model, fileNode: CompositeGeneratorNode) {
  // Generate HTML header
  fileNode.append(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presentation</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.5.0/reveal.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.5.0/theme/black.min.css">

    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"><\/script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"><\/script>

    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .equation-display {
            margin: 20px 0;
            text-align: center;
        }
        .equation-inline {
            display: inline;
        }
    </style>
</head>
<body>
    <div class="reveal">
        <div class="slides">`);

  // Generate slides for each presentation
  const presentations = model.presentations ?? [];
  for (const presentation of presentations) {
    generatePresentationSlides(presentation, fileNode);
  }

  fileNode.append(`
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.5.0/reveal.min.js"><\/script>
    <script>
        Reveal.initialize({
            hash: true,
            center: true,
            transition: 'slide',
            minScale: 0.2,
            maxScale: 2.0,
            disableLayout: true,
        });

    <\/script>
</body>
</html>`);
}

function generatePresentationSlides(presentation: Presentation, fileNode: CompositeGeneratorNode) {
  // Generate title slide
  let author = presentation.author ?? 'Anonymous';
  if (author.startsWith('"') && author.endsWith('"')) {
    author = author.substring(1, author.length - 1);
  }

  let title = presentation.name;
  if (title.startsWith('"') && title.endsWith('"')) {
    title = title.substring(1, title.length - 1);
  }

  fileNode.append(`
            <section>
                <h1>${title}</h1>
                <p>by ${author}</p>
            </section>`);

  // Generate content slides
  for (const slide of presentation.slides) {
    generateSlide(slide, fileNode);
  }
}

function generateSlide(slide: Slide, fileNode: CompositeGeneratorNode) {
  fileNode.append('<section style="width: 100%; height: 100%;">');
  for (const element of slide.elements) {
    generateElement(element, fileNode);
  }
  fileNode.append('</section>');
}

function generateGroup(group: Group, fileNode: CompositeGeneratorNode, styles: String[]) {
  fileNode.append('<div class="group"');
  if (styles.length > 0) {
    fileNode.append(` style="${styles.join(' ')}"`);
  }
  fileNode.append('>');
  // applyPosition(group.position); TODO
  // applyAnimation(group.animation); TODO

  for (const child of group.elements) {
    generateElement(child, fileNode);
  }

  fileNode.append('</div>');
}

function generateElement(element: Element, fileNode: CompositeGeneratorNode) {
  const styles: String[] = getElementStyles(element);
  if (isGroup(element)) return generateGroup(element, fileNode, styles);
  if (isText(element)) return generateText(element, fileNode, styles);
  // if (isImage(element)) return generateImage(element, fileNode, styles); TODO
  // if (isVideo(element)) return generateVideo(element, fileNode, styles); TODO
  // if (isQuiz(element)) return generateQuiz(element, fileNode, styles); TODO
  throw new Error(`Unhandled element type: ${element.$type}`);
}

function getElementStyles(element: Element): String[] {
  const styles: String[] = [...DEFAULT_ELEMENT_STYLES];
  if (!element.style) return styles;
  if (element.style.backgroundColor) {
    styles.push(`background-color: ${element.style.backgroundColor};`);
  }
  if (element.style.rotation) {
    styles.push(`transform: rotate(${element.style.rotation}deg);`);
  }
  styles.push(...(getSizeStyles(element) || []));
  styles.push(...(getFontStyles(element) || []));
  return styles;

  function getSizeStyles(element: Element): String[] | undefined {
    let sizeStyles: String[] = [];
    if (!element.style?.size) return;
    if (element.style.size.width) {
      sizeStyles.push(`width: ${element.style.size.width}%;`);
    }
    if (element.style.size.height) {
      sizeStyles.push(`height: ${element.style.size.height}%;`);
    }
    return sizeStyles;
  }

  function getFontStyles(element: Element): String[] | undefined {
    let fontStyles: String[] = [];
    if (!element.style?.font) return;
    if (element.style.font.name) {
      fontStyles.push(`font-family: ${element.style.font.name};`);
    }
    if (element.style.font.size) {
      fontStyles.push(`font-size: ${element.style.font.size}px;`);
    }
    if (element.style.font.color) {
      fontStyles.push(`color: ${element.style.font.color};`);
    }
    if (element.style.font.transformations) {
      for (const transformation of element.style.font.transformations) {
        switch (transformation) {
          case 'bold':
            fontStyles.push('font-weight: bold;');
            break;
          case 'italic':
            fontStyles.push('font-style: italic;');
            break;
          case 'underline':
            fontStyles.push('text-decoration: underline;');
            break;
        }
      }
    }
    return fontStyles;
  }
}

function generateText(text: Text, fileNode: CompositeGeneratorNode, styles: String[]) {
  fileNode.append('<div class="text"');
  if (styles.length > 0) {
    fileNode.append(` style="${styles.join(' ')}"`);
  }
  fileNode.append('>');

  if (isCode(text)) {
    // generateCode(text, fileNode); TODO
  } else if (isEquation(text)) {
    generateEquation(text, fileNode);
  } else if (isParagraph(text)) {
    generateParagraph(text, fileNode);
  } else if (isList(text)) {
    // generateList(text, fileNode); TODO
  } else {
    throw new Error(`Unsupported Text type: ${text.$type}`);
  }

  fileNode.append('</div>');
}

function generateParagraph(paragraph: Paragraph, fileNode: CompositeGeneratorNode) {
  switch (paragraph.type) {
    case 'title':
      fileNode.append(`<h1 style="${DEFAULT_TEXT_STYLE}">${paragraph.content}</h1>`);
      break;

    case 'subtitle':
      fileNode.append(`<h2 style="${DEFAULT_TEXT_STYLE}">${paragraph.content}</h2>`);
      break;

    case 'text':
      fileNode.append(`<p style="${DEFAULT_TEXT_STYLE}">${paragraph.content}</p>`);
      break;

    default:
      throw new Error(`Unknown paragraph type: ${paragraph.type}`);
  }
}

function generateEquation(equation: Equation, fileNode: CompositeGeneratorNode) {
  // Remove surrounding quotes from content if present
  let content = equation.content;
  if (content.startsWith('"') && content.endsWith('"')) {
    content = content.substring(1, content.length - 1);
  }

  // Display mode: block equation (centered, larger)
  // Inline mode: inline equation (smaller, within text flow)
  const isDisplay = equation.display ?? false;

  if (isDisplay) {
    // Block equation using \[...\] delimiters (MathJax display mode)
    fileNode.append(`<div class="equation-display">\\[${content}\\]</div>`);
  } else {
    // Inline equation using \\(...\\) delimiters (MathJax inline mode)
    fileNode.append(`<span class="equation-inline">\\(${content}\\)</span>`);
  }
}

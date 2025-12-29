import fs from 'fs';
import { CompositeGeneratorNode, toString } from 'langium';
import path from 'path';
import { Element, Model, Presentation, Slide, Group, isGroup, Text, isText, isCode, Paragraph, isParagraph, isList } from '../language-server/generated/ast';
import { extractDestinationAndName } from './cli-util';

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
    <style>
        body {
            font-family: Arial, sans-serif;
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
            width: 960,
            height: 700,
            margin: 0.1,
            minScale: 0.2,
            maxScale: 2.0
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
  fileNode.append('<section>');
  for (const element of slide.elements) {
    generateElement(element, fileNode);
  }
  fileNode.append('</section>');
}

function generateGroup(group: Group, fileNode: CompositeGeneratorNode) {
  fileNode.append('<div class="group">');
  // applyStyle(group.style); TODO
  // applyPosition(group.position); TODO
  // applyAnimation(group.animation); TODO

  for (const child of group.elements) {
    generateElement(child, fileNode);
  }

  fileNode.append('</div>');
}

function generateElement(element: Element, fileNode: CompositeGeneratorNode) {
  if (isGroup(element)) return generateGroup(element, fileNode);
  if (isText(element)) return generateText(element, fileNode);
  // if (isImage(element)) return generateImage(element, fileNode); TODO
  // if (isVideo(element)) return generateVideo(element, fileNode); TODO
  // if (isQuiz(element)) return generateQuiz(element, fileNode); TODO
  throw new Error(`Unhandled element type: ${element.$type}`);
}

function generateText(text: Text, fileNode: CompositeGeneratorNode) {
  fileNode.append('<div class="text">');

  if (isCode(text)) {
    // generateCode(text, fileNode); TODO
  } else if (isParagraph(text)) {
    generateParagraph(text, fileNode);
  } else if (isList(text)) {
    // generateList(text, fileNode); TODO
  } else {
    throw new Error(`Unsupported Text type: ${text.$type}`);
  }

  fileNode.append('</div>')
}

function generateParagraph(
  paragraph: Paragraph,
  fileNode: CompositeGeneratorNode
) {
  switch (paragraph.type) {
    case 'title':
      fileNode.append(`<h1>${paragraph.content}</h1>`);
      break;

    case 'subtitle':
      fileNode.append(`<h2>${paragraph.content}</h2>`);
      break;

    case 'text':
      fileNode.append(`<p>${paragraph.content}</p>`);
      break;

    default:
      throw new Error(`Unknown paragraph type: ${paragraph.type}`);
  }
}
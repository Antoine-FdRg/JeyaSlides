import fs from 'fs';
import { CompositeGeneratorNode, toString } from 'langium';
import path from 'path';
import { Model, Presentation, Slide } from '../language-server/generated/ast';
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
  const presentations = (model as any).presentations ?? [];
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
  // For now, generate a basic slide with elements content
  fileNode.append(`
            <section>
                <h2>Slide</h2>
                <p>Content will be rendered here</p>
            </section>`);
}

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
  Paragraph,
  isParagraph,
  isList,
  Image,
  isImage,
  Video,
  isVideo,
} from '../language-server/generated/ast';
import { extractDestinationAndName } from './cli-util';

export function generateRevealJsFile(model: Model, filePath: string, destination: string | undefined): string {
  const data = extractDestinationAndName(filePath, destination);
  const generatedFilePath = `${path.join(data.destination, data.name)}.html`;

  const fileNode = new CompositeGeneratorNode();
  generateRevealJs(model, fileNode, path.dirname(path.resolve(filePath)), data.destination);

  if (!fs.existsSync(data.destination)) {
    fs.mkdirSync(data.destination, { recursive: true });
  }
  fs.writeFileSync(generatedFilePath, toString(fileNode));
  return generatedFilePath;
}

let CURRENT_SOURCE_DIR = '.';
let CURRENT_OUTPUT_DIR = '.';

function generateRevealJs(model: Model, fileNode: CompositeGeneratorNode, sourceDir: string, outputDir: string) {
  CURRENT_SOURCE_DIR = path.resolve(sourceDir);
  CURRENT_OUTPUT_DIR = path.resolve(outputDir);
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
  if (isImage(element)) return generateImage(element as Image, fileNode);
  if (isVideo(element)) return generateVideo(element as Video, fileNode);
  // if (isQuiz(element)) return generateQuiz(element, fileNode); TODO
  throw new Error(`Unhandled element type: ${element.$type}`);
}

function sanitizeLink(link: string) {
  if (!link) return link;
  if (link.startsWith('"') && link.endsWith('"')) return link.substring(1, link.length - 1);
  if (link.startsWith("'") && link.endsWith("'")) return link.substring(1, link.length - 1);
  return link;
}

function isRemoteLink(link: string) {
  return /^https?:\/\//i.test(link) || link.startsWith('data:');
}

function copyLocalAssetIfNeeded(link: string): string {
  const clean = sanitizeLink(link);
  if (isRemoteLink(clean)) return clean;

  // Normalize Windows backslashes and trim leading slashes for relative paths
  const normalized = clean.replace(/\\/g, '/');
  const stripped = normalized.replace(/^\/+/, '');

  // Resolve local path relative to source dir. If the provided path looked absolute but doesn't exist,
  // try as relative (user may have used a leading backslash on Windows by mistake).
  let candidate =
    path.isAbsolute(normalized) && fs.existsSync(normalized) ? normalized : path.resolve(CURRENT_SOURCE_DIR, stripped);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    // Ensure output dir exists
    if (!fs.existsSync(CURRENT_OUTPUT_DIR)) fs.mkdirSync(CURRENT_OUTPUT_DIR, { recursive: true });
    const destName = path.basename(candidate);
    const destPath = path.join(CURRENT_OUTPUT_DIR, destName);
    try {
      fs.copyFileSync(candidate, destPath);
      return destName; // referenced relative to generated HTML file in output dir
    } catch (e) {
      // If copy fails, fall back to original link
      return clean;
    }
  }

  // If file doesn't exist, return the original link (may be intentionally relative elsewhere)
  return clean;
}

function generateImage(image: Image, fileNode: CompositeGeneratorNode) {
  const srcRaw = copyLocalAssetIfNeeded(image.link);
  const src = isRemoteLink(srcRaw) ? encodeURI(srcRaw) : srcRaw;
  fileNode.append(
    `<div class="image"><img src="${src}" alt="image" style="max-width:100%;height:auto;" onerror="this.style.display='none'"/></div>`,
  );
}

function generateVideo(video: Video, fileNode: CompositeGeneratorNode) {
  const raw = sanitizeLink(video.link);
  const ytEmbed = getYouTubeEmbed(raw);
  if (ytEmbed) {
    fileNode.append(
      `<div class="video"><iframe width="960" height="540" src="${ytEmbed}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`,
    );
    return;
  }

  const src = copyLocalAssetIfNeeded(raw);
  // Use HTML5 video for local/media files or direct raw file links; include <source> with MIME type
  const videoSrc = isRemoteLink(src) ? encodeURI(src) : src.replace(/\\/g, '/');
  fileNode.append(
    `<div class="video"><video controls style="max-width:100%;height:auto;"><source src="${videoSrc}" type="video/mp4">Your browser does not support the video tag.</source></video></div>`,
  );
}

function getYouTubeEmbed(link: string): string | null {
  if (!link) return null;
  const clean = sanitizeLink(link);
  // Match typical youtube URLs
  // https://www.youtube.com/watch?v=VIDEOID or https://youtu.be/VIDEOID
  const watchMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch && shortMatch[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  // Also accept already embedded form
  const embedMatch = clean.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch && embedMatch[1]) return `https://www.youtube.com/embed/${embedMatch[1]}`;
  return null;
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

  fileNode.append('</div>');
}

function generateParagraph(paragraph: Paragraph, fileNode: CompositeGeneratorNode) {
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

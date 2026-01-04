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

const DEFAULT_ELEMENT_STYLES = ['width: fit-content;', 'padding: 5px;'];
const DEFAULT_TEXT_STYLE = 'margin: 0;';

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
  const presentation = model.presentation;
  if (!presentation) {
    throw new Error('No presentation found');
  }
  generatePresentationSlides(presentation, fileNode);

  fileNode.append(`
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.5.0/reveal.min.js"><\/script>
    <script>
      // Open an image in a fullscreen overlay. Accepts an HTMLImageElement or a URL string.
      function openImageFullscreen(srcOrElem) {
        const src = typeof srcOrElem === 'string' ? srcOrElem : (srcOrElem && srcOrElem.src) || srcOrElem;
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.left = '0';
        overlay.style.top = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0,0,0,0.95)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '2147483647';
        overlay.onclick = function() { try { if (document.fullscreenElement) document.exitFullscreen(); } catch(e){}; document.body.removeChild(overlay); };
        const img = document.createElement('img');
        img.src = src;
        img.style.maxWidth = '98%';
        img.style.maxHeight = '98%';
        img.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
        overlay.appendChild(img);
        document.body.appendChild(overlay);
        // Try to request fullscreen on the overlay for native fullscreen when available
        try { if (overlay.requestFullscreen) overlay.requestFullscreen(); } catch(e) {}
      }
    <\/script>
    <script>
        Reveal.initialize({
            hash: true,
            center: true,
            transition: 'slide',
            minScale: 0.2,
            maxScale: 2.0,
            disableLayout: true,
            slideNumber: ${presentation.displaySlideNumber ?? false}
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
  if (isImage(element)) return generateImage(element, fileNode, styles);
  if (isVideo(element)) return generateVideo(element, fileNode, styles);
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

  const normalized = clean.replaceAll('\\', '/');
  const stripped = normalized.replace(/^\/+/, '');

  let candidate =
    path.isAbsolute(normalized) && fs.existsSync(normalized) ? normalized : path.resolve(CURRENT_SOURCE_DIR, stripped);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    if (!fs.existsSync(CURRENT_OUTPUT_DIR)) fs.mkdirSync(CURRENT_OUTPUT_DIR, { recursive: true });
    const destName = path.basename(candidate);
    const destPath = path.join(CURRENT_OUTPUT_DIR, destName);
    try {
      fs.copyFileSync(candidate, destPath);
      return destName;
    } catch (e) {
      console.error(`JeyaSlides generator: failed to copy asset '${candidate}' to '${destPath}': ${e}`);
      return clean;
    }
  }

  return clean;
}

function getYouTubeEmbed(link: string): string | null {
  if (!link) return null;
  const clean = sanitizeLink(link);
  const watchMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch?.[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  const shortMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch?.[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const embedMatch = clean.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch?.[1]) return `https://www.youtube.com/embed/${embedMatch[1]}`;
  return null;
}

function getMimeTypeFromFilename(filename: string): string {
  if (!filename) return 'video/mp4';
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'ogg':
      return 'video/ogg';
    case 'mpg':
    case 'mpeg':
      return 'video/mpeg';
    case 'wmv':
      return 'video/x-ms-wmv';
    default:
      return 'video/mp4';
  }
}

function generateImage(image: Image, fileNode: CompositeGeneratorNode, styles: String[]) {
  const srcRaw = copyLocalAssetIfNeeded(image.link);
  const src = isRemoteLink(srcRaw) ? encodeURI(srcRaw) : srcRaw;
  fileNode.append(`<div class="image"><img src="${src}" alt="image" `);
  if (styles.length > 0) {
    fileNode.append(` style="${styles.join(' ')}"`);
  }
  fileNode.append(` onclick="openImageFullscreen(this)" onerror="this.style.display='none'"/></div>`);
}

function generateVideo(video: Video, fileNode: CompositeGeneratorNode, styles: String[]) {
  const raw = sanitizeLink(video.link);
  const ytEmbed = getYouTubeEmbed(raw);
  if (ytEmbed) {
    fileNode.append(`<div class="video"><iframe `);
    if (styles.length > 0) {
      fileNode.append(`style="${styles.join(' ')}"`); //TODO: adapt size according to styles width="960" height="540"
    }
    fileNode.append(
      `src="${ytEmbed}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`,
    );
    return;
  }

  const src = copyLocalAssetIfNeeded(raw);
  const videoSrc = isRemoteLink(src) ? encodeURI(src) : src.replaceAll('\\', '/');
  const mime = getMimeTypeFromFilename(videoSrc);
  fileNode.append(`<div class="video"><video controls `);
  if (styles.length > 0) {
    fileNode.append(`style="${styles.join(' ')}"`);
  }
  fileNode.append(
    `><source src="${videoSrc}" type="${mime}">Your browser does not support the video tag.</source></video></div>`,
  );
}

function generateText(text: Text, fileNode: CompositeGeneratorNode, styles: String[]) {
  fileNode.append('<div class="text"');
  if (styles.length > 0) {
    fileNode.append(` style="${styles.join(' ')}"`);
  }
  fileNode.append('>');

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

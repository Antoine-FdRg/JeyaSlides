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
  List,
  Image,
  isImage,
  Video,
  isVideo,
  ZPosition,
  isCoordinatePosition,
  isBasicText,
  isQuiz,
  Quiz,
  Code,
  Plot,
  isPlot,
  isShorthandPosition,
  CoordinatePosition,
  SolidColor,
  BackgroundValue,
  GradientColor,
} from '../language-server/generated/ast';
import { extractDestinationAndName } from './cli-util';
import { parseTemplate } from './template-parser';
import { extractTemplateTransition, extractTextDefaults, resolveTextStyles } from './template-utils';
import { TemplateContext } from './template-types';

const DEFAULT_ELEMENT_STYLES = ['width: fit-content;', 'padding: 5px;'];
const DEFAULT_TEXT_STYLE = 'margin: 0;';
const ZINDEX_BACK_VALUE = -10;
const ZINDEX_FRONT_VALUE = 100;
let PLOT_COUNTER = 0;

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

/**
 * Generate Reveal.js HTML as a string without writing to file (for preview)
 */
export function generateRevealJsString(model: Model, sourceDir: string): string {
  const fileNode = new CompositeGeneratorNode();
  // For preview, don't copy assets, just use paths as-is
  generateRevealJs(model, fileNode, sourceDir, sourceDir);
  return toString(fileNode);
}

let CURRENT_SOURCE_DIR = '.';
let CURRENT_OUTPUT_DIR = '.';
let PROJECT_ROOT = '.';

function generateRevealJs(model: Model, fileNode: CompositeGeneratorNode, sourceDir: string, outputDir: string) {
  CURRENT_SOURCE_DIR = path.resolve(sourceDir);
  CURRENT_OUTPUT_DIR = path.resolve(outputDir);
  PROJECT_ROOT = path.resolve(__dirname, '..', '..');
  // Generate HTML header
  fileNode.append(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presentation</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.5.0/reveal.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.5.0/theme/black.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.5.0/theme/white.min.css">
    <link rel="stylesheet" href="https://unpkg.com/tldreveal/dist/bundle/index.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.5.0/plugin/highlight/monokai.css" />
    <script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
    <style>
  body { font-family: Arial, sans-serif; }

/* centre uniquement la slide qui contient un quiz */
.has-quiz{
  display: flex;
  align-items: center;
  justify-content: center;
}

/* conteneur (iframe + overlay) */
.quiz-layout{
  height: 90vh;
  position: relative;
  display: block;
  margin: 0; /* centré par .has-quiz, pas par margin auto */
}

/* iframe */
.quiz-main{
  width: 100%;
  height: 100%;
}

.quiz-main iframe{
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}

/* QR overlay */
.quiz-side{
  position: absolute;
  top: 0px;
  right: 2vw;
  z-index: 9999;

  width: auto;
  height: auto;

  background: rgba(20,20,20,0.92);
  color: #fff;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 14px 14px;
  border-radius: 12px;
  
}

.quiz-side .qr{
  background: #fff;
  padding: 10px;
  border-radius: 12px;
}

@media (max-width: 1100px){
  .quiz-side{ display:none; }
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
    <script src="https://unpkg.com/tldreveal/dist/bundle/index.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.5.0/plugin/highlight/highlight.js"><\/script>
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
          width: 2000, // large width to make tldreveal occupy the full space 
          height: 1125, // large height to make tldreveal occupy the full space
          minScale: 0.2,
          maxScale: 2.0,
          disableLayout: true,
          slideNumber: ${presentation.displaySlideNumber ?? false},
          scrollActivationWidth: undefined,
          plugins: [Tldreveal.Tldreveal(), RevealHighlight],
          tldreveal: {
            disableLayoutWarning: false,
          },
        });
    <\/script>
    <script src="../plugin/quiz/js/jquery.min.js"></script>
    <script src="../plugin/quiz/js/slickQuiz.js"></script>
    <script src="../plugin/quiz/js/quiz.js"></script>
<script>
  Reveal.on('ready', function () {
    prepareQuizzes({});
  });
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script>
  function renderQuizQRCodes(scope) {
    if (typeof QRCode !== 'function') return;

    const root = scope || document;
    root.querySelectorAll('[data-qr-target]').forEach((box) => {
      const target = box.getAttribute('data-qr-target');
      const id = box.getAttribute('data-qr-id');
      if (!id || !target) return;

      const el = document.getElementById(id);
      if (!el) return;

      if (el.getAttribute('data-qr-done') === '1') return;

      el.innerHTML = '';
      new QRCode(el, { text: target, width: 140, height: 140 });
      el.setAttribute('data-qr-done', '1');
    });
  }

  Reveal.on('ready', function () {
    renderQuizQRCodes(document);
  });

  Reveal.on('slidechanged', function (event) {
    // ne rend que la slide courante
    renderQuizQRCodes(event.currentSlide);
    if (window.Plotly) {
      Plotly.Plots.resize(event.currentSlide);
    }
  });
</script>
    <script>
      // Synchronize code explanations with Reveal.js fragments
      function updateCodeExplanations() {
        const currentSlide = document.querySelector('section.present');
        if (!currentSlide) return;
        
        // Get the current fragment index from data-fragment attribute
        const fragmentAttr = currentSlide.getAttribute('data-fragment');
        const currentFragment = fragmentAttr ? parseInt(fragmentAttr) : -1;
        
        // Find all explanation elements in the current slide
        const explanations = currentSlide.querySelectorAll('[class*="explain-"]');
        
        explanations.forEach(el => {
          // Extract the line number from class like "explain-1", "explain-2", etc.
          const match = el.className.match(/explain-(\\d+)/);
          if (match) {
            const lineNumber = parseInt(match[1]);
            if (currentFragment >= lineNumber-2) {
              el.style.opacity = '1';
              el.style.visibility = 'visible';
            } else {
              el.style.opacity = '0';
              el.style.visibility = 'hidden';
            }
          }
        });
      }
      
      // Initialize explanations on ready
      Reveal.on('ready', updateCodeExplanations);
      
      // Update on slide change
      Reveal.on('slidechanged', updateCodeExplanations);
      
      // Update on fragment shown/hidden
      Reveal.on('fragmentshown', updateCodeExplanations);
      Reveal.on('fragmenthidden', updateCodeExplanations);
    <\/script>

  </body>
  </html>`);
}

function loadTemplate(presentation: Presentation): TemplateContext | undefined {
  console.log('[Template] Loading template...');
  if (!presentation.template) return undefined;

  const templateName = sanitizeLink(presentation.template);
  const templateRoot = path.resolve(PROJECT_ROOT, 'templates', templateName);

  const templatePath = path.join(templateRoot, `${templateName}.sml`);

  if (!fs.existsSync(templatePath)) {
    console.warn(`Template '${templateName}' not found at ${templatePath}`);
    return undefined;
  }

  const templateModel = parseTemplate(templatePath);

  console.log('[Template] Requested template:', presentation.template);
  console.log('[Template] Template path:', templatePath);

  console.log('[Template] slots:', {
    title: templateModel.titleTemplate?.elements.length,
    body: templateModel.bodyTemplate?.elements.length,
  });

  return {
    titleElements: templateModel.titleTemplate?.elements,
    bodyElements: templateModel.bodyTemplate?.elements,
    backgroundColor: templateModel.defaults?.background?.color,
    textDefaults: extractTextDefaults(templateModel),
    transition: extractTemplateTransition(templateModel),
  };
}

function generatePresentationSlides(presentation: Presentation, fileNode: CompositeGeneratorNode) {
  const templateCtx = loadTemplate(presentation);
  presentation.slides.forEach((slide, index) => {
    generateSlide(slide, index, templateCtx, fileNode);
  });
}

type SlideMLTransition = { type: string; duration?: string } | undefined;

function getRevealTransitionAttributes(transition: SlideMLTransition): string {
  if (!transition) return '';

  const revealTransition = normalizeRevealTransitionValue(transition.type);
  const speedAttr = mapDurationToRevealSpeed(transition.duration);

  const attrs: string[] = [];
  if (revealTransition) attrs.push(`data-transition="${revealTransition}"`);
  if (speedAttr) attrs.push(`data-transition-speed="${speedAttr}"`);

  return attrs.length ? ' ' + attrs.join(' ') : '';
}

function normalizeRevealTransitionValue(value: string | undefined): string | undefined {
  if (!value) return undefined;

  const cleaned = value.trim().replaceAll(/\s+/g, ' ');
  const base = '(none|fade|slide|convex|concave|zoom)';
  const single = new RegExp(`^${base}(-in|-out)?$`);

  if (single.test(cleaned)) return cleaned;

  return undefined;
}

function mapDurationToRevealSpeed(duration: string | undefined): 'fast' | 'default' | 'slow' {
  if (duration === undefined) return 'default';
  if (duration !== 'fast' && duration !== 'default' && duration !== 'slow') {
    return 'default';
  }
  return duration;
}

function generateSlide(
  slide: Slide,
  index: number,
  template: TemplateContext | undefined,
  fileNode: CompositeGeneratorNode,
) {
const normalizedTransition =
  slide.transition
    ? {
        type: slide.transition.type,
        duration: slide.transition.duration ?? 'default',
      }
    : template?.transition
      ? {
          type: template.transition.type,
          duration: template.transition.duration ?? 'default',
        }
      : undefined;
  const transitionAttrs = getRevealTransitionAttributes(normalizedTransition);

  const bg = slide.backgroundColor ?? template?.backgroundColor;

  const slideStyle = `
    width: 100%;
    height: 100%;
    ${bg ? resolveBackground(bg) : ''}
  `;
  const hasQuiz = slide.elements.some((e) => isQuiz(e));
  fileNode.append(`<section${transitionAttrs} class="${hasQuiz ? 'has-quiz' : ''}" style="${slideStyle}">`);
  // Ajout d'un wrapper pour le contenu de la diapositive avec position relative
  fileNode.append(
    '<div class="slide-content" style="position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; padding: 2%" >',
  );

  const templateElements = index === 0 ? template?.titleElements : template?.bodyElements;

  templateElements?.forEach((el) => generateElement(el, fileNode, template));

  slide.elements.forEach((el) => generateElement(el, fileNode, template));

  fileNode.append('</div>');
  fileNode.append('</section>');
}

function generateGroup(
  group: Group,
  fileNode: CompositeGeneratorNode,
  styles: string[],
  animationData: AnimationData | undefined,
  template?: TemplateContext,
) {
  const groupStyles = [...styles];
  const grpPos = group.position;
  const hasPosition = grpPos && (grpPos.x || grpPos.y || grpPos.z); //TODO process general flat position
  if (!hasPosition) {
    groupStyles.unshift('position: relative;'); // position relative si le groupe n'a pas de position définie
  }
  const animationClass = animationData?.classes || '';
  const classAttr = animationClass ? `class="group ${animationClass}"` : 'class="group"';
  const animationAttributes = animationData?.attributes || '';
  fileNode.append(`<div ${classAttr} ${animationAttributes}`);
  if (groupStyles.length > 0) {
    fileNode.append(` style="${groupStyles.join(' ')}"`);
  }
  fileNode.append('>');
  // applyAnimation(group.animation); TODO

  for (const child of group.elements) {
    generateElement(child, fileNode, template);
  }

  fileNode.append('</div>');
}

function generateElement(element: Element, fileNode: CompositeGeneratorNode, template?: TemplateContext) {
  const styles: string[] = getElementStyles(element);
  styles.push(getElementPosition(element));
  const animationData = getElementAnimation(element);
  if (isGroup(element)) return generateGroup(element, fileNode, styles, animationData, template);
  if (isText(element)) return generateText(element, fileNode, styles, animationData, template);
  if (isImage(element)) return generateImage(element, fileNode, styles, animationData);
  if (isVideo(element)) return generateVideo(element, fileNode, styles, animationData);
  if (isQuiz(element)) return generateQuiz(element, fileNode, styles, animationData);
  if (isPlot(element)) return generatePlot(element, fileNode, styles, animationData);
  throw new Error(`Unhandled element type: ${(element as Element).$type}`);
}

function getElementStyles(element: Element): string[] {
  const styles: string[] = [...DEFAULT_ELEMENT_STYLES];
  if (!element.style) return styles;
  if (element.style.backgroundColor) {
    styles.push(resolveBackground(element.style.backgroundColor));
  }
  if (element.style.rotation) {
    styles.push(`transform: rotate(${element.style.rotation}deg);`);
  }
  styles.push(...(getSizeStyles(element) || []));
  styles.push(...(getFontStyles(element) || []));
  return styles;

  function getSizeStyles(element: Element): string[] | undefined {
    let sizeStyles: string[] = [];
    if (!element.style?.size) return;
    if (element.style.size.width && element.style.size.width.value != 'auto') {
      sizeStyles.push(`width: ${element.style.size.width.value}%;`);
    }
    if (element.style.size.height && element.style.size.height.value != 'auto') {
      sizeStyles.push(`height: ${element.style.size.height.value}%;`);
    }
    return sizeStyles;
  }

  function getFontStyles(element: Element): string[] | undefined {
    let fontStyles: string[] = [];
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

function getElementPosition(element: Element): string {
  if (!element.position) return '';
  let positionStyles: string[] = [];
  let transformStyles: string[] = [];
  let X: string | CoordinatePosition = element.position.x
    ? isCoordinatePosition(element.position.x)
      ? element.position.x
      : (element.position.x as any).$cstNode
        ? (element.position.x as any).$cstNode.text?.trim()
        : undefined
    : undefined;
  let Y: string | CoordinatePosition = element.position.y
    ? isCoordinatePosition(element.position.y)
      ? element.position.y
      : (element.position.y as any).$cstNode
        ? (element.position.y as any).$cstNode.text?.trim()
        : undefined
    : undefined;
  if (isShorthandPosition(element.position) && element.position.general === 'center') {
    X = 'center';
    Y = 'center';
    console.log('[Position] Shorthand "center" expanded to x=center, y=center');
  }
  getXPosition(X, positionStyles, transformStyles);
  getYPosition(Y, positionStyles, transformStyles);
  getZPosition(element.position.z, positionStyles);

  if (X || Y) {
    positionStyles.unshift('position: absolute;'); // position absolute si une position est définie pour positionner par rapport au conteneur parent
  }

  if (transformStyles.length > 0) {
    positionStyles.push(`transform: ${transformStyles.join(' ')};`);
  }
  return positionStyles.join(' ');

  /**
   * Ajoute les styles de positionnement horizontal à la liste des styles et de transformation
   * @param x la position horizontale
   * @param styles la liste des styles
   * @param transformStyles la liste des styles de transformation
   */
  function getXPosition(x: string | CoordinatePosition | undefined, styles: string[], transformStyles: string[]) {
    if (!x) return;
    if (isCoordinatePosition(x) && x.value !== undefined) {
      styles.push(`left: ${x.value}%;`);
      transformStyles.push('translateX(-50%)');
      return;
    }
    console.log('[Position] Processing X position value:', x);
    switch (x) {
      case 'left':
        styles.push('left: 2%;');
        break;
      case 'center':
        styles.push('left: 50%;');
        transformStyles.push('translateX(-50%)');
        break;
      case 'right':
        styles.push('right: 2%;');
        break;
    }
  }

  /**
   * Ajoute les styles de positionnement vertical à la liste des styles et de transformation
   * @param y la position verticale
   * @param styles la liste des styles
   * @param transformStyles la liste des styles de transformation
   */
  function getYPosition(y: string | CoordinatePosition | undefined, styles: string[], transformStyles: string[]) {
    if (!y) return;
    if (isCoordinatePosition(y) && y.value !== undefined) {
      styles.push(`top: ${y.value}%;`);
      transformStyles.push('translateY(-50%)');
    }
    switch (y) {
      case 'top':
        styles.push('top: 2%;');
        break;
      case 'center':
        styles.push('top: 50%;');
        transformStyles.push('translateY(-50%)');
        break;
      case 'bottom':
        styles.push('bottom: 2%;');
        transformStyles.push('translateY(-100%)');
        break;
    }
  }

  /**
   * Ajoute les styles de positionnement en Z à la liste des styles
   * @param z la position en Z
   * @param styles la liste des styles
   */
  function getZPosition(z: ZPosition | undefined, styles: string[]) {
    if (!z) return;
    if (isCoordinatePosition(z)) {
      if (z.value !== undefined) {
        styles.push(`z-index: ${z.value};`);
      }
    } else {
      const value = (z as any).$cstNode?.text?.trim();
      switch (value) {
        case 'front':
          styles.push(`z-index:${ZINDEX_FRONT_VALUE};`);
          break;
        case 'back':
          styles.push(`z-index: ${ZINDEX_BACK_VALUE};`);
          break;
      }
    }
  }
}

function sanitizeLink(link: string) {
  if (!link) return '';
  if (link.startsWith('"') && link.endsWith('"')) return link.substring(1, link.length - 1);
  if (link.startsWith("'") && link.endsWith("'")) return link.substring(1, link.length - 1);
  return link;
}

interface AnimationData {
  classes?: string;
  attributes?: string;
}
function getElementAnimation(element: Element): AnimationData | undefined {
  if (!element.animation) return undefined;
  const animation = element.animation;
  const order = animation.order;
  const type = animation.animationType ? animation.animationType : '';
  return { classes: `fragment ${type}`, attributes: `data-fragment-index="${order}"` };
}

//Quiz helpers
function sanitizeStringLiteral(s: string | undefined): string {
  if (s == null) return '';
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.substring(1, s.length - 1);
  }
  return s;
}
function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function displayOnlineQuiz(quizNode: Quiz, fileNode: CompositeGeneratorNode) {
  if (!quizNode.link) return;
  const raw = sanitizeLink(quizNode.link);
  if (!raw) return;
  if (isRemoteLink(raw)) {
    const src = encodeURI(raw);

    const joinUrlRaw = sanitizeStringLiteral((quizNode as any).joinUrl);
    const joinCodeRaw = sanitizeStringLiteral((quizNode as any).joinCode);

    const joinUrl = (joinUrlRaw || '').trim();
    const joinCode = (joinCodeRaw || '').trim();

    const hasJoinInfo = !!joinUrl || !!joinCode;
    const effectiveJoinUrl = (joinUrl || (joinCode ? 'https://www.menti.com' : '')).trim();

    const qrTarget = joinCode
      ? `${effectiveJoinUrl}?code=${encodeURIComponent(joinCode.replaceAll(/\s+/g, ''))}`
      : effectiveJoinUrl;

    const qrId = `qr_${Math.random().toString(36).slice(2)}_${Date.now()}`;

    fileNode.append(`
        <div class="quiz-layout"
             onclick="event.stopPropagation()"
             onmousedown="event.stopPropagation()"
             onmouseup="event.stopPropagation()"
             onwheel="event.stopPropagation()">

          <div class="quiz-main">
            <iframe
              src="${src}"
              allowfullscreen
              loading="lazy">
            </iframe>
          </div>

          ${
            hasJoinInfo
              ? `
          <div class="quiz-side">
            <div class="qr" data-qr-id="${qrId}" data-qr-target="${escapeHtml(qrTarget)}">
              <div id="${qrId}"></div>
            </div>
          </div>
              `
              : ''
          }

        </div>
      `);

    fileNode.append('</div>');
  }
}

function displayPersonnalisedQuiz(quizNode: Quiz, fileNode: CompositeGeneratorNode) {
  const pq = quizNode.personnalisedQuiz;

  if (!pq) return;

  const title = sanitizeStringLiteral(pq.title);
  const description = sanitizeStringLiteral(pq.description);

  const level1 = "Plus rien n'a de secret pour toi !";
  const level2 = 'Tu frôles la perfection !';
  const level3 = 'Pas mal du tout !';
  const level4 = 'Il va falloir réviser !';
  const level5 = 'On ne peut pas être bon partout !';

  const questions = (pq.question ?? []).map((q) => {
    const content = sanitizeStringLiteral(q.content);

    const answers = (q.option ?? []).map((opt) => {
      const isCorrect = opt.correct === 'true';
      return {
        option: sanitizeStringLiteral(opt.answer),
        correct: isCorrect,
      };
    });

    const correctMsgRaw = sanitizeStringLiteral((q as any).correctMessage);
    const incorrectMsgRaw = sanitizeStringLiteral((q as any).incorrectMessage);

    const correctMsg = correctMsgRaw && correctMsgRaw.trim().length > 0 ? correctMsgRaw : 'Bonne réponse ✅';

    const incorrectMsg = incorrectMsgRaw && incorrectMsgRaw.trim().length > 0 ? incorrectMsgRaw : 'Mauvaise réponse ❌';

    const correctHtml = `<p><span>${escapeHtml(correctMsg)}</span></p>`;
    const incorrectHtml = `<p><span>${escapeHtml(incorrectMsg)}</span></p>`;

    return {
      q: content,
      a: answers,
      correct: correctHtml,
      incorrect: incorrectHtml,
    };
  });

  const quizObject = {
    info: {
      name: title,
      main: description,
      level1,
      level2,
      level3,
      level4,
      level5,
    },
    questions,
  };

  const jsonPretty = JSON.stringify(quizObject, null, 2).replaceAll(/<\/script>/gi, '<\\/script>');

  fileNode.append(`<div class="quiz">`);
  fileNode.append(`<script data-quiz>\nquiz = ${jsonPretty};\n</script>`);
  fileNode.append(`</div>`);

  fileNode.append('</div>');
}

function generateQuiz(
  quizNode: Quiz,
  fileNode: CompositeGeneratorNode,
  styles: String[],
  animationData: AnimationData | undefined,
) {
  const animationClass = animationData?.classes || '';
  const animationAttributes = animationData?.attributes || '';
  fileNode.append(`<div class="quiz-wrap ${animationClass}" ${animationAttributes} onclick="event.stopPropagation()">`);

  if (quizNode.link) {
    displayOnlineQuiz(quizNode, fileNode);
    return;
  }

  if (quizNode.personnalisedQuiz) {
    displayPersonnalisedQuiz(quizNode, fileNode);
    return;
  }

  fileNode.append('<!-- Quiz node: no link and no personalisedQuiz -->');
  fileNode.append('</div>');
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

function generateList(
  listNode: List,
  fileNode: CompositeGeneratorNode,
  elementStyle: any,
  template?: TemplateContext,
  styles: String[] = [],
) {
  const ordered = (listNode as any).ordered === true || (listNode as any).ordered === 'true';
  const tag = ordered ? 'ol' : 'ul';
  const resolvedTextStyles = resolveTextStyles('text', elementStyle, template);
  const listStyles = ['margin: 5vw;', 'padding-left: 1.2em;', ...styles, ...resolvedTextStyles];
  fileNode.append(`<${tag} style="${listStyles.join(' ')}">`);
  for (const item of listNode.items ?? []) {
    const raw = sanitizeStringLiteral(item);
    const html = markdownToHtml(raw);
    fileNode.append(`<li>${html}</li>`);
  }
  fileNode.append(`</${tag}>`);
}

function generateImage(
  image: Image,
  fileNode: CompositeGeneratorNode,
  styles: string[],
  animationData: AnimationData | undefined,
) {
  const animationClass = animationData?.classes || '';
  const animationAttributes = animationData?.attributes || '';
  const srcRaw = copyLocalAssetIfNeeded(image.link);
  const src = isRemoteLink(srcRaw) ? encodeURI(srcRaw) : srcRaw;
  const classAttr = animationClass ? `class="image ${animationClass}"` : 'class="image"';
  fileNode.append(`<div ${classAttr} ${animationAttributes}><img src="${src}" alt="image" `);
  if (styles.length > 0) {
    fileNode.append(` style="${styles.join(' ')}"`);
  }
  fileNode.append(` onclick="openImageFullscreen(this)" onerror="this.style.display='none'"/></div>`);
}

function generateVideo(
  video: Video,
  fileNode: CompositeGeneratorNode,
  styles: string[],
  animationData: AnimationData | undefined,
) {
  const animationClass = animationData?.classes || '';
  const animationAttributes = animationData?.attributes || '';
  const raw = sanitizeLink(video.link);
  const classAttr = animationClass ? `class="video ${animationClass}"` : 'class="video"';
  const ytEmbed = getYouTubeEmbed(raw);
  if (ytEmbed) {
    fileNode.append(`<div ${classAttr} ${animationAttributes}><iframe `);
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
  fileNode.append(`<div ${classAttr} ${animationAttributes}><video controls `);
  if (styles.length > 0) {
    fileNode.append(`style="${styles.join(' ')}"`);
  }
  fileNode.append(
    `><source src="${videoSrc}" type="${mime}">Your browser does not support the video tag.</source></video></div>`,
  );
}

function generateText(
  text: Text,
  fileNode: CompositeGeneratorNode,
  styles: string[],
  animationData: AnimationData | undefined,
  template?: TemplateContext,
) {
  const animationClass = animationData?.classes || '';
  const classAttr = animationClass ? `class="text ${animationClass}"` : 'class="text"';
  const animationAttributes = animationData?.attributes || '';
  fileNode.append(`<div ${classAttr} ${animationAttributes}`);

  if (isBasicText(text) && text.align) {
    styles.push(`display:flex; justify-content:${text.align};`);
  }

  if (styles.length > 0) {
    fileNode.append(` style="${styles.join(' ')}"`);
  }
  fileNode.append('>');

  if (isCode(text)) {
    generateCode(text, fileNode);
  } else if (isParagraph(text)) {
    generateParagraph(text, fileNode, text.style, template);
  } else if (isList(text)) {
    generateList(text as any, fileNode, text.style, template, styles);
  } else {
    throw new Error(`Unsupported Text type: ${text.$type}`);
  }

  fileNode.append('</div>');
}

function generateCode(code: Code, fileNode: CompositeGeneratorNode) {
  const lang = code.language ? code.language : 'plaintext';
  const hasExplanations = code.explanations && code.explanations.length > 0;
  if (code.animated && hasExplanations) {
    generateExplainedCode(code, lang, fileNode, true);
    return;
  }
  if (code.animated) {
    generateCodeBlock(code.content, lang, fileNode, true);
    return;
  }
  if (hasExplanations) {
    generateExplainedCode(code, lang, fileNode);
    return;
  }
  generateCodeBlock(code.content, lang, fileNode);

  function generateExplainedCode(code: Code, language: string, fileNode: CompositeGeneratorNode, animated?: boolean) {
    fileNode.append(
      '<div class="group" style="display: flex; flex-direction: row; align-items: center; min-width: 800px; max-width: 80%;">',
    );
    generateCodeBlock(code.content, language, fileNode, true);
    fileNode.append('<div class="code-explanations" style="margin: 20px 0; ">');
    for (const explanation of code.explanations) {
      let explainClass = '';
      let style = '';
      if (animated) {
        explainClass = `class="explain-${explanation.line}"`;
        style = 'opacity: 0; visibility: hidden; transition: opacity 0.3s ease-in-out;';
      }
      fileNode.append(
        `<div ${explainClass} style="font-size: .55em; line-height: 1.2em; text-align: left; ${style}">${explanation.content}</div>`,
      );
    }
    fileNode.append('</div>');
    fileNode.append('</div>');
  }

  function generateCodeBlock(content: string, language: string, fileNode: CompositeGeneratorNode, animated?: boolean) {
    let lineAnimation = '';
    if (animated) {
      lineAnimation = `data-line-numbers="${content
        .split('\n')
        .map((_, i) => i + 1)
        .join('|')}"`;
    }
    fileNode.append(
      `<pre style="width: fit-content"><code class="language-${language}" data-trim ${lineAnimation}>${content}</code></pre>`,
    );
  }
}

function markdownToHtml(markdown: string): string {
  if (!markdown) return '';
  let html = markdown;

  // Bold **text**
  html = html.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  // Italic *text*
  html = html.replace(/\*(.+?)\*/g, '<i>$1</i>');
  // Underline __text__
  html = html.replace(/__(.+?)__/g, '<u>$1</u>');
  // Strikethrough ~~text~~
  html = html.replace(/~~(.+?)~~/g, '<s>$1</s>');
  // Inline code `code`
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');
  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  // Line breaks
  html = html.replace(/\n/g, '<br/>');
  return html;
}

function generateParagraph(
  paragraph: Paragraph,
  fileNode: CompositeGeneratorNode,
  elementStyle: any,
  template?: TemplateContext,
) {
  const tag = paragraph.type === 'title' ? 'h1' : paragraph.type === 'subtitle' ? 'h2' : 'p';
  const alignStyle = paragraph.align ? `text-align: ${paragraph.align};` : '';
  const resolvedStyles = resolveTextStyles(paragraph.type, elementStyle, template);
  paragraph.content = markdownToHtml(paragraph.content);
  fileNode.append(
    `<${tag} style="${DEFAULT_TEXT_STYLE}${alignStyle}${resolvedStyles.join(' ')}">
      ${paragraph.content}
     </${tag}>`,
  );
}

function generatePlot(plot: Plot, fileNode: CompositeGeneratorNode, styles: String[], animationData?: AnimationData) {
  const plotId = `plot_${PLOT_COUNTER++}`;

  const animationClass = animationData?.classes ?? '';
  const animationAttributes = animationData?.attributes ?? '';

  const classAttr = animationClass ? `class="plot-container ${animationClass}"` : `class="plot-container"`;

  fileNode.append(`<div ${classAttr} ${animationAttributes}`);

  if (styles.length > 0) {
    fileNode.append(` style="${styles.join(' ')}"`);
  }

  fileNode.append(`>`);
  fileNode.append(`<div id="${plotId}" style="width:100%; height:100%;"></div>`);
  fileNode.append(`</div>`);

  const x = plot.plotData?.xValues?.values ?? [];
  const y = plot.plotData?.yValues?.values ?? [];
  const labels = plot.plotData?.labels?.values ?? [];

  const hasLabels = labels.length > 0;

  const plotType = plot.plotType;
  const xLabel = plot.plotLayout?.xLabel;
  const yLabel = plot.plotLayout?.yLabel;

  const hoverTemplate = hasLabels
    ? '%{text}<br>Study hours: %{x}<br>Score: %{y}<extra></extra>'
    : 'Study hours: %{x}<br>Score: %{y}<extra></extra>';

  fileNode.append(`
<script>
(function () {
  const trace = {
    x: ${JSON.stringify(x)},
    y: ${JSON.stringify(y)},
    type: "${plotType}",
    mode: "${plotType === 'scatter' ? 'markers' : 'lines'}",
    ${hasLabels ? `text: ${JSON.stringify(labels)},` : ''}
    hovertemplate: ${JSON.stringify(hoverTemplate)}
  };

  const layout = {
    margin: { t: 20 },
    ${xLabel ? `xaxis: { title: ${JSON.stringify(xLabel)} },` : ''}
    ${yLabel ? `yaxis: { title: ${JSON.stringify(yLabel)} },` : ''}
  };

  Plotly.newPlot("${plotId}", [trace], layout, { responsive: true });
})();
</script>
`);
}

function resolveBackground(background: string | BackgroundValue): string {

  if (typeof background === 'string') {
    return `background-color: ${background};`;
  }

  if ((background as SolidColor).color !== undefined) {
    return `background: ${(background as SolidColor).color};`;
  }
  const gradient = background as GradientColor;

  const from = gradient.from;
  const to = gradient.to;
  let direction = 'to bottom';

  if (gradient.modifier) {
    if (gradient.modifier === 'horizontal') direction = 'to right';
    else if (gradient.modifier === 'vertical') direction = 'to bottom';
    else if (gradient.modifier === 'diagonal') direction = 'to bottom right';
    else if (gradient.modifier === 'radial') {
      return `background: radial-gradient(circle, ${from}, ${to});`;
    } else if ((gradient.modifier as any).angle !== undefined) {
      return `background: linear-gradient(${(gradient.modifier as any).angle}deg, ${from}, ${to});`;
    }
  }

  return `background: linear-gradient(${direction}, ${from}, ${to});`;
}
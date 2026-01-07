import { AstNode, AstTypeList, ValidationAcceptor, ValidationChecks } from 'langium';
import { JeyaSlidesAstType, Template } from './generated/ast';
import type { SlideMLServices } from './slide-ml-module';

export function registerValidationChecks(services: SlideMLServices) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.SlideMLValidator;

  const checks: ValidationChecks<AstTypeList<JeyaSlidesAstType>> = {
    Template: validator.validateTemplate,
    Presentation: validator.validate,
    Slide: validator.validate,
    Element: validator.validate,
    Font: validator.validateNotEmpty,
    Style: validator.validateNotEmpty,
    Position: validator.validateNotEmpty,
    XPosition: validator.validatePosition,
    YPosition: validator.validatePosition,
  };

  registry.register(checks, validator);
}

export class SlideMLValidator {
  validate(node: AstNode, accept: ValidationAcceptor): void {
    const $cstNode = node.$cstNode;
    if (!$cstNode) return;

    const text = $cstNode.text;
    const lines = text.split(/\r?\n/);

    // Vérifier si plusieurs propriétés sont sur la même ligne
    this.checkOneLinePerProperty(lines, accept, node);

    // Vérifier si plusieurs éléments de liste ("-") sont sur la même ligne
    this.checkListItemFormatting(node, lines, accept);

    // Vérifier l'indentation cohérente (optionnel, pour un style plus strict)
    this.checkIndentation(node, lines, accept);

    // Vérifier le format des liens d'image
    this.checkImageLinks(node, accept);

    // Vérifier le format des liens de vidéo
    this.checkVideoLinks(node, accept);
    // Vérifier les valeurs de 'type' et 'duration' pour transition/animation
    this.checkTransitionAndDurationValues(node, lines, accept);
  }

  private checkOneLinePerProperty(lines: string[], accept: ValidationAcceptor, node: AstNode) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('//') || line.startsWith('/*')) continue;

      // Compter le nombre de ':' qui indiquent des propriétés (en excluant les ':' dans les strings)
      const colonMatches = line.match(/:\s*(?=(?:[^"]*"[^"]*")*[^"]*$)/g);

      if (colonMatches && colonMatches.length > 1) {
        accept(
          'warning',
          'Il est recommandé de placer chaque propriété sur une ligne séparée pour améliorer la lisibilité (style YAML).',
          { node, property: undefined },
        );
        break;
      }
    }
  }

  private checkListItemFormatting(node: AstNode, lines: string[], accept: ValidationAcceptor): void {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim() || line.trim().startsWith('//') || line.trim().startsWith('/*')) continue;

      // Compter le nombre d'éléments de liste (tirets "-") sur une ligne
      // On cherche les tirets qui ne sont pas dans des strings
      const dashMatches = line.match(/-\s*(?=(?:[^"]*"[^"]*")*[^"]*$)/g);

      if (dashMatches && dashMatches.length > 1) {
        accept(
          'warning',
          'Il est recommandé de placer chaque élément de liste (commençant par "-") sur une ligne séparée (style YAML).',
          { node, property: undefined },
        );
        break; // Un seul avertissement par nœud suffit
      }
    }
  }

  private checkIndentation(node: AstNode, lines: string[], accept: ValidationAcceptor): void {
    const indentations: number[] = [];

    for (const line of lines) {
      if (!line.trim() || line.trim().startsWith('//')) continue;

      const match = line.match(/^(\s*)/);
      if (match) {
        const spaces = match[1].length;
        indentations.push(spaces);
      }
    }

    // Vérifier si l'indentation utilise des espaces cohérents (multiples de 2 ou 4)
    const hasInconsistentIndent = indentations.some((indent, idx) => {
      if (idx === 0) return false;
      const diff = Math.abs(indent - indentations[idx - 1]);
      return diff !== 0 && diff !== 2 && diff !== 4 && diff % 2 !== 0;
    });

    if (hasInconsistentIndent) {
      accept('hint', "L'indentation pourrait être plus cohérente. Utilisez 2 ou 4 espaces de manière uniforme.", {
        node,
        property: undefined,
      });
    }
  }

  private checkImageLinks(node: AstNode, accept: ValidationAcceptor): void {
    const imageLinks = this.extractImageLinks(node);
    imageLinks.forEach((link) => {
      if (!this.isValidLink(link)) {
        accept('warning', 'Le lien de l’image semble étrange, veuillez vérifier : ' + link, { node });
      }
    });
  }

  private extractImageLinks(node: AstNode): string[] {
    const links: string[] = [];
    // Logique pour extraire les liens d'images du nœud
    // Cela dépend de la structure de votre AST
    // Exemple d'extraction :
    if (node.$cstNode) {
      const text = node.$cstNode.text;
      const regex = /https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/g;
      let match;
      while ((match = regex.exec(text)) !== null) {
        links.push(match[0]);
      }
    }
    return links;
  }

  private isValidLink(link: string): boolean {
    // Logique pour vérifier si le lien est valide
    return link.startsWith('http') || link.startsWith('https');
  }

  private checkVideoLinks(node: AstNode, accept: ValidationAcceptor): void {
    const videoLinks = this.extractVideoLinks(node);
    videoLinks.forEach((link) => {
      if (!this.isValidLink(link)) {
        accept('warning', 'Le lien de la vidéo semble étrange, veuillez vérifier : ' + link, { node });
      }
    });
  }

  private extractVideoLinks(node: AstNode): string[] {
    const links: string[] = [];
    // Logique pour extraire les liens de vidéos du nœud
    // Cela dépend de la structure de votre AST
    // Exemple d'extraction :
    if (node.$cstNode) {
      const text = node.$cstNode.text;
      const regex = /https?:\/\/[^\s]+\.(mp4|avi|mov|wmv)/g;
      let match;
      while ((match = regex.exec(text)) !== null) {
        links.push(match[0]);
      }
    }
    return links;
  }
  private checkTransitionAndDurationValues(node: AstNode, lines: string[], accept: ValidationAcceptor): void {
    const validDurations = ['fast', 'default', 'slow'];

    let currentSection: string | null = null;

    for (const element of lines) {
      const rawLine = element;
      if (this.isIgnoredLine(rawLine)) continue;

      const indent = this.getIndent(rawLine);
      const trimmed = rawLine.trim();

      currentSection = this.detectSection(trimmed, indent, currentSection);

      if (this.isTypeLine(trimmed)) {
        this.validateTypeLine(trimmed, currentSection, accept, node);
      } else if (this.isDurationLine(trimmed)) {
        this.validateDurationLine(trimmed, currentSection, validDurations, accept, node);
      }
    }
  }

  private isIgnoredLine(line: string | undefined): boolean {
    if (!line) return true;
    const t = line.trim();
    return !t || t.startsWith('//') || t.startsWith('/*');
  }

  private getIndent(line: string): number {
    const m = line.match(/^(\s*)/);
    return m ? m[1].length : 0;
  }

  private detectSection(trimmed: string, indent: number, currentSection: string | null): string | null {
    if (/^transition:\s*$/i.test(trimmed)) return 'transition';
    if (/^animation:\s*$/i.test(trimmed)) return 'animation';
    if (/^[a-zA-Z_-]+:\s*$/.test(trimmed) && indent === 0) return null;
    return currentSection;
  }

  private isTypeLine(trimmed: string): boolean {
    return /^type:\s*/i.test(trimmed);
  }

  private isDurationLine(trimmed: string): boolean {
    return /^duration:\s*/i.test(trimmed);
  }

  private validateTypeLine(trimmed: string, currentSection: string | null, accept: ValidationAcceptor, node: AstNode) {
    if (currentSection !== 'transition' && currentSection !== 'animation') return;

    const after = trimmed.split(':')[1] || '';
    const tokens = after.trim().split(/\s+/).filter(Boolean);
    for (const tok of tokens) {
      const m = tok.match(/^(none|fade|slide|convex|concave|zoom)(-in|-out)?$/i);
      if (!m) {
        accept('warning', 'vous avez inscrit une valeur inccorecte', { node, property: undefined });
        break;
      }
    }
  }

  private validateDurationLine(
    trimmed: string,
    currentSection: string | null,
    validDurations: string[],
    accept: ValidationAcceptor,
    node: AstNode,
  ) {
    if (currentSection !== 'transition') return;
    const after = trimmed.split(':')[1] || '';
    const val = after.trim().split(/\s+/)[0] || '';
    if (!validDurations.includes(val)) {
      accept('warning', 'vous avez inscrit une valeur inccorecte', { node, property: undefined });
    }
  }

  validateNotEmpty(node: AstNode, accept: ValidationAcceptor): void {
    if (node.$cstNode) {
      const fieldName = node.$type;
      const text = node.$cstNode.text.split(':')[1]?.trim() || '';
      if (text === '') {
        accept('error', `La balise ${fieldName} ne doit pas être vide.`, { node });
      }
    }
  }

  validatePosition(node: AstNode, accept: ValidationAcceptor): void {
    if (node.$cstNode) {
      const text = node.$cstNode.text.trim();
      const value = parseFloat(text);
      if (value < 0) {
        accept('warning', `La position est négative, l'élément risque d'être invisible.`, { node });
        return;
      }

      if (value > 100) {
        accept('warning', `La position est supérieure à 100, l'élément risque d'être invisible.`, { node });
        return;
      }
    }
  }

  validateTemplate(node: AstNode, accept: ValidationAcceptor): void {
    const template = node as Template;

    const hasTitle = !!template.titleTemplate;
    const hasBody = !!template.bodyTemplate;
    const hasTextStyles =
      !!template.defaults?.textStyles &&
      template.defaults.textStyles.entries.length > 0;

    if (!hasTitle && !hasBody && !hasTextStyles) {
      accept(
        'error',
        'Un template doit définir au moins un titleTemplate, un bodyTemplate ou des textStyles.',
        { node: template }
      );
    }
  }
}

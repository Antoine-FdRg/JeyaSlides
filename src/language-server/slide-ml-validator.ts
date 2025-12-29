import {
  AstNode,
  AstTypeList,
  ValidationAcceptor,
  ValidationChecks,
} from 'langium';
import { JeyaSlidesAstType } from './generated/ast';
import type { SlideMLServices } from './slide-ml-module';

export function registerValidationChecks(services: SlideMLServices) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.SlideMLValidator;

  const checks: ValidationChecks<AstTypeList<JeyaSlidesAstType>> = {
    Template: validator.checkPropertyFormatting,
    Presentation: validator.checkPropertyFormatting,
    Slide: validator.checkPropertyFormatting,
    Element: validator.checkPropertyFormatting,
  };

  registry.register(checks, validator);
}

export class SlideMLValidator {
  checkPropertyFormatting(node: AstNode, accept: ValidationAcceptor): void {
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
  }

  private checkOneLinePerProperty(
    lines: string[],
    accept: ValidationAcceptor,
    node: AstNode,
  ) {
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

  private checkListItemFormatting(
    node: AstNode,
    lines: string[],
    accept: ValidationAcceptor,
  ): void {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (
        !line.trim() ||
        line.trim().startsWith('//') ||
        line.trim().startsWith('/*')
      )
        continue;

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

  private checkIndentation(
    node: AstNode,
    lines: string[],
    accept: ValidationAcceptor,
  ): void {
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
      accept(
        'hint',
        "L'indentation pourrait être plus cohérente. Utilisez 2 ou 4 espaces de manière uniforme.",
        { node, property: undefined },
      );
    }
  }
}

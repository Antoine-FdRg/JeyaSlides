import { AstNode, AstTypeList, ValidationAcceptor, ValidationChecks } from 'langium';
import { Font, JeyaSlidesAstType, Plot, Template } from './generated/ast';
import type { SlideMLServices } from './slide-ml-module';

export function registerValidationChecks(services: SlideMLServices) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.SlideMLValidator;

  const checks: ValidationChecks<AstTypeList<JeyaSlidesAstType>> = {
    Template: validator.validateTemplate,
    Presentation: validator.validate,
    Slide: validator.validate,
    Element: validator.validate,
    Plot: validator.validatePlot,
    Font: validator.validateNotEmpty,
    Style: validator.validateNotEmpty,
    Position: validator.validateNotEmpty,
    XPosition: validator.validatePosition,
    YPosition: validator.validatePosition,
    Size: validator.validateUsefullSize,
  };

  registry.register(checks, validator);
}

export class SlideMLValidator {
  validate(node: AstNode, accept: ValidationAcceptor): void {
    const $cstNode = node.$cstNode;
    if (!$cstNode) return;
  }

  validateNotEmpty(node: AstNode, accept: ValidationAcceptor): void {
    if (!node.$cstNode) return;
    if (node.$type === 'Font') {
      const font = node as Font;

      const isEmpty =
        font.name === undefined &&
        font.size === undefined &&
        font.color === undefined &&
        (!font.transformations || font.transformations.length === 0);

      if (isEmpty) {
        accept('error', `La balise font ne doit pas être vide.`, { node });
      }
      return;
    }

    const fieldName = node.$type;
    const textAfterColon = node.$cstNode.text.split(':')[1]?.trim();

    if (textAfterColon === '') {
      accept('error', `La balise ${fieldName} ne doit pas être vide.`, { node });
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
    const hasTextStyles = !!template.defaults?.textStyles && template.defaults.textStyles.entries.length > 0;

    if (!hasTitle && !hasBody && !hasTextStyles) {
      accept('error', 'Un template doit définir au moins un titleTemplate, un bodyTemplate ou des textStyles.', {
        node: template,
      });
    }
  }

  validateUsefullSize(node: AstNode, accept: ValidationAcceptor): void {
    const size = node as any;
    if (size.width && size.height) {
      const widthIsAuto = typeof size.width.value === 'string' && size.width.value === 'auto';
      const heightIsAuto = typeof size.height.value === 'string' && size.height.value === 'auto';

      if (widthIsAuto && heightIsAuto) {
        accept('warning', 'Définir width et height tous les deux à "auto" est inutile.', { node });
      }
    }
  }

  validatePlot(node: AstNode, accept: ValidationAcceptor): void {
    const plot = node as Plot;

    const data = plot.plotData;
    if (!data) {
      accept('error', 'Un plot doit définir un bloc data.', { node });
      return;
    }

    const x = data.xValues?.values ?? [];
    const y = data.yValues?.values ?? [];

    if (x.length === 0) {
      accept('error', 'Le tableau x du plot ne doit pas être vide.', { node });
    }

    if (y.length === 0) {
      accept('error', 'Le tableau y du plot ne doit pas être vide.', { node });
    }

    if (x.length > 0 && y.length > 0 && x.length !== y.length) {
      accept('error', `Les tableaux x (${x.length}) et y (${y.length}) doivent avoir la même taille.`, { node });
    }

    const labels = data.labels?.values;
    if (labels && labels.length !== x.length) {
      accept('warning', `Le nombre de labels (${labels.length}) doit correspondre au nombre de points (${x.length}).`, {
        node,
      });
    }
  }
}

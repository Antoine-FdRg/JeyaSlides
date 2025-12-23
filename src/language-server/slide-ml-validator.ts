import { AstTypeList, ValidationAcceptor, ValidationChecks } from 'langium';
import { JeyaSlidesAstType, Model, isModel } from './generated/ast';
import type { SlideMLServices } from './slide-ml-module';

export function registerValidationChecks(services: SlideMLServices) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.SlideMLValidator;

  const checks: ValidationChecks<AstTypeList<JeyaSlidesAstType>> = {
    Model: (node, accept) => {
      if (isModel(node)) {
        validator.checkNothing(node, accept);
      }
    },
  };

  registry.register(checks, validator);
}

export class SlideMLValidator {
  checkNothing(model: Model, accept: ValidationAcceptor): void {
    // validations...
  }
}

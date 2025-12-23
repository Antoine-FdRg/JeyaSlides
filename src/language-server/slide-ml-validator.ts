import { ValidationAcceptor, ValidationChecks } from 'langium';
import { JeyaSlidesAstType, Model } from './generated/ast';
import type { SlideMLServices } from './slide-ml-module';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: SlideMLServices) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.SlideMLValidator;
  const checks: ValidationChecks<JeyaSlidesAstType> = {
    Model: validator.checkNothing,
  };
  registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class SlideMLValidator {
  checkNothing(model: Model, accept: ValidationAcceptor): void {
    // Add validation logic here
  }
}

import { Model } from '../language-server/generated/ast';
import { createSlideMlServices } from '../language-server/slide-ml-module';
import { NodeFileSystem } from 'langium/node';
import { URI } from 'vscode-uri';
import { Diagnostic } from 'vscode-languageserver-types';
import fs from 'fs';

export interface ParseResult {
  model: Model | undefined;
  errors: Diagnostic[];
}

/**
 * Parse a SlideML document for preview purposes
 */
export async function parseDocument(filePath: string, content: string): Promise<ParseResult> {
  const services = createSlideMlServices(NodeFileSystem).SlideMl;
  const uri = URI.file(filePath);

  // Get or create document
  const document = services.shared.workspace.LangiumDocuments.getOrCreateDocument(uri);

  // Parse the content
  await services.shared.workspace.DocumentBuilder.build([document], { validationChecks: 'all' });

  // Get validation errors (severity 1 = error, 2 = warning)
  const errors = (document.diagnostics ?? []).filter((e) => e.severity === 1);

  return {
    model: document.parseResult?.value as Model,
    errors: errors,
  };
}

/**
 * Parse a SlideML file for preview purposes
 */
export async function parseFile(filePath: string): Promise<ParseResult> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  return parseDocument(filePath, content);
}

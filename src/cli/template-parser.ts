import fs from 'fs';
import { URI } from 'vscode-uri';
import { LangiumDocument } from 'langium';
import { Template, isModel } from '../language-server/generated/ast';
import { createSlideMlServices } from '../language-server/slide-ml-module';
import { NodeFileSystem } from 'langium/node';

const services = createSlideMlServices(NodeFileSystem).SlideMl;

export function parseTemplate(templatePath: string): Template {
  const content = fs.readFileSync(templatePath, 'utf-8');
  const uri = URI.file(templatePath);

  const document: LangiumDocument =
    services.shared.workspace.LangiumDocumentFactory.fromString(
      content,
      uri
    );

  services.shared.workspace.DocumentBuilder.build([document], {
    validationChecks: 'none'
  });

  const model = document.parseResult.value;

  if (!isModel(model)) {
    throw new Error(`File ${templatePath} does not contain a Model`);
  }

  return model.template;
}

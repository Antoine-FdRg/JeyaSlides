import * as vscode from 'vscode';
import * as path from 'path';
import { generateRevealJsString } from '../cli/generator';
import { parseDocument } from './preview-parser';

interface SlidePosition {
  h: number;
  v: number;
  f?: number;
}

/**
 * Manages the webview panel for previewing SML files
 */
export class PreviewPanel {
  public static currentPanel: PreviewPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];
  private _currentDocument: vscode.TextDocument | undefined;
  private _lastSlidePosition: SlidePosition = { h: 0, v: 0, f: 0 };

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;

    // Set the webview's initial html content
    this._updateWebview();

    // Listen for messages from the webview
    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.type) {
          case 'slideChanged':
            // Save the current slide position
            this._lastSlidePosition = message.position;
            break;
        }
      },
      null,
      this._disposables,
    );

    // Listen for when the panel is disposed
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Update the content based on view changes
    this._panel.onDidChangeViewState(
      () => {
        if (this._panel.visible) {
          this._updateWebview();
        }
      },
      null,
      this._disposables,
    );
  }

  public static createOrShow(extensionUri: vscode.Uri, document?: vscode.TextDocument) {
    // If we already have a panel, show it
    if (PreviewPanel.currentPanel) {
      PreviewPanel.currentPanel._panel.reveal(vscode.ViewColumn.Beside);
      if (document) {
        PreviewPanel.currentPanel._currentDocument = document;
        PreviewPanel.currentPanel._updateWebview();
      }
      return;
    }

    // Otherwise, create a new panel
    const panel = vscode.window.createWebviewPanel('slideMlPreview', 'SML Preview', vscode.ViewColumn.Beside, {
      enableScripts: true,
      localResourceRoots: [extensionUri],
      retainContextWhenHidden: true,
    });

    PreviewPanel.currentPanel = new PreviewPanel(panel, extensionUri);
    if (document) {
      PreviewPanel.currentPanel._currentDocument = document;
      PreviewPanel.currentPanel._updateWebview();
    }
  }

  public updateContent(document: vscode.TextDocument) {
    this._currentDocument = document;
    this._updateWebview();
  }

  private async _updateWebview() {
    const webview = this._panel.webview;

    if (!this._currentDocument) {
      webview.html = this._getLoadingHtml();
      return;
    }

    try {
      const content = this._currentDocument.getText();
      const filePath = this._currentDocument.uri.fsPath;
      const result = await parseDocument(filePath, content);

      // Check for validation errors
      if (result.errors && result.errors.length > 0) {
        const errorMessages = result.errors
          .map((err) => `Line ${err.range.start.line + 1}, Col ${err.range.start.character + 1}: ${err.message}`)
          .join('\n');
        webview.html = this._getValidationErrorHtml(errorMessages);
        return;
      }

      if (!result.model || !result.model.presentation) {
        webview.html = this._getErrorHtml('No valid presentation found in the document.');
        return;
      }

      const sourceDir = path.dirname(filePath);
      const html = generateRevealJsString(result.model, sourceDir);

      // Inject script to save/restore slide position
      const htmlWithScript = this._injectSlidePositionScript(html);
      webview.html = htmlWithScript;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      webview.html = this._getErrorHtml(errorMessage);
    }
  }

  private _getLoadingHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SML Preview</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
            background: #1e1e1e;
            color: #cccccc;
        }
    </style>
</head>
<body>
    <div>
        <h2>Loading preview...</h2>
        <p>Open a .sml file to see its preview here.</p>
    </div>
</body>
</html>`;
  }

  private _getValidationErrorHtml(errors: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SML Preview - Validation Errors</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
            background: #1e1e1e;
            color: #f48771;
        }
        .error-container {
            max-width: 800px;
            padding: 20px;
            background: #2d2d2d;
            border-radius: 8px;
            border-left: 4px solid #f48771;
        }
        h2 {
            margin-top: 0;
            color: #f48771;
        }
        .error-icon {
            font-size: 48px;
            margin-bottom: 10px;
        }
        pre {
            background: #1e1e1e;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
            color: #cccccc;
        }
        p {
            color: #cccccc;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h2>Validation Errors</h2>
        <p>Your SlideML file contains errors that must be fixed before preview:</p>
        <pre>${this._escapeHtml(errors)}</pre>
    </div>
</body>
</html>`;
  }

  private _getErrorHtml(message: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SML Preview - Error</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
            background: #1e1e1e;
            color: #f48771;
        }
        .error-container {
            max-width: 600px;
            padding: 20px;
            background: #2d2d2d;
            border-radius: 8px;
            border-left: 4px solid #f48771;
        }
        h2 {
            margin-top: 0;
        }
        pre {
            background: #1e1e1e;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <h2>Preview Error</h2>
        <p>An error occurred while generating the preview:</p>
        <pre>${this._escapeHtml(message)}</pre>
    </div>
</body>
</html>`;
  }

  private _escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private _injectSlidePositionScript(html: string): string {
    // Inject script to save and restore slide position
    const positionScript = `
    <script>
      const vscode = acquireVsCodeApi();
      const savedPosition = ${JSON.stringify(this._lastSlidePosition)};
      
      Reveal.on('ready', () => {
        // Restore the last slide position
        if (savedPosition) {
          Reveal.slide(savedPosition.h, savedPosition.v, savedPosition.f);
        }
      });
      
      // Save position whenever the slide changes
      Reveal.on('slidechanged', (event) => {
        const indices = Reveal.getIndices();
        vscode.postMessage({
          type: 'slideChanged',
          position: { h: indices.h, v: indices.v, f: indices.f }
        });
      });
      
      // Also save on fragment changes
      Reveal.on('fragmentshown', () => {
        const indices = Reveal.getIndices();
        vscode.postMessage({
          type: 'slideChanged',
          position: { h: indices.h, v: indices.v, f: indices.f }
        });
      });
      
      Reveal.on('fragmenthidden', () => {
        const indices = Reveal.getIndices();
        vscode.postMessage({
          type: 'slideChanged',
          position: { h: indices.h, v: indices.v, f: indices.f }
        });
      });
    <\/script>`;

    // Insert the script before the closing </body> tag
    return html.replace('</body>', `${positionScript}</body>`);
  }

  public dispose() {
    PreviewPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}

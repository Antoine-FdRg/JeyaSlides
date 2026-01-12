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
  private _isUpdating: boolean = false;
  private _lastContentHash: string = '';

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

    // Note: We don't refresh on view state change because:
    // 1. retainContextWhenHidden keeps the state
    // 2. Refreshing would reset the slide position
    // The webview state (vscode.getState/setState) persists across visibility changes
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
    // Only update if content actually changed
    const newContentHash = this._getContentHash(document);
    if (newContentHash === this._lastContentHash) {
      return; // Content hasn't changed, keep slide position
    }

    this._lastContentHash = newContentHash;
    this._currentDocument = document;
    this._updateWebview();
  }

  public updateContentIfDifferent(document: vscode.TextDocument) {
    // Only update if it's a different document (ignore same doc to avoid reset on click)
    if (!this._currentDocument || this._currentDocument.uri.toString() !== document.uri.toString()) {
      this._lastContentHash = this._getContentHash(document);
      this._currentDocument = document;
      this._updateWebview();
    }
    // If same document, don't do anything (not even content check)
  }

  public isPreviewingDocument(document: vscode.TextDocument): boolean {
    return !!this._currentDocument && this._currentDocument.uri.toString() === document.uri.toString();
  }

  private _getContentHash(document: vscode.TextDocument): string {
    // Simple hash of content to detect real changes
    const content = document.getText();
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  private async _updateWebview() {
    // Prevent concurrent updates
    if (this._isUpdating) {
      return;
    }
    this._isUpdating = true;

    const webview = this._panel.webview;

    if (!this._currentDocument) {
      webview.html = this._getLoadingHtml();
      this._isUpdating = false;
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
    } finally {
      this._isUpdating = false;
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
    // Inject script to save and restore slide position using webview state
    const positionScript = `
    <script>
      (function() {
        const vscode = acquireVsCodeApi();
        
        // Get previous state or use saved position
        const previousState = vscode.getState();
        const savedPosition = previousState || ${JSON.stringify(this._lastSlidePosition)};
        
        Reveal.on('ready', () => {
          // Restore the last slide position without transition
          if (savedPosition && savedPosition.h !== undefined) {
            const h = savedPosition.h || 0;
            const v = savedPosition.v || 0;
            const f = savedPosition.f || 0;
            
            // Disable transitions temporarily
            const currentTransition = Reveal.getConfig().transition;
            Reveal.configure({ transition: 'none' });
            
            // Jump to the saved position
            setTimeout(() => {
              Reveal.slide(h, v, f);
              
              // Re-enable transitions
              setTimeout(() => {
                Reveal.configure({ transition: currentTransition });
              }, 100);
            }, 50);
          }
        });
        
        // Save position to both vscode state and send message
        function savePosition() {
          const indices = Reveal.getIndices();
          const position = { h: indices.h, v: indices.v, f: indices.f };
          
          // Persist in webview state (survives HTML reload)
          vscode.setState(position);
          
          // Also send to extension
          vscode.postMessage({
            type: 'slideChanged',
            position: position
          });
        }
        
        // Save on slide change
        Reveal.on('slidechanged', savePosition);
        Reveal.on('fragmentshown', savePosition);
        Reveal.on('fragmenthidden', savePosition);
      })();
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

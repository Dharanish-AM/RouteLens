const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const { scanProject } = require("./fileScanner.js");
const { extractEndpoints } = require("./parser.js");
const { enrichMetadata } = require("./metadataBuilder.js");

async function discoverAllEndpoints(rootDir = process.cwd()) {
  const files = await scanProject(rootDir);
  let allEndpoints = [];

  for (const file of files) {
    try {
      const eps = extractEndpoints(file);
      if (eps && eps.length > 0) allEndpoints.push(...eps);
    } catch {}
  }

  return enrichMetadata(allEndpoints);
}

module.exports = {discoverAllEndpoints}

// CLI runner
if (require.main === module) {
  (async () => {
    try {
      const rootDir = process.argv[2] || process.cwd();
      const endpoints = await discoverAllEndpoints(rootDir);

      const panel = vscode.window.createWebviewPanel(
        "endpointsView",
        "Discovered Endpoints",
        vscode.ViewColumn.One,
        {}
      );

      panel.webview.html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Discovered Endpoints</title>
          <style>
            body { font-family: monospace; padding: 1em; }
            pre { white-space: pre-wrap; word-wrap: break-word; }
          </style>
        </head>
        <body>
          <pre>${JSON.stringify(endpoints, null, 2)}</pre>
        </body>
        </html>
      `;

    } catch (err) {
      vscode.window.showErrorMessage("Error discovering endpoints: " + err.message);
      process.exit(1);
    }
  })();
}
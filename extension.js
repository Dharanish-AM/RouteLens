const vscode = require("vscode");
const { discoverAllEndpoints } = require("./src/scanner/index.js");
const { EndpointTreeProvider } = require("./src/ui/treeProvider.js");

function activate(context) {
  const disposable = vscode.commands.registerCommand("extension.scanEndpoints", async () => {
    const rootPath = vscode.workspace.rootPath;
    if (!rootPath) {
      vscode.window.showErrorMessage("No workspace folder open.");
      return;
    }

    vscode.window.showInformationMessage("🔍 Scanning project for endpoints...");
    let endpoints = [];
    try {
      endpoints = await discoverAllEndpoints(rootPath);
    } catch (err) {
      vscode.window.showErrorMessage("Error discovering endpoints: " + err.message);
      return;
    }

    const treeProvider = new EndpointTreeProvider(endpoints);
    vscode.window.createTreeView("endpointExplorer", { treeDataProvider: treeProvider });

    vscode.window.showInformationMessage(`✅ Found ${endpoints.length} endpoints.`);
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };
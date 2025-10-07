const vscode = require("vscode");
const { discoverAllEndpoints } = require("./src/scanner/index.js");
const { EndpointTreeProvider } = require("./src/ui/treeProvider.js");

let treeProvider;

function activate(context) {
  // Initialize the Endpoint Explorer tree view
  treeProvider = new EndpointTreeProvider([]);
  const treeView = vscode.window.createTreeView("endpointExplorer", {
    treeDataProvider: treeProvider,
  });

  // ✅ Set a context key so the Scan button always appears
  vscode.commands.executeCommand("setContext", "view", "endpointExplorer");

  // Register command: triggered by the Scan Project button or manually
  const scanCommand = vscode.commands.registerCommand(
    "extension.scanEndpoints",
    async () => {
      const rootPath = vscode.workspace.rootPath;
      if (!rootPath) {
        vscode.window.showErrorMessage("No workspace folder open.");
        return;
      }

      vscode.window.showInformationMessage(
        "🔍 Scanning project for endpoints..."
      );

      try {
        const endpoints = await discoverAllEndpoints(rootPath);
        treeProvider.refresh(endpoints);
        vscode.window.showInformationMessage(
          `✅ Found ${endpoints.length} endpoints.`
        );
      } catch (err) {
        vscode.window.showErrorMessage(
          `Error discovering endpoints: ${err.message}`
        );
      }
    }
  );

  // Keep all disposables managed by VS Code
  context.subscriptions.push(scanCommand, treeView);
}

function deactivate() {}

module.exports = { activate, deactivate };

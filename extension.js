const vscode = require("vscode");
const { discoverAllEndpoints } = require("./src/scanner/index.js");
const { EndpointTreeProvider } = require("./src/ui/treeProvider.js");

let treeProvider;

function activate(context) {
  
  treeProvider = new EndpointTreeProvider([]);
  const treeView = vscode.window.createTreeView("endpointExplorer", {
    treeDataProvider: treeProvider,
  });

  
  vscode.commands.executeCommand("setContext", "view", "endpointExplorer");

  
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

  
  context.subscriptions.push(scanCommand, treeView);
}

function deactivate() {}

module.exports = { activate, deactivate };

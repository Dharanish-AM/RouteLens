const vscode = require("vscode");

const methodColors = {
  GET: new vscode.ThemeColor('charts.green'),
  POST: new vscode.ThemeColor('charts.blue'),
  PUT: new vscode.ThemeColor('charts.orange'),
  DELETE: new vscode.ThemeColor('charts.red'),
  PATCH: new vscode.ThemeColor('charts.purple'),
};

class EndpointTreeProvider {
  constructor(endpoints) {
    this.endpoints = endpoints || [];
  }

  getTreeItem(element) {
    const item = new vscode.TreeItem(
      element.label,
      element.collapsibleState || vscode.TreeItemCollapsibleState.None
    );

    // Color-coded method badges
    if (element.type === 'method') {
      item.iconPath = new vscode.ThemeIcon('circle-filled', methodColors[element.label] || undefined);
    }

    // Endpoint nodes
    if (element.type === 'endpoint') {
      item.description = `${element.data.file.split("/").pop()} [line: ${element.data.line}]`;
      item.tooltip = `Path: ${element.data.path}
Method: ${element.data.method}
File: ${element.data.file}
Line: ${element.data.line}
Params: ${element.data.params.join(", ") || "none"}
Body: ${element.data.hasBody ? "Yes" : "No"}
Middleware: ${element.data.middleware.join(", ") || "none"}
Handlers: ${element.data.handlers.join(", ") || "none"}
Main Handler: ${element.data.mainHandler || "none"}
Middleware Count: ${element.data.middlewareCount}
Is Protected: ${element.data.isProtected ? "Yes" : "No"}`;
      item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;

      item.command = {
        command: "vscode.open",
        title: "Open File",
        arguments: [
          vscode.Uri.file(element.data.file),
          { selection: new vscode.Range(element.data.line - 1, 0, element.data.line - 1, 0) }
        ]
      };

      item.iconPath = new vscode.ThemeIcon('rocket'); // endpoint icon
    }

    // Info nodes (params, body, middleware count etc.)
    if (element.type === 'info') {
      item.collapsibleState = vscode.TreeItemCollapsibleState.None;
      item.iconPath = new vscode.ThemeIcon('circle-small');
    }

    // Middleware and handler nodes
    if (element.type === 'middleware' || element.type === 'handler') {
      item.collapsibleState = vscode.TreeItemCollapsibleState.None;
      item.iconPath = new vscode.ThemeIcon('tools'); // small gear icon
      item.tooltip = `Line: ${element.line || "unknown"}`;
    }

    return item;
  }

  getChildren(element) {
    if (!element) {
      // Top-level: group endpoints by method
      const grouped = {};
      this.endpoints.forEach(ep => {
        if (!grouped[ep.method]) grouped[ep.method] = [];
        grouped[ep.method].push(ep);
      });
      return Object.keys(grouped).map(method => ({
        label: method,
        collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
        type: 'method'
      }));
    }

    if (element.type === 'method') {
      // Endpoint nodes under method
      const endpoints = this.endpoints.filter(ep => ep.method === element.label);
      return endpoints.map(ep => ({
        label: ep.path,
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
        type: 'endpoint',
        data: ep
      }));
    }

    if (element.type === 'endpoint') {
      const ep = element.data;
      const children = [];

      // Params
      children.push({
        label: `Params: ${ep.params?.length ? ep.params.join(", ") : "none"}`,
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        type: 'info'
      });

      // Body
      children.push({
        label: `Has Body: ${ep.hasBody ? "Yes" : "No"}`,
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        type: 'info'
      });

      // Middleware nodes
      ep.middleware.forEach(mw => {
        children.push({
          label: `Middleware: ${mw}`,
          collapsibleState: vscode.TreeItemCollapsibleState.None,
          type: 'middleware'
        });
      });

      // Handlers nodes
      ep.handlers.forEach(h => {
        children.push({
          label: `Handler: ${h}`,
          collapsibleState: vscode.TreeItemCollapsibleState.None,
          type: 'handler'
        });
      });

      // Other info
      children.push({
        label: `Main Handler: ${ep.mainHandler || "none"}`,
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        type: 'info'
      });
      children.push({
        label: `Middleware Count: ${ep.middlewareCount}`,
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        type: 'info'
      });
      children.push({
        label: `Is Protected: ${ep.isProtected ? "Yes" : "No"}`,
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        type: 'info'
      });

      return children;
    }

    return [];
  }
}

module.exports = { EndpointTreeProvider };
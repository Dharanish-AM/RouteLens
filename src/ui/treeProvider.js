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
    this.endpoints = endpoints;
  }

  getTreeItem(element) {
    // element is a custom object with type and data
    const item = new vscode.TreeItem(element.label, element.collapsibleState);

    if (element.type === 'method') {
      item.iconPath = new vscode.ThemeIcon('circle-filled', methodColors[element.label] || undefined);
    }

    if (element.type === 'endpoint') {
      item.description = `${element.data.file.split("/").pop()} [params: ${element.data.params.join(", ") || "none"}]`;
      item.tooltip = element.data.file;
      item.command = {
        command: "vscode.open",
        title: "Open File",
        arguments: [
          vscode.Uri.file(element.data.file),
          { selection: new vscode.Range(element.data.line - 1, 0, element.data.line - 1, 0) }
        ]
      };
    }

    return item;
  }

  getChildren(element) {
    if (!element) {
      // Top-level: group endpoints by HTTP method
      const grouped = {};
      this.endpoints.forEach(ep => {
        if (!grouped[ep.method]) grouped[ep.method] = [];
        grouped[ep.method].push(ep);
      });

      return Object.keys(grouped).map(method => ({
        label: method,
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
        type: 'method'
      }));
    }

    if (element.type === 'method') {
      // Return endpoints under this method
      const endpoints = this.endpoints.filter(ep => ep.method === element.label);
      return endpoints.map(ep => ({
        label: ep.path,
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
        type: 'endpoint',
        data: ep
      }));
    }

    if (element.type === 'endpoint') {
      // Return sub-tree with Params, Body flag, Query flag
      const children = [];

      // Params node
      children.push({
        label: `Params: ${element.data.params.length > 0 ? element.data.params.join(", ") : "none"}`,
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        type: 'info'
      });

      // Body flag node
      children.push({
        label: `Has Body: ${element.data.hasBody ? "Yes" : "No"}`,
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        type: 'info'
      });

      // Query flag node
      children.push({
        label: `Has Query: ${element.data.hasQuery ? "Yes" : "No"}`,
        collapsibleState: vscode.TreeItemCollapsibleState.None,
        type: 'info'
      });

      return children;
    }

    return [];
  }
}

module.exports = { EndpointTreeProvider };
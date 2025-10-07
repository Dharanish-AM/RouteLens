const vscode = require("vscode");

const methodColors = {
  GET: new vscode.ThemeColor("charts.green"),
  POST: new vscode.ThemeColor("charts.blue"),
  PUT: new vscode.ThemeColor("charts.orange"),
  DELETE: new vscode.ThemeColor("charts.red"),
  PATCH: new vscode.ThemeColor("charts.purple"),
};

class EndpointTreeProvider {
  constructor(endpoints = []) {
    this.endpoints = endpoints;
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  refresh(newEndpoints) {
    this.endpoints = newEndpoints || [];
    this._onDidChangeTreeData.fire(); // refresh tree
  }

  getTreeItem(element) {
    const item = new vscode.TreeItem(
      element.label,
      element.collapsibleState || vscode.TreeItemCollapsibleState.None
    );

    // Color-coded method badges
    if (element.type === "method") {
      item.iconPath = new vscode.ThemeIcon(
        "circle-filled",
        methodColors[element.label] || undefined
      );
    }

    // Endpoint nodes
    if (element.type === "endpoint") {
      item.description = `${element.data.file.split("/").pop()} [line: ${
        element.data.line
      }]`;
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
          {
            selection: new vscode.Range(
              element.data.line - 1,
              0,
              element.data.line - 1,
              0
            ),
          },
        ],
      };
      item.iconPath = new vscode.ThemeIcon("rocket");
    }

    if (element.type === "info") {
      item.iconPath = new vscode.ThemeIcon("circle-small");
    }

    if (element.type === "middleware" || element.type === "handler") {
      item.iconPath = new vscode.ThemeIcon("tools");
    }

    return item;
  }

  getChildren(element) {
    if (!element) {
      const grouped = {};
      this.endpoints.forEach((ep) => {
        if (!grouped[ep.method]) grouped[ep.method] = [];
        grouped[ep.method].push(ep);
      });
      return Object.keys(grouped).map((method) => ({
        label: method,
        collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
        type: "method",
      }));
    }

    if (element.type === "method") {
      const endpoints = this.endpoints.filter(
        (ep) => ep.method === element.label
      );
      return endpoints.map((ep) => ({
        label: ep.path,
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
        type: "endpoint",
        data: ep,
      }));
    }

    if (element.type === "endpoint") {
      const ep = element.data;
      const children = [];

      children.push({
        label: `Params: ${ep.params?.length ? ep.params.join(", ") : "none"}`,
        type: "info",
      });
      children.push({
        label: `Has Query: ${ep.hasQuery ? "Yes" : "No"}`,
        type: "info",
      });
      children.push({
        label: `Has Body: ${ep.hasBody ? "Yes" : "No"}`,
        type: "info",
      });

      ep.middleware.forEach((mw) =>
        children.push({ label: `Middleware: ${mw}`, type: "middleware" })
      );
      ep.handlers.forEach((h) =>
        children.push({ label: `Handler: ${h}`, type: "handler" })
      );

      children.push({ label: `Main Handler: ${ep.mainHandler || "none"}`, type: "info" });
      children.push({ label: `Middleware Count: ${ep.middlewareCount}`, type: "info" });
      children.push({ label: `Is Protected: ${ep.isProtected ? "Yes" : "No"}`, type: "info" });

      return children;
    }

    return [];
  }
}

module.exports = { EndpointTreeProvider };

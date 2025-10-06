# RouteLens VS Code Extension

## Overview
RouteLens scans your Node.js project and visualizes all API endpoints (Express/Fastify) in a TreeView inside VS Code.

## Features
- Detect all routes: GET, POST, PUT, DELETE, PATCH
- Shows params, request body usage
- Click to open file at route definition
- TreeView grouped by HTTP method

## Usage
1. Open your Node.js project in VS Code.
2. Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P).
3. Run: `Scan Node Endpoints`.
4. Sidebar "Node Endpoint Explorer" will display your endpoints.

## Folder Structure
- `src/scanner/` - scans project files and parses AST
- `src/ui/treeProvider.js` - TreeView GUI logic
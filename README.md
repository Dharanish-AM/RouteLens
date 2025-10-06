# 🚀 RouteLens — VS Code Extension
---

## **Overview**

**RouteLens** is a powerful **VS Code extension** that scans Node.js projects and **visualizes all API endpoints** in a clear, interactive **TreeView**. It supports **Express** and **Fastify** frameworks and provides developers a **quick, structured view of routes** for easier development, debugging, and documentation.  

With RouteLens, you can instantly see:

- HTTP methods (GET, POST, PUT, DELETE, PATCH)  
- Route parameters (`:id`, `:name`, etc.)  
- Request body presence  
- Middleware applied to endpoints  
- Handler functions  
- Protection status for auth middleware  

All of this is displayed in a **collapsible, color-coded TreeView sidebar** in VS Code.

---

## **Features**

- ✅ **Automatic Route Detection** — Supports Express & Fastify projects  
- ✅ **Method Grouping** — GET, POST, PUT, DELETE, PATCH are color-coded  
- ✅ **Interactive TreeView** — Expand routes to see params, middleware, handlers, and body usage  
- ✅ **Clickable Endpoints** — Jump directly to route definitions in code  
- ✅ **Middleware & Handler Details** — See full route chain for debugging and refactoring  
- ✅ **Protected Routes** — Highlights routes with auth middleware applied  
- ✅ **Rich Tooltips** — Quick view of all endpoint metadata on hover  
- ✅ **Tested with Sample Apps** — Comes with a sample Node.js app to validate scanning  

---

## **Installation**

1. Open VS Code.  
2. Go to **Extensions** (`Ctrl+Shift+X` / `Cmd+Shift+X`).  
3. Search for **RouteLens**.  
4. Click **Install**.  

Or install directly via CLI:

```bash
ext install dharanisham.routelens
```

---

## **Usage**

1. Open your **Node.js project** in VS Code.  
2. Open the **Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`).  
3. Run: `Scan Node Endpoints`.  
4. Sidebar **“Node Endpoint Explorer”** displays:  
   - HTTP method nodes (colored badges)  
   - Routes grouped by method  
   - Expand to see detailed metadata  

---

## **Example TreeView Structure**

```
GET
 ├─ /users/:id
 │   ├─ Params: id
 │   ├─ Has Body: No
 │   ├─ Middleware: authCheck
 │   ├─ Handlers: getUser
 │   ├─ Main Handler: getUser
 │   ├─ Middleware Count: 1
 │   └─ Is Protected: Yes
 └─ /search
     ├─ Params: none
     ├─ Has Body: No
     └─ Middleware: none

POST
 └─ /users
     ├─ Params: none
     ├─ Has Body: Yes
     └─ Middleware: validateUser
```

---

## **Folder Structure**

```
RouteLens/
├── images/                  # Icons and logos
│   ├── routelens.png
│   └── routelens.svg
├── src/
│   ├── scanner/             # Core scanner logic
│   │   ├── parser.js
│   │   ├── metadataBuilder.js
│   │   ├── fileScanner.js
│   │   └── index.js
│   └── ui/
│       └── treeProvider.js  # VS Code TreeView UI
├── test/                     # Sample app and test runner
│   ├── sampleApp.js
│   └── runTest.js
├── extension.js              # VS Code extension activation
├── package.json
├── package-lock.json
├── README.md
└── routelens-0.0.6.vsix     # VSIX packaged extension
```

---

## **Technical Details**

- **Language**: JavaScript (Node.js / VS Code API)  
- **Parsing**: Babel AST to extract endpoints from source files  
- **Metadata Extraction**: Identifies:
  - HTTP methods, paths, params  
  - Middleware functions  
  - Handler functions  
  - Request body usage (`hasBody`)  
  - Route protection status (`isProtected`)  
- **UI**: TreeView in Explorer sidebar with:
  - Color-coded method badges  
  - Tooltips for full metadata  
  - Clickable endpoints to open files at route lines  

---

## **Development**

### **Setup**
```bash
git clone https://github.com/DharanishAM/RouteLens.git
cd RouteLens
npm install
```

### **Test Scanner**
```bash
node test/runTest.js
```

### **Run in VS Code Extension Development Mode**
1. Press `F5` to launch a **new VS Code window** with the extension loaded.  
2. Use **Command Palette → Scan Node Endpoints**.  

---

## **Contribution**

Contributions are welcome! Feel free to submit:

- Feature requests  
- Bug reports  
- Pull requests  

**Suggestions for future improvements:**

- Multi-framework support (Nest.js, Koa)  
- Swagger/OpenAPI auto-export  
- Search/filter endpoints in sidebar  
- Async vs sync handler detection  

---

## **License**

This project is licensed under the **MIT License**. See [LICENSE.txt](LICENSE.txt) for details.

---

## **Contact / Support**

Developed by **Dharanish A M**  
- GitHub: [github.com/DharanishAM](https://github.com/DharanishAM)  
- Email: dharanish816@gmail.com  

---

✅ **With RouteLens, exploring and managing Node.js endpoints is now fast, visual, and developer-friendly.**
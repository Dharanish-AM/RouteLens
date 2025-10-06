const fs = require("fs");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const METHODS = ["get", "post", "put", "delete", "patch"];

function extractEndpoints(filePath) {
  const code = fs.readFileSync(filePath, "utf-8");
  const ast = parse(code, { sourceType: "unambiguous", plugins: ["jsx", "typescript"] });

  const endpoints = [];

  traverse(ast, {
    CallExpression({ node }) {
      if (
        node.callee &&
        node.callee.property &&
        METHODS.includes(node.callee.property.name)
      ) {
        const method = node.callee.property.name.toUpperCase();
        const pathArg = node.arguments[0];
        const handlers = node.arguments.slice(1).map(h => {
          if (h.type === "Identifier") return h.name;
          if (h.type === "ArrowFunctionExpression" || h.type === "FunctionExpression") return "anonymous";
          return "unknown";
        });
        const handlersAst = node.arguments.slice(1);

        if (pathArg && pathArg.value) {
          endpoints.push({
            method,
            path: pathArg.value,
            file: filePath,
            line: node.loc.start.line,
            handlers,
            handlersAst,
            middleware: handlers.length > 1 ? handlers.slice(0, -1) : [],
            mainHandler: handlers.length > 0 ? handlers[handlers.length - 1] : null
          });
        }
      }
    },
  });

  return endpoints;
}

module.exports = { extractEndpoints };
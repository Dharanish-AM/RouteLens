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
        if (pathArg && pathArg.value) {
          endpoints.push({
            method,
            path: pathArg.value,
            file: filePath,
            line: node.loc.start.line
          });
        }
      }
    },
  });

  return endpoints;
}

module.exports = {extractEndpoints}
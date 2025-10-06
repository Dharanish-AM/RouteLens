const t = require("@babel/types");

function hasReqQuery(node) {
  if (!node || typeof node !== "object") return false;

  if (t.isMemberExpression(node)) {
    if (
      t.isIdentifier(node.object, { name: "req" }) &&
      ((t.isIdentifier(node.property, { name: "query" }) && !node.computed) ||
       (t.isStringLiteral(node.property, { value: "query" }) && node.computed))
    ) {
      return true;
    }
  }

  // Recursively check child nodes
  for (const key in node) {
    if (Array.isArray(node[key])) {
      for (const child of node[key]) {
        if (hasReqQuery(child)) return true;
      }
    } else if (typeof node[key] === "object" && node[key] !== null) {
      if (hasReqQuery(node[key])) return true;
    }
  }

  return false;
}

function enrichMetadata(endpoints) {
  return endpoints.map(ep => {
    const params = [];
    const paramMatches = ep.path.match(/:([a-zA-Z0-9_]+)/g);
    if (paramMatches) {
      paramMatches.forEach(p => params.push(p.replace(":", "")));
    }

    const hasBody = ep.method !== "GET";

    let hasQuery = false;
    ep.handlersAst?.forEach(handlerNode => {
      if (hasReqQuery(handlerNode)) {
        hasQuery = true;
      }
    });

    const isProtected = ep.middleware.some(mw => /auth/i.test(mw));

    return {
      ...ep,
      params,
      hasBody,
      hasQuery,
      middlewareCount: ep.middleware.length,
      isProtected
    };
  });
}

module.exports = { enrichMetadata };
function enrichMetadata(endpoints) {
  return endpoints.map(ep => {
    const params = [];
    const paramMatches = ep.path.match(/:([a-zA-Z0-9_]+)/g);
    if (paramMatches) {
      paramMatches.forEach(p => params.push(p.replace(":", "")));
    }

    const hasBody = ep.method !== "GET";

    // Example: mark route as protected if auth middleware exists
    const isProtected = ep.middleware.some(mw => /auth/i.test(mw));

    return { 
      ...ep, 
      params, 
      hasBody, 
      middlewareCount: ep.middleware.length,
      isProtected
    };
  });
}

module.exports = { enrichMetadata };
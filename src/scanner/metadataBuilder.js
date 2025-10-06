
function enrichMetadata(endpoints) {
  return endpoints.map(ep => {
    const params = [];
    const paramMatches = ep.path.match(/:([a-zA-Z0-9_]+)/g);
    if (paramMatches) {
      paramMatches.forEach(p => params.push(p.replace(":", "")));
    }

    const hasBody = ep.method !== "GET";
    return { ...ep, params, hasBody };
  });
}

module.exports = {enrichMetadata}
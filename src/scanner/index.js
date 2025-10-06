const { scanProject } = require("./fileScanner.js");
const { extractEndpoints } = require("./parser.js");
const { enrichMetadata } = require("./metadataBuilder.js");

async function discoverAllEndpoints(rootDir = process.cwd()) {
  const files = await scanProject(rootDir);
  let allEndpoints = [];

  for (const file of files) {
    try {
      const eps = extractEndpoints(file);
      if (eps && eps.length > 0) allEndpoints.push(...eps);
    } catch {}
  }

  return enrichMetadata(allEndpoints);
}

module.exports = {discoverAllEndpoints}
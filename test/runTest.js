const path = require("path");
const { discoverAllEndpoints } = require("../src/scanner/index.js");

(async () => {
  const root = path.join(__dirname); // test directory
  const endpoints = await discoverAllEndpoints(root);
  console.log("✅ Discovered Endpoints:", endpoints);
})();
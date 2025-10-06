const { glob } = require("glob");

async function scanProject(rootPath) {
  const files = await glob(
    `${rootPath}/**/*.{js,ts}`,
    { ignore: ["**/node_modules/**", "**/dist/**"] }
  );
  return files;
}

module.exports = { scanProject };
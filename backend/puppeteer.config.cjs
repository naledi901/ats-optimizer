const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Tells Puppeteer to download Chrome to a local folder (.cache)
  // This avoids "Permission Denied" and "Not Found" errors on Render.
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
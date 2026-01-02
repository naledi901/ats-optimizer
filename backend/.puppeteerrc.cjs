const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Tells Puppeteer to install Chrome in a local ".cache" folder
  // This ensures it travels with your code to the cloud.
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
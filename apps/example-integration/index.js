const path = require("path");
const { startBot } = require("bensbigolbeard-automaton");

const pathToCerts = path.join(__dirname, "certs");
const pathToPlugins = path.join(__dirname, "plugin-registry.js");

startBot({ pathToCerts, pathToPlugins });

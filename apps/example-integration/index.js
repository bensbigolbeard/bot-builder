import path from "path";
import startServer from "bensbigolbeard-automaton";

const pathToCerts = path.join(__dirname, "certs");
const pathToPlugins = path.join(__dirname, "plugin-registry.js");

startServer({ pathToCerts, pathToPlugins });

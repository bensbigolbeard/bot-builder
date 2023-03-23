module.exports = {
  apps: [
    {
      name: "example-integration",
      script: "index.js",
      node_args: "-r dotenv/config",
    },
  ],
};

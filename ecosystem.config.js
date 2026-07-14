module.exports = {
  apps: [
    {
      name: "classicedge",
      script: "npm",
      args: "run start",
      env: {
        PORT: 3002,
        NODE_ENV: "production",
      },
    },
  ],
};

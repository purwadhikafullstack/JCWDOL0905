module.exports = {
  apps: [
    {
      name: "JCWD-09-05", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 8905,
      },
      time: true,
    },
  ],
};

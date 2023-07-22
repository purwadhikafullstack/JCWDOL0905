module.exports = {
  apps: [
    {
      name: "JCWDOL-09-05", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 8905,
      },
      time: true,
    },
  ],
};

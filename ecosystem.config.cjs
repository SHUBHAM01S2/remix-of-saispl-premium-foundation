module.exports = {
  apps: [
    {
      name: "shivaryan",
      script: "dist/server/index.mjs",
      interpreter: "node",
      cwd: "/var/www/Shivaryan",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOST: "127.0.0.1",
      },
    },
  ],
};
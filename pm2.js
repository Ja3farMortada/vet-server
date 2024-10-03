module.exports = {
    apps: [
      {
        name: "vet-app",
        script: "./app.js",  // Replace with your entry point
        env: {
          NODE_ENV: "production",
          // Add other environment variables here
        },
      },
    ],
  };
  
module.exports = {
  apps: [
    {
      name: "Eins",
      script: "./http.js",
      instances: 1,
      max_memory_restart: "300M",

      // Logging
      out_file: "./out.log",
      error_file: "./error.log",
      merge_logs: true,
      log_date_format: "DD-MM HH:mm:ss Z",
      log_type: "json",
      exec_mode: "fork",

      // Env Specific Config
      env_production: {
        NODE_ENV: "production",
        PORT: 8082,
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 8082,
        watch: true,
        watch_delay: 3000,
        ignore_watch: [
          "./node_modules",
          "./app/views",
          "./public",
          "./.DS_Store",
          "./package.json",
          "./yarn.lock",
          "./samples",
          "./src"
        ],
      },
    },
  ],
};


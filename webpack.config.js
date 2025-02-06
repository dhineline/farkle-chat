const path = require("path")

module.exports = {
  entry: "./out/_next/static/chunks/pages/index.js",
  output: {
    filename: "chat-interface.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "production",
}


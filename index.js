const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const logger = require("./utils/loggerConfig");
require("dotenv").config();

const app = express();
//essential middlewares

// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// http header security middleware
app.use(helmet());
// Compression middleware with general configuration
app.use(
  compression({
    // Threshold: Only compress responses that are bigger than this size in bytes
    // The default threshold is 1KB
    threshold: 1024,

    // Level: The level of compression (from 1 for fastest and less compression
    // to 9 for slowest and best compression)
    // Default is zlib's default compression level
    level: 6,

    // Filter: Decide if the response should be compressed or not,
    // depending on the 'Content-Type' header
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        // Don't compress responses if this request header is present
        return false;
      }

      // Use the default filter (compressible response types)
      return compression.filter(req, res);
    },
  })
);
app.use(morgan("combined", { stream: logger.stream }));
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("This is the standard express server");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const fs = require("fs");
const http = require("http");
const path = require("path");

const rootDir = __dirname;
const port = Number(process.env.PORT) || 3000;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

function resolveRequestPath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split("?")[0]);
  const normalizedPath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  const requestedPath = path.join(rootDir, normalizedPath);

  if (!requestedPath.startsWith(rootDir)) {
    return null;
  }

  return requestedPath;
}

function sendFile(response, filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extension] || "application/octet-stream";

  fs.createReadStream(filePath)
    .on("error", () => {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Internal Server Error");
    })
    .once("open", () => {
      response.writeHead(200, { "Content-Type": contentType });
    })
    .pipe(response);
}

const server = http.createServer((request, response) => {
  const requestedPath = resolveRequestPath(request.url || "/");

  if (!requestedPath) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  fs.stat(requestedPath, (error, stats) => {
    if (!error && stats.isFile()) {
      sendFile(response, requestedPath);
      return;
    }

    const indexPath = path.join(rootDir, "index.html");
    sendFile(response, indexPath);
  });
});

server.listen(port, () => {
  console.log(`BignLean admin build is running at http://localhost:${port}`);
});

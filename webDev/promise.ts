import * as http from "http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World!\n");
});

const port: number = 3001;

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

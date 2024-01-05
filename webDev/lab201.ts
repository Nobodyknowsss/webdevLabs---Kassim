import http, { IncomingMessage, ServerResponse, createServer } from "node:http";

const port = 3001;

function handleRequest(req: IncomingMessage, res: ServerResponse) {
  res.end(req.url);
}
const server = http.createServer(handleRequest);

server.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

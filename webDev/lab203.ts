import * as http from "http";
import { Pool } from "pg";
import { URLSearchParams } from "url";
import * as fs from "fs/promises";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "webdev",
  password: "123456789",
  port: 5434,
});

async function handleRequest(
  request: http.IncomingMessage,
  response: http.ServerResponse
) {
  const url = request.url;
  const method = request.method;

  if (url === "/apply-loan" && method === "GET") {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(await fs.readFile("../lab202.html", "utf-8"));
  } else if (url === "/apply-loan-success" && method === "POST") {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", async () => {
      try {
        const formData = new URLSearchParams(body);
        const name = formData.get("name");
        const email = formData.get("email");
        const phone = formData.get("phone");
        const amount = formData.get("loan_amount");
        const purpose = formData.get("reason");

        const insertQuery = `
          INSERT INTO LOANS (name, email, phone, amount, purpose, date)
          VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
          RETURNING id`;
        const values = [name, email, phone, amount, purpose];

        const client = await pool.connect();
        try {
          const result = await client.query(insertQuery, values);
          response.writeHead(200, { "Content-Type": "text/html" });
          response.end(
            `Congrats! your officially broke. Your Loan ID is: ${result.rows[0].id}`
          );
        } catch (error) {
          console.error("Error executing SQL query:", error);
          response.writeHead(500, { "Content-Type": "text/plain" });
          response.end("Internal Server Error");
        } finally {
          client.release();
        }
      } catch (error) {
        console.error("Error parsing form data:", error);
        response.writeHead(400, { "Content-Type": "text/plain" });
        response.end("Bad Request");
      }
    });
  } else {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("Not Found");
  }
}

const server = http.createServer(handleRequest);

server.listen(3000, () => {
  console.log("Server started at http://localhost:3000");
});

import * as http from "http";
import { Pool } from "pg";
import { URLSearchParams } from "url";
import * as fs from "fs/promises";
import express, { Request, Response } from "express";

const router = express.Router();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "vetClinic",
  password: "manaf1505",
  port: 5434,
});

async function handleRequest(
  request: http.IncomingMessage,
  response: http.ServerResponse
) {
  const url = request.url;
  const method = request.method;

  if (url === "/patient" && method === "GET") {
    try {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.end(await fs.readFile("../lab3.html", "utf-8"));
    } catch (error) {
      console.error("Error reading HTML file:", error);
      response.writeHead(500, { "Content-Type": "text/plain" });
      response.end("Internal Server Error");
    }
  } else if (url === "/patient" && method === "POST") {
    try {
      let body = "";
      request.on("data", (chunk) => {
        body += chunk;
      });

      request.on("end", async () => {
        const formData = new URLSearchParams(body);
        const name = formData.get("name");
        const species = formData.get("species");
        const age = formData.get("age");
        const sickness = formData.get("sickness");

        const createdAt = new Date();

        const client = await pool.connect();

        try {
          await client.query(
            "INSERT INTO patients (name, species, age, sickness, created_at) VALUES ($1, $2, $3, $4, $5)",
            [name, species, age, sickness, createdAt]
          );

          response.writeHead(201, { "Content-Type": "text/plain" });
          response.end("Patient created successfully");
        } finally {
          client.release();
        }
      });
    } catch (error) {
      console.error("Error parsing form data:", error);
      response.writeHead(400, { "Content-Type": "text/plain" });
      response.end("Bad Request");
    }
  } else {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("Not Found");
  }
}

const server = http.createServer(handleRequest);

server.listen(3000, () => {
  console.log("Server started at http://localhost:3000");
});

import * as fs from "node:fs/promises";
import * as readlineSync from "readline-sync";

async function readDebts() {
  try {
    const debts = await fs.readFile("./debts.txt", "utf-8");

    const name: string = readlineSync.question("Enter your name: ");
    const amount: string = readlineSync.question("Enter the amount: ");

    const updatedDebts = `${debts}\n ${name}: ${amount}`;

    await fs.writeFile("./debts.txt", updatedDebts, "utf-8");
    console.log("Data appended to debts.txt");
  } catch (error) {
    console.error(error);
  }
}

readDebts();

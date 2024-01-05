import * as fs from "node:fs/promises";
import * as readlineSync from "readline-sync";

const readDebts = (): Promise<string> => {
  return fs.readFile("./debts.txt", "utf-8").catch((error) => {
    throw error;
  });
};

readDebts()
  .then((debts) => {
    const name: string = readlineSync.question("Enter your name: ");
    const amount: string = readlineSync.question("Enter the amount: ");
    const updatedDebts = `${debts}\n${name}: ${amount}`;
    fs.writeFile("./debts.txt", updatedDebts, "utf-8");
    console.log("Data appended to debts.txt");
  })

  .catch((error) => {
    throw error;
  });

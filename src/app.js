import express from "express";
import customerRouter from "./endpoints/customer.js";
import orderRouter from "./endpoints/order.js";
import errorRouter from "./endpoints/errors.js";
import {auth} from "./middleware/auth.js";
import fs from 'fs';
import path from 'path';

function ensureEnvFileExists(filename = '.env') {
  const envPath = path.resolve(process.cwd(), filename);

  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, '', { encoding: 'utf8' });
    console.log(`${filename} file was missing, so it was created.`);
  } else {
    console.log(`${filename} file already exists.`);
  }
}
ensureEnvFileExists(); // Ensure the .env file exists
process.loadEnvFile();

const app = express();

const port = process.env.PORT || 3000;

app.use(auth);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/customers", customerRouter);
app.use("/api/orders", orderRouter);
app.use("/api/errors", errorRouter);

app.get("/", (req, res) => {
    res.status(403).send("Forbidden");
});

app.listen(port, () => {
    console.log(`Server is running on Port: ${port}`);
    }
);
import express from "express";
import {auth} from "./middleware/auth.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import customerRouter from "./endpoints/customer.js";
import orderRouter from "./endpoints/order.js";
import errorRouter from "./endpoints/errors.js";

// Get the current file and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root is one level up from /src
const rootDir = path.resolve(__dirname, '..');

function ensureEnvFileExists(filename = '.env') {
  const envPath = path.join(rootDir, filename);

  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, '', 'utf8');
    console.log(`${filename} created in root.`);
  } else {
    console.log(`${filename} already exists in root.`);
  }
}

// 🧪 Use it before loading env
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
import express from "express";
import {auth} from "./middleware/auth.js";

import customerRouter from "./endpoints/customer.js";
import orderRouter from "./endpoints/order.js";
import errorRouter from "./endpoints/errors.js";

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
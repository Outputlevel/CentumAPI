import {Router } from "express";
import { OrderController } from "../controller/index.js";

const router = Router();
const oc = new OrderController();

router.post("/", oc.createOrderCentum);

export default router;
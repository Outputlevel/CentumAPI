import { Router } from "express";
import {CustomerController} from "../controller/index.js";
import { isCustomer } from "../middleware/index.js";

const router = Router();
 const cc = new CustomerController();

router.post("/",  isCustomer, cc.createCustomer);

export default router;
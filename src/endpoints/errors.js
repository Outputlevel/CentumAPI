import { ErrorController } from "../controller/errorController.js";
import { Router } from "express";
const router = Router();

const ec = new ErrorController();
router.post("/", ec.handleErrors);

export default router;
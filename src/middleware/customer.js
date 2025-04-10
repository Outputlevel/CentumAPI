import { CustomerService } from "../service/customerService.js";
import { CustomerSchema } from "../schemas/index.js";

export const isCustomer = async (req, res, next) => {
    const cuit = req.body.cuit;

    if (!cuit || cuit.length !== 11) {
        return res.status(400).json({ status: 400, message: "Cuit is not valid" });
    }
    const customerService = new CustomerService();
    const isRegistered = await customerService.isCustomerRegistered(cuit);
    
    if (isRegistered) {
        return res.status(409).json({ status: 409, message: "Customer already exists" });
    }
    next();
};

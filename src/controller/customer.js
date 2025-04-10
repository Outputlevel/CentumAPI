import { CustomerService } from '../service/customerService.js';
import { CustomerSchema } from '../schemas/index.js';

process.loadEnvFile();

const debugMode = process.env.DEBUG_MODE || "true";

class CustomerController {
    constructor() {
        this.customerService = new CustomerService();
    }
    createCustomer = async (req, res) => {
        try {
            const body = req.body;   //From middleware 
            // Attempt to create the customer
            const data = await this.customerService.createCustomer(body);
            
            // If in dev mode, return immediately
            if(debugMode === "true") return res.status(201).send({status:201, debugMode, data }); // Skip API call in dev mode
            
            if (data.status > 500) { 
                return res.status(500).send({
                    status: 500,
                    message: "Internal Server Error. Customer saved in Woo"
                });
            }
            if (data.status === 400) return res.status(400).send(data);
            if (data.status === 201) return res.status(201).send(data);
    
        } catch (error) {
            console.error("Unexpected error in createCustomer:", error);
            return res.status(500).send({ status: 500, message: "Unexpected error occurred." });
        }
    };
    
}
export { CustomerController };
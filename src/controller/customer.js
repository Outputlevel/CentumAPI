import { CustomerService } from '../service/customerService.js';
import { ErrorService } from '../service/errorService.js';
import { CustomerSchema } from '../schemas/index.js';
import { DEBUG_MODE } from '../utils/config.js';

const debugMode = DEBUG_MODE || "true";

class CustomerController {
    constructor() {
        this.customerService = new CustomerService();
        this.errorService = new ErrorService();
    }
    getCustomerByCuit = async(req, res) => {
        const cuit = "30717293432";
        if (!cuit) return res.status(400).send({status:400, message: "Cuit is empty"});
        const data = await this.customerService.getCustomerIdByCuit(cuit);
        if (data.status === 500) {
            return res.status(500).send(data);
        }
        if (data.status === 200) {
            res.status(200).send(data);
            return;
        }
    } 

    createCustomer = async (req, res) => {
        try {
            const body = req.body;   //From middleware 
            // Attempt to create the customer
            
            if (!body) return res.status(400).send({status:400, message: "Body is empty"});

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
            if (data.status === 201) {
                // Send response to client immediately
                res.status(201).send(data);

                // Fire and forget Woo sync
                const { IdCliente, Codigo } = data.payload;
                const wooBody = {
                    customer_id: body.woo_customer_id,
                    customer_id_centum: IdCliente,
                    customer_code_centum: Codigo,
                };

                this.errorService.postCustomerWoo(wooBody).catch(err => {
                    console.error("Failed to sync customer with WooCommerce:", err);
                });

                return; // Stop further execution
            }
        } catch (error) {
            console.error("Unexpected error in createCustomer:", error);
            return res.status(500).send({ status: 500, message: "Unexpected error occurred." });
        }
    };
    
}
export { CustomerController };
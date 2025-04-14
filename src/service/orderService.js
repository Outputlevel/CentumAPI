import {CentumDAO} from '../DAO/centumDAO.js';
import { ErrorService } from './index.js';
import {OrderSchema} from '../schemas/index.js';
import { DEBUG_MODE } from '../utils/config.js';

const debugMode = DEBUG_MODE || false;

class OrderService {
    constructor() {
        this.centumDAO = new CentumDAO();
    }

    createOrder = async(reqBody) => {
        try {
            const schema = new OrderSchema(reqBody);
            let body = schema.orderSchema();
            let centumSchema = await schema.centumOrderSchema(body);
            
            // Skip API call in dev mode
            if (debugMode === "true") return {status:201, debugMode, centumSchema}; 
            //const data = {status: 599}; // Simulate a response for testing
            const data = await this.centumDAO.createOrder(centumSchema);
            
            // Handle API failure
            if (data.status > 500 ) {
                const errorService = new ErrorService();
                await errorService.postOrderError({
                    order_id: centumSchema.woo_order_id,
                    json_data: centumSchema,
                    status: 'pending'
                });

                return {
                    status: 500,
                    message: "Internal Server Error. Order saved in Woo"
                };
            }
            return data;
        } catch (error) {
            console.error("Unexpected error in createOrder:", error);
            return res.status(500).send({ status: 500, message: "Unexpected error occurred." });
        }
    }
}

export { OrderService };
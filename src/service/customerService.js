import {CentumDAO} from '../DAO/centumDAO.js';
import {CustomerSchema} from '../schemas/index.js';
import {ErrorService} from './index.js';
import { DEBUG_MODE } from '../utils/config.js';

const debugMode = DEBUG_MODE || false;
export class CustomerService{
    constructor(){
        this.centumDAO = new CentumDAO();
    }

    getCustomers = async () => {
        const data = await this.centumDAO.getCustomers();
        if(data.payload.Items.length === 0) return null;
        return data;
    }

    getCustomerById = async (id) => {
        const data = await this.centumDAO.getCustomerById(id);
        if(data.payload.Items.length === 0) return null;
        return data;
    }

    getCustomerByCode = async (code) => {
        const data = await this.centumDAO.getCustomerByCode(code);
        if(data.payload.Items.length === 0) return null;
        return data;
    }

    getCustomerByCuit = async (cuit) => {
        const data = await this.centumDAO.getCustomerByCuit(cuit);
        if(data.payload.Items.length === 0) return null;
        return data;
    }
    //returns ID
    getCustomerIdByCuit = async (cuit) => {
        const data = await this.centumDAO.getCustomerIdByCuit(cuit);
        //if(data.length === 0 || data === null) return null;
        //console.log({ID: data.payload.Items[0].IdCliente});
        return data;
    }

    isCustomerRegistered = async (customerCentumData) => {
        const data = customerCentumData;
        if (!data?.payload?.Items?.length) return false;
        return true;
    };
    createCustomer = async (reqBody, schemaSet = false) => {
        try {
            let centumSchema;
            if (schemaSet === true) {
                centumSchema = reqBody;
            } else if(schemaSet === false) {
                const schema = new CustomerSchema(reqBody);
                const body = schema.customerSchema();
                centumSchema = schema.centumCustomerSchema(body);
            }
        
            if (debugMode === "true") return body; // Skip API call in dev mode
    
            let attempt = 0;
            const originalRazonSocial = centumSchema.RazonSocial;
            let response;
    
            do {
                // Only modify razonSocial if it's not the first attempt
                if (attempt > 0) {
                    centumSchema.RazonSocial = `${originalRazonSocial} ${attempt + 1}`;
                }
                //Create customer
                response = await this.centumDAO.createCustomer(centumSchema);
    
                // Break if it's successful or a different error
                if (
                    !response.payload?.Code || 
                    response.payload.Code !== "EmpresaRazonSocialYaExisteException"
                ) {
                    break;
                }
    
                attempt++;
            } while (attempt < 5); // Prevent infinite loops

            //Simulate Centum error
            //response = {status: 500}; // Simulate a response for testing
            // Handle critical error
            if (!response || response.status >= 500) {
                const errorService = new ErrorService();
                await errorService.postCustomerError({
                    customer_id: centumSchema.woo_customer_id,
                    json_data: centumSchema,
                    status: 'pending'
                });
            }
            return response;
        } catch (error) {
            console.error("Error creating customer:", error);
            return null;
        }
    };
    
    getPaises = async () => {
        return await this.centumDAO.getPaises();
    }


}
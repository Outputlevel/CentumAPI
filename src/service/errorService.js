import { ErrorsDAO } from "../DAO/errorsDAO.js";
import { CustomerService, OrderService } from "./index.js";

export class ErrorService{
    constructor(){
        this.dao = new ErrorsDAO();
        this.customerService = new CustomerService();
        this.orderService = new OrderService();
    }
    getCustomerErrors = async() => {
        return await this.dao.getCustomersErrors();
    }
    getOrderErrors = async() => {
        return await this.dao.getOrdersErrors();
    }
    postCustomerError = async(body) => {
        return await this.dao.postCustomerError(body);
    }
    postOrderError = async(body) => {
        return await this.dao.postOrderError(body);
    }
    deleteCustomerErrors = async(id) => {
        return await this.dao.deleteCustomerErrors(id);
    }
    deleteOrderErrors = async(id) => {
        return await this.dao.deleteOrderErrors(id);
    }
    postCustomerWoo = async(body) => {
        return await this.dao.postCustomerWoo(body);
    }
    postOrderWoo = async(body) => {
        return await this.dao.postOrderWoo(body);
    }
    handleErrors = async () =>  {
        // Generic function to process entities (customers/orders)
        const processEntities = async (getErrors, createEntity, deleteEntity, postWoo, entityType) => {
            const errors = await getErrors();
            if (errors.status === 200) {
                for (const e of errors.payload) {
                    try {
                        let response = await createEntity(e.json_data,  true);
                        response = {status: 201}; // Simulate a successful response for testing
                        if (response.status === 201) {
                            const deleteResponse = await deleteEntity(e.id);
                            if (deleteResponse.status === 200) {
                                const body = entityType === "customer" 
                                    ? { 
                                        customer_id: e.customer_id,
                                        customer_code_centum: e.json_data.Codigo,
                                        //customer_id_centum: 9999
                                        customer_id_centum: response.payload.IdCliente 
                                      }
                                    : { 
                                        order_id: e.woo_order_id,
                                        order_id_centum: response.payload.IdPedido 
                                      };
                                await postWoo(body);
                            }
                        }
                    } catch (err) {
                        console.error(`Failed to create ${entityType} ${e.id}:`, err);
                    }
                }
            }
        };
    
        // Handle both customers and orders using the same logic
        await processEntities(
            this.getCustomerErrors,
            this.customerService.createCustomer.bind(this.centumService),
            this.deleteCustomerErrors,
            this.postCustomerWoo,
            "customer"
        );
    
        await processEntities(
            this.getOrderErrors,
            this.orderService.createOrder.bind(this.centumService),
            this.deleteOrderErrors,
            this.postOrderWoo,
            "order"
        );
    };
}
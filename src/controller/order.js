import {OrderService} from '../service/orderService.js';
import {OrderSchema} from '../schemas/orderSchema.js';
import { DEV_MODE } from '../utils/config.js';

const devMode = DEV_MODE || false;

class OrderController{
    constructor() {
        this.orderService = new OrderService();
    }
    newOrderCentum(req, res) {
        //Clean body with schema usign schema utils

        // try to create order

        //Handle responses from the service

        //Respond
        res.send('order centum');
    }
    createOrderCentum = async(req, res) =>{
        //Clean body with schema usign schema utils
        const body = req.body;
        const data = await this.orderService.createOrder(body);
        if (data.status === 500) {
            return res.status(500).send(data);
        }
        if (data.status === 201) {
            return res.status(201).send(data);
        }
    } 
}

export { OrderController };
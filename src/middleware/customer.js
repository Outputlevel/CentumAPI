import { CustomerService } from "../service/customerService.js";
import { CustomerSchema } from "../schemas/index.js";
import { ErrorService } from "../service/errorService.js";

export const isCustomer = async (req, res, next) => {
    const cuit = req.body.cuit;

    if (!cuit || cuit.length !== 11) {
        return res.status(400).json({ status: 400, message: "Cuit is not valid" });
    }

    const customerService = new CustomerService();
    const customerData = await customerService.getCustomerByCuit(cuit);

    const isRegistered = await customerService.isCustomerRegistered(customerData);

    if (isRegistered) {
        res.status(409).json({ status: 409, message: "Customer already exists, syncing with Woo" });

        // Fire and forget Woo sync
        const { IdCliente, Codigo } = customerData.payload.Items[0];
        const wooBody = {
            customer_id: req.body.woo_customer_id,
            customer_id_centum: IdCliente,
            customer_code_centum: Codigo,
        };

        const ES = new ErrorService();
        ES.postCustomerWoo(wooBody).catch(err => {
            console.error("Failed to sync with WooCommerce:", err);
        });

        return; // Important: stop here
    }

    next();
};

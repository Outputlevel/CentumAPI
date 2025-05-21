import { HTTPWorker } from "../utils/httpWorker.js";
import { DEV_MODE, WOO_USERNAME_DEV, WOO_USERNAME_PROD, WOO_AUTH_DEV, WOO_AUTH_PROD, WOO_URL_DEV, WOO_URL_PROD } from "../utils/config.js";

const devMode = DEV_MODE || "true";

const wooUrl = devMode === "true" ? WOO_URL_DEV : WOO_URL_PROD;
const username = devMode === "true" ? WOO_USERNAME_DEV : WOO_USERNAME_PROD;
const appPassword = devMode === "true" ? WOO_AUTH_DEV : WOO_AUTH_PROD;
const token = Buffer.from(`${username}:${appPassword}`).toString('base64');
//Woo headers
const wooAuth = { Authorization: `Basic ${token}==` };


class ErrorsDAO {
    constructor() {
        this.url = `${wooUrl}`;
        this.customerErrorRoute = `${this.url}/customer-failed-requests/`;
        this.customerRoute = `${this.url}/customers/`;
        this.orderErrorRoute = `${this.url}/order-failed-requests/`;
        this.orderRoute = `${this.url}/orders/`;
    }

    async createWorker({ url, method, body = null }) {
        try {
            const http = new HTTPWorker({
                url,
                method,
                body,
                extraHeaders: wooAuth,
            });
            //console.log(`Making ${method} request to ${url}`);
            return await http.init();
        } catch (error) {
            console.error(`Error with ${method} request to ${url}:`, error);
            throw error;
        }
    }

    // === Customers ===

    async getCustomersErrors() {
        return this.createWorker({
            url: this.customerErrorRoute,
            method: 'GET',
        });
    }

    async postCustomerError(body) {
        return this.createWorker({
            url: this.customerErrorRoute,
            method: 'POST',
            body,
        });
    }

    async deleteCustomerErrors(id) {
        return this.createWorker({
            url: this.customerErrorRoute + id,
            method: 'DELETE',
        });
    }

    async postCustomerWoo(body) {
        return this.createWorker({
            url: this.customerRoute,
            method: 'POST',
            body,
        });
    }

    // === Orders ===

    async getOrdersErrors() {
        return this.createWorker({
            url: this.orderErrorRoute,
            method: 'GET',
        });
    }

    async postOrderError(body) {
        return this.createWorker({
            url: this.orderErrorRoute,
            method: 'POST',
            body,
        });
    }

    async deleteOrderErrors(id) {
        return this.createWorker({
            url: this.orderErrorRoute + id,
            method: 'DELETE',
        });
    }

    async postOrderWoo(body) {
        return this.createWorker({
            url: this.orderRoute,
            method: 'POST',
            body,
        });
    }
}


export { ErrorsDAO };
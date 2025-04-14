import { HTTPWorker } from "../utils/httpWorker.js";
import { getFirstKeyValue } from "../utils/helpers.js";
import { API_URL } from "../utils/config.js";

export class CentumDAO {
    constructor() {
        this.url = `${API_URL}`;
        this.url_clientes = `${API_URL}/Clientes`;
        this.url_orders = `${API_URL}/PedidosVenta`;
    }
    async getOrders() {
        const http = new HTTPWorker({url: this.url_orders, method:'GET'});
        const data = await http.init();
        return data;
    }
    async getOrderById(id) {
        const http = new HTTPWorker({url: `${this.url_orders}/${id}`, method:'GET'});
        const data = await http.init();
        return data;
    }
    async generateCustomerCode(code) {
        const data = await this.getCustomerByCode(code);
        return data;
    }
    //Post
    async createOrder(order) {
        const http = new HTTPWorker({url: this.url_orders, method:'POST', body: order});
        const data = await http.init();
        return data;
    }
    async getCustomers() {
        const http = new HTTPWorker({url: this.url_clientes, method:'GET'});
        const data = await http.init();
        return data;
    }
    async getCustomerById(id) {
        const http = new HTTPWorker({url: `${this.url_clientes}/?IdCliente=${id}`, method:'GET'});
        const data = await http.init();
        return data;
    }
    async getCustomerByCode(code) { 
        const http = new HTTPWorker({url: `${this.url_clientes}/?Codigo=${code}`, method:'GET'});
        const data = await http.init();
        return {status: data.status, payload: getFirstKeyValue(data.payload)};
    }
    async getCustomerByCuit(cuit) {
        const http = new HTTPWorker({url: `${this.url_clientes}/?Cuit=${cuit}`, method:'GET'});
        const data = await http.init();
        return data;
    }
    async getCustomerIdByCuit(cuit) {
        const http = new HTTPWorker({url: `${this.url_clientes}/?Cuit=${cuit}`, method:'GET'});
        const data = await http.init();
        return data.payload.Items[0].IdCliente;
    }
    //Post
    async createCustomer(customer) {
        const http = new HTTPWorker({url: this.url_clientes, method:'POST', body: customer});
        const data = await http.init();
        return data;
    }
    async getPaises() {
        const http = new HTTPWorker({url: `${this.url}/Paises`, method:'GET'});
        const data = await http.init();
        return data;
    }
    async getProvincias() {
        const http = new HTTPWorker({url: `${this.url}/Provincias`, method:'GET'});
        const data = await http.init();
        return data;
    }
    async getZonas() {
        const http = new HTTPWorker({url: `${this.url}/Zonas`, method:'GET'});
        const data = await http.init();
        return data;
    }
    async getRubros() {
        const http = new HTTPWorker({url: `${this.url}/Rubros`, method:'GET'});
        const data = await http.init();
        return data;
    }
    //Articulos
    async getArticuloByCode(body) {
        const http = new HTTPWorker({url: `${this.url}/Articulos/Venta`, method:'POST', body: body});
        const data = await http.init();
        return {status: data.status, payload: getFirstKeyValue(getFirstKeyValue(data.payload))[0]};
    }

}
import {CentumDAO} from '../DAO/centumDAO.js';

export class ProductService {
    constructor() {
        this.centumDAO = new CentumDAO();
    }

    getArticuloByCode = async (code) => {
        try {
            const data = await this.centumDAO.getArticuloByCode(code);
            //if (data.payload.Items.length === 0) return null;
            return data;
        } catch (error) {
            console.error("Error getting article by code:", error);
            return null; // Indicating API failure
        }
    }
}
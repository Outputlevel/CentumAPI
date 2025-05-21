import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_KEY, CONSUMER_ID_VALUE } from './config.js';

export class HTTPWorker {
    constructor({ url, method = 'GET', body = null, extraHeaders = {} }) {
        this.url = url;
        this.method = method.toUpperCase();
        this.body = body;
        this.headers = {
            'Content-Type': 'application/json',
            ...extraHeaders,
        };
    }

    setHeaders(customHeaders) {
        this.headers = { ...this.headers, ...customHeaders };
    }

    async #keyGenerator() {
        const guid = uuidv4().replace(/-/g, '').toLowerCase();
        const now = new Date();
        const utcTime = now.toISOString().split('.')[0];
        const publicKey = PUBLIC_KEY;
        const hashInput = `${utcTime} ${guid} ${publicKey}`;
        const hash = crypto.createHash('sha1').update(hashInput).digest('hex').toUpperCase();
        return `${utcTime} ${guid} ${hash}`;
    }
    async getKey(){
        const key = await this.#keyGenerator();
        return key;
    }

    async init() {
        if (!this.url) {
            throw new Error('URL is not set.');
        }

        const token = await this.#keyGenerator();
        const consumerId = CONSUMER_ID_VALUE;
        this.setHeaders({
            "CentumSuiteConsumidorApiPublicaId": consumerId,
            "CentumSuiteAccessToken": token
        });

        try {
            const response = await fetch(this.url, {
                method: this.method,
                headers: this.headers,
                body: this.body ? JSON.stringify(this.body) : null
            });

            const status = response.status;
            const data = await response.json();
            return { status, payload: data };
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }
}

export async function showApiKey(){
    const http = new HTTPWorker({url: 'https://api.centumsuite.com/centum/api/v1/Clientes', method:'GET'});
    const keys = await http.getKey();
    console.log(keys);
    return keys;
}
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
//import { keyGenerator } from "../auth/hashGen.js";
process.loadEnvFile();


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
        const publicKey = process.env.PUBLIC_KEY;
        const hashInput = `${utcTime} ${guid} ${publicKey}`;
        const hash = crypto.createHash('sha1').update(hashInput).digest('hex').toUpperCase();
        return `${utcTime} ${guid} ${hash}`;
    }

    async init() {
        if (!this.url) {
            throw new Error('URL is not set.');
        }

        const token = await this.#keyGenerator();
        const consumerId = process.env.CONSUMER_ID_VALUE;
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

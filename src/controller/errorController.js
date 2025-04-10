import { ErrorService } from "../service/errorService.js";
export class ErrorController {
    constructor() {
        this.errorsService = new ErrorService();
    }
    handleErrors = async (req, res) => {
        try {
            res.status(200).send({ status: 200, message: "OK" }); //close stream
            // Call the error handling service
            return await this.errorsService.handleErrors();
        } catch (error) {
            console.error("Error posting errors to Centum:", error);
            res.status(500).send({ status: 500, message: "Internal Server Error" });
        }
    };
}
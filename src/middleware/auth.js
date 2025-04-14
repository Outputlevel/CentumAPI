import { DEV_MODE, AUTH_HEADER, AUTH_KEY } from "../utils/config.js";

export const auth = async (req, res, next) => {
    try {
        const devMode = DEV_MODE ? DEV_MODE: "false";                                                                                    
        const header = AUTH_HEADER;
        const expectedToken = AUTH_KEY;
        if (devMode === "true") {
            return next(); // Skip auth in dev mode
        }

        if (!header || !expectedToken) {
            console.error("Auth environment variables not set.");
            return res.status(500).json({ message: "Internal Server Error" });
        }

        const token = req.get(header)?.trim();

        if (!token || token !== expectedToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        next();
    } catch (error) {
        console.error("Error in auth middleware:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
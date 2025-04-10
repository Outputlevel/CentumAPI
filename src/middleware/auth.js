process.loadEnvFile();


export const auth = async (req, res, next) => {
    try {
        const devMode = process.env.DEV_MODE ? process.env.DEV_MODE: "false";                                                                                    
        const header = process.env.AUTH_HEADER;
        const expectedToken = process.env.AUTH_KEY;
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
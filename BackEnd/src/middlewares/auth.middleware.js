const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // extract token from "Bearer <token>"

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified.id; // or req.user = verified;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = auth;
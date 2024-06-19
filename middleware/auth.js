import jwt from "jsonwebtoken";
import "dotenv/config";
const JWT_SECRET = process.env.JWT_SECRET;


export const verifyToken = async (req, res, next) => {
    try {
        let header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(403).send("Access Denied");
        }
        
        const token = header.split(" ")[1];
        const verify = jwt.verify(token, JWT_SECRET);

        if (verify.user) {
            req.userId = verify.user.id;
            next();
        } else {
            return res.status(500).json({
                error: error.message
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
} 
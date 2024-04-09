
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret = 'your_jwt_secret'; // This should be in an environment variable

interface UserPayload {
    // Define the properties of the user payload
    // Example: id: string;
}
declare module 'express-serve-static-core' {
    interface UserPayload {
        id: string;
      }
    
      interface Request {
        user?: UserPayload;
      }
}


const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Look for the token in the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) return res.sendStatus(401); // If no token, return Unauthorized

    jwt.verify(token, secret, (err: jwt.VerifyErrors | null, user: UserPayload | undefined) => {
        if (err) return res.sendStatus(403); // If token is invalid or expired, return Forbidden
        req.user = user as import("c:/Users/truma/dev-tk/happin-test/node_modules/@types/express-serve-static-core/index").UserPayload; // Add the user payload to the request
        next(); // Proceed to the next middleware or request handler
    });
};

module.exports = authMiddleware;

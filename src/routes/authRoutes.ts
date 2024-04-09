import express, { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';

const router: Router = express.Router();

const users = [{ username: 'user1', password: 'pass1' }]; // Example user, replace with your DB call
const secret = 'your_jwt_secret'; // Move this to an environment variable

/**
 * Handles the login request and generates a JWT token for the authenticated user.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
router.post('/login', (req: Request, res: Response) => {
    const { username, password }: { username: string, password: string } = req.body;

    // Replace this with your database lookup and password hash checking
    const user = users.find((u: { username: string, password: string }) => u.username === username && u.password === password);
    
    if (!user) {
        return res.status(401).send('Invalid username or password');
    }

    /**
     * Represents the payload of the JWT token.
     */
    interface Payload {
        username: string;
    }

    const payload: Payload = {
        username: user.username,
    };

    const token: string = jwt.sign(payload, secret, { expiresIn: '1h' });

    res.json({ token }); // Send the token to the client
});

module.exports = router;

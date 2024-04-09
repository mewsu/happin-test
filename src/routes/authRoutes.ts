const express = require('express');
const jwt = require('jsonwebtoken');
import { Request, Response } from 'express';
const router = express.Router();

const users = [{ username: 'user1', password: 'pass1' }]; // Example user, replace with your DB call
const secret = 'your_jwt_secret'; // Move this to an environment variable
router.post('/login', (req: Request, res: Response) => {
    const { username, password }: { username: string, password: string } = req.body;

    // Replace this with your database lookup and password hash checking
    const user = users.find((u: { username: string, password: string }) => u.username === username && u.password === password);
    
    if (!user) {
        return res.status(401).send('Invalid username or password');
    }

    interface Payload {
        username: string;
        // You can add more user properties here
    }

    const payload: Payload = {
        username: user.username,
        // You can add more user properties here
    };

    const token: string = jwt.sign(payload, secret, { expiresIn: '1h' }); // Adjust token expiration as needed

    res.json({ token }); // Send the token to the client
});

module.exports = router;

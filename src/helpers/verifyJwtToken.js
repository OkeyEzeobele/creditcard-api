import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default (token, secret = process.env.JWT_KEY) => jwt.verify(token, secret);

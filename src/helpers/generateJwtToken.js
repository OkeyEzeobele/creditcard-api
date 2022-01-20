import jwt from 'jsonwebtoken';

export default (payload, key, expiresIn) => {
  const secretKey = key || process.env.JWT_KEY;
  const token = jwt.sign(payload, secretKey, {
    expiresIn: expiresIn || process.env.JWT_EXPIRY,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
  });

  return token;
};

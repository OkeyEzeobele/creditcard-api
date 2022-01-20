import jwt from 'jsonwebtoken';

import { respondWithWarning } from '../helpers/httpResponse';

const isAdmin = (req, res, next) => {
  try {
    const { authorization, token: headerToken } = req.headers;
    const token = (authorization && authorization.split(' ')[1]) || headerToken;
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    if (!decoded.role) {
      return respondWithWarning(res, 403, 'Forbidden, Only Admins are allowed to perform this action');
    }

    req.adminData = decoded;
    req.isAdmin = true;

    return next();
  } catch (error) {
    return respondWithWarning(res, 403, 'Forbidden, Only Admins are allowed to perform this action');
  }
};

export default isAdmin;

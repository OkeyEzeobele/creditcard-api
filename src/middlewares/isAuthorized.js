import jwt from 'jsonwebtoken';
import db from '../db';

import { respondWithWarning } from '../helpers/httpResponse';
import logger from '../helpers/logger';

const isAuthorized = (req, res, next) => {
  try {
    const { authorization, token: headerToken } = req.headers;
    const token = (authorization && authorization.split(' ')[1]) || headerToken;
    // console.log(token, '----------', process.env.JWT_KEY);
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    if (!decoded) {
      return respondWithWarning(res, 401, 'Authorization required for this action');
    }

    // const user = await db.user.findOne({
    //   where: { id: decoded.id },
    // });

    // if (!user) {
    //   return respondWithWarning(res, 401, 'Invalid Authorization token');
    // }

    req.userData = decoded;
    return next();
  } catch (error) {
    logger.error({
      message: 'An Error Occured',
      error,
    });
    return respondWithWarning(res, 401, 'Authentication Failed');
  }
};

export default isAuthorized;
